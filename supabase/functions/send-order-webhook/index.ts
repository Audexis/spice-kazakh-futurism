import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { customer_email, customer_whatsapp, order_items, total_amount } = await req.json();

    const embedData = {
      embeds: [{
        title: "🛒 New Order Received",
        color: 0x00ff00, // Green color
        fields: [
          {
            name: "📧 Customer Email",
            value: customer_email,
            inline: true
          },
          {
            name: "📱 WhatsApp Number",
            value: customer_whatsapp,
            inline: true
          },
          {
            name: "💰 Total Amount",
            value: `₸${total_amount.toFixed(2)}`,
            inline: true
          },
          {
            name: "📦 Order Items",
            value: order_items.map((item: any) => 
              `**${item.product_name}** x${item.quantity} - ₸${(item.price * item.quantity).toFixed(2)}`
            ).join('\n'),
            inline: false
          }
        ],
        timestamp: new Date().toISOString(),
        footer: {
          text: "Kazakhstani Spice Marketplace"
        }
      }]
    };

    const webhookUrl = "https://discord.com/api/webhooks/1402690585252331663/38yGuvSsf67KDgRCFhpIIVelYEef2RdujF6pNphggVK4c_Kes0WoTGKMoC3YinFra6nz";
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(embedData)
    });

    if (!response.ok) {
      throw new Error(`Discord webhook failed: ${response.status}`);
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Order notification sent to Discord' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in send-order-webhook:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to send order notification',
        message: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
})