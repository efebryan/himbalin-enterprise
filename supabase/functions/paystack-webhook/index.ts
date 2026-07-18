// @ts-ignore
import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
// @ts-ignore
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.10.0"

declare const Deno: any;

serve(async (req: Request) => {
  try {
    const paystackSecretKey = Deno.env.get('PAYSTACK_SECRET_KEY')
    if (!paystackSecretKey) throw new Error('Missing PAYSTACK_SECRET_KEY')

    // 1. Get request body as text for signature verification
    const bodyText = await req.text()
    console.log('Webhook received:', bodyText.substring(0, 100) + '...')

    // 2. Verify Paystack signature
    const signature = req.headers.get('x-paystack-signature')

    const encoder = new TextEncoder()
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(paystackSecretKey),
      { name: 'HMAC', hash: 'SHA-512' },
      false,
      ['sign']
    )

    const signatureBuffer = await crypto.subtle.sign(
      'HMAC',
      key,
      encoder.encode(bodyText)
    )

    const hashArray = Array.from(new Uint8Array(signatureBuffer))
    const expectedSignature = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')

    if (signature !== expectedSignature) {
      console.error('Invalid signature. Received:', signature, 'Expected:', expectedSignature)
      return new Response('Invalid signature', { status: 400 })
    }

    // 3. Parse JSON body
    const event = JSON.parse(bodyText)

    // 4. Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // 5. Handle charge.success event
    if (event.event === 'charge.success') {
      const reference = event.data.reference
      console.log('Processing charge.success for reference:', reference)

      // Try to find order by paystack_reference first, then fallback to order id
      let orderData: any = null

      const { data: byRef } = await supabaseClient
        .from('orders')
        .select()
        .eq('paystack_reference', reference)
        .maybeSingle()

      if (byRef) {
        orderData = byRef
        console.log('Order found by paystack_reference:', orderData.id)
      } else {
        const { data: byId } = await supabaseClient
          .from('orders')
          .select()
          .eq('id', reference)
          .maybeSingle()
        if (byId) {
          orderData = byId
          console.log('Order found by id:', orderData.id)
        }
      }

      if (!orderData) {
        console.error('No order found for reference:', reference)
        // Return 200 so Paystack does not keep retrying
        return new Response('Order not found', { status: 200 })
      }

      // Update order status to Paid and save reference
      await supabaseClient
        .from('orders')
        .update({ status: 'Paid', paystack_reference: reference })
        .eq('id', orderData.id)

      console.log(`Successfully updated order ${orderData.id} to Paid`)

      // Send Invoice Email directly via Resend API
      if (orderData.customer_email) {
        try {
          const resendApiKey = Deno.env.get('RESEND_API_KEY')
          if (!resendApiKey) throw new Error('Missing RESEND_API_KEY')

          const fromEmail = Deno.env.get('RESEND_FROM_EMAIL') || 'Himbalin Enterprise <shop@himbalinenterprise.com>'

          const itemsList = Array.isArray(orderData.items)
            ? orderData.items.map((item: any) => `
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name || 'Item'} x ${item.quantity || 1}</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">&#8358;${((item.price || 0) * (item.quantity || 1)).toLocaleString()}</td>
              </tr>
            `).join('')
            : '<tr><td colspan="2" style="padding:10px;">No item details available.</td></tr>'

          const htmlContent = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">
              <div style="text-align: center; margin-bottom: 20px;">
                <h1 style="color: #2B1A12; margin: 0;">Purchase Invoice</h1>
                <p style="color: #666; margin-top: 5px;">Himbalin Enterprise</p>
              </div>
              <p>Hello <strong>${orderData.customer_name || 'Valued Customer'}</strong>,</p>
              <p>Thank you for your purchase. We have successfully received your payment. Below is your invoice:</p>

              <div style="background-color: #f9f9f9; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
                <p style="margin: 0;"><strong>Order Number:</strong> #${orderData.id.substring(0, 8).toUpperCase()}</p>
                <p style="margin: 5px 0 0 0;"><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
              </div>

              <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                <thead>
                  <tr>
                    <th style="padding: 10px; border-bottom: 2px solid #ccc; text-align: left; background-color: #f5f5f5;">Item Description</th>
                    <th style="padding: 10px; border-bottom: 2px solid #ccc; text-align: right; background-color: #f5f5f5;">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsList}
                </tbody>
                <tfoot>
                  <tr>
                    <td style="padding: 10px; font-weight: bold; text-align: right; border-top: 2px solid #ccc;">Total Amount Paid</td>
                    <td style="padding: 10px; font-weight: bold; text-align: right; color: #2B1A12; border-top: 2px solid #ccc;">&#8358;${(orderData.total || 0).toLocaleString()}</td>
                  </tr>
                </tfoot>
              </table>

              <p>We are now processing your order and will notify you once it ships.</p>
              <p style="color: #888; font-size: 12px; margin-top: 30px; text-align: center;">For support, contact us at shop@himbalinenterprise.com</p>
            </div>
          `

          const resendResponse = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${resendApiKey}`,
            },
            body: JSON.stringify({
              from: fromEmail,
              to: orderData.customer_email,
              subject: `Your Invoice - Order #${orderData.id.substring(0, 8).toUpperCase()}`,
              html: htmlContent,
            }),
          })

          const resendData = await resendResponse.json()
          if (!resendResponse.ok) {
            console.error('Resend error:', JSON.stringify(resendData))
          } else {
            console.log(`Invoice email sent to ${orderData.customer_email}:`, JSON.stringify(resendData))
          }
        } catch (emailError: any) {
          console.error('Failed to send invoice email:', emailError.message)
        }
      } else {
        console.warn('No customer_email on order, skipping invoice email.')
      }
    }

    return new Response('OK', { status: 200 })
  } catch (error: any) {
    console.error('Webhook error:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
})
