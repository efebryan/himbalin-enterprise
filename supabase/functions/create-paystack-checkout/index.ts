// @ts-ignore
import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
// @ts-ignore
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.10.0"

declare const Deno: any;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { customerName, customerEmail, phone, address, city, items, total } = await req.json()

    // 1. Validate required fields
    if (!customerEmail || !total) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // 2. Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // 3. Create a pending order in the database
    // Note: total is in base currency (e.g., NGN). Paystack requires kobo/cents.
    const { data: order, error: orderError } = await supabaseClient
      .from('orders')
      .insert({
        customer_name: customerName,
        customer_email: customerEmail,
        phone: phone || null,
        address: address || null,
        city: city || null,
        items,
        total,
        status: 'Pending',
      })
      .select()
      .single()

    if (orderError) throw orderError

    // 4. Initialize Paystack transaction
    const paystackSecretKey = Deno.env.get('PAYSTACK_SECRET_KEY')
    if (!paystackSecretKey) throw new Error('Missing PAYSTACK_SECRET_KEY')

    // Paystack expects amount in kobo/cents (multiply by 100)
    const amountInKobo = Math.round(total * 100)

    const paystackResponse = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${paystackSecretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: customerEmail,
        amount: amountInKobo,
        reference: order.id, // Use order ID as reference
        callback_url: `${req.headers.get('origin') || 'http://localhost:5173'}/payment-success`,
        metadata: {
          order_id: order.id,
          customer_name: customerName,
          custom_fields: [
            {
              display_name: "Customer Name",
              variable_name: "customer_name",
              value: customerName
            }
          ]
        }
      }),
    })

    const paystackData = await paystackResponse.json()

    if (!paystackData.status) {
      throw new Error(`Paystack error: ${paystackData.message}`)
    }

    // 5. Update order with Paystack reference
    await supabaseClient
      .from('orders')
      .update({ paystack_reference: paystackData.data.reference })
      .eq('id', order.id)

    // 6. Return authorization URL to frontend
    return new Response(
      JSON.stringify({ 
        authorizationUrl: paystackData.data.authorization_url,
        reference: paystackData.data.reference 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
