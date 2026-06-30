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
          const htmlContent = `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
              <h2 style="color: #2B1A12;">Order Confirmation</h2>
              <p>Hello ${orderData.customer_name || 'Valued Customer'},</p>
              <p>Thank you for your purchase! We have successfully received your payment for order <strong>#${orderData.id.substring(0,8).toUpperCase()}</strong>.</p>
              <p><strong>Total Amount:</strong> ₦${orderData.total.toLocaleString()}</p>
              <p>We are now processing your order and will notify you once it ships.</p>
              <br/>
              <p>Best regards,<br/>Himbalin Enterprise</p>
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
