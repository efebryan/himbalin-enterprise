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

    // 5. Handle events
    if (event.event === 'charge.success') {
      const reference = event.data.reference
      const status = 'Paid'

      // Update order status in database
      const { data: orderData, error } = await supabaseClient
        .from('orders')
        .update({ status })
        .eq('paystack_reference', reference) // or .eq('id', reference)
        .select()
        .single()

      if (error) {
        console.error('Error updating order:', error)
        return new Response('Error updating database', { status: 500 })
      }

      console.log(`Successfully processed payment for order reference: ${reference}`)

      // Send Order Confirmation Email
      if (orderData && orderData.customer_email) {
        try {
          const itemsList = Array.isArray(orderData.items) 
            ? orderData.items.map((item: any) => `
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name || 'Item'} x ${item.quantity || 1}</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₦${((item.price || 0) * (item.quantity || 1)).toLocaleString()}</td>
              </tr>
            `).join('') 
            : '';

          const htmlContent = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">
              <div style="text-align: center; margin-bottom: 20px;">
                <h1 style="color: #2B1A12; margin: 0;">Purchase Invoice</h1>
                <p style="color: #666; margin-top: 5px;">Himbalin Enterprise</p>
              </div>
              <p>Hello <strong>${orderData.customer_name || 'Valued Customer'}</strong>,</p>
              <p>Thank you for your purchase. We have successfully received your payment. Below is your invoice:</p>
              
              <div style="background-color: #f9f9f9; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
                <p style="margin: 0;"><strong>Order Number:</strong> #${orderData.id.substring(0,8).toUpperCase()}</p>
                <p style="margin: 5px 0 0 0;"><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
              </div>

              <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                <thead>
                  <tr>
                    <th style="padding: 10px; border-bottom: 2px solid #ccc; text-align: left;">Item Description</th>
                    <th style="padding: 10px; border-bottom: 2px solid #ccc; text-align: right;">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsList}
                </tbody>
                <tfoot>
                  <tr>
                    <td style="padding: 10px; font-weight: bold; text-align: right;">Total Amount Paid</td>
                    <td style="padding: 10px; font-weight: bold; text-align: right; color: #F4A623;">₦${(orderData.total || 0).toLocaleString()}</td>
                  </tr>
                </tfoot>
              </table>

              <p>We are now processing your order and will notify you once it ships.</p>
              <p style="color: #888; font-size: 12px; margin-top: 30px; text-align: center;">If you have any questions, please contact our support team.</p>
            </div>
          `;

          await supabaseClient.functions.invoke('send-email', {
            body: {
              to: orderData.customer_email,
              subject: `Order Confirmation - #${orderData.id.substring(0,8).toUpperCase()}`,
              html: htmlContent
            }
          })
          console.log(`Order confirmation email sent to ${orderData.customer_email}`);
        } catch (emailError) {
          console.error('Failed to send order confirmation email:', emailError);
        }
      }
    }

    return new Response('OK', { status: 200 })
  } catch (error: any) {
    console.error('Webhook error:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
})
