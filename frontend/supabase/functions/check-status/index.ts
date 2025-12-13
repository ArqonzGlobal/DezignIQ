import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { storeImageHistory } from "../mongo/index";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-requested-with',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Max-Age': '86400',
}

serve(async (req) => {
  console.log(`[CHECK-STATUS] ${new Date().toISOString()} - ${req.method} request received`);
  
  if (req.method === 'OPTIONS') {
    console.log('[CHECK-STATUS] Handling CORS preflight request');
    return new Response('ok', { 
      headers: corsHeaders,
      status: 200 
    })
  }

  try {
    console.log('[CHECK-STATUS] Processing status check request');
    
    // Parse JSON body for POST requests, URL params for GET requests
    let id;
    if (req.method === 'POST') {
      const body = await req.json();
      id = body.id;
      console.log('[CHECK-STATUS] POST request, id from body:', id);
    } else {
      const url = new URL(req.url);
      id = url.searchParams.get('id');
      console.log('[CHECK-STATUS] GET request, id from params:', id);
    }

    if (!id) {
      console.error('[CHECK-STATUS] Missing id parameter');
      return new Response(
        JSON.stringify({ error: 'Missing id parameter' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Try to get any available API key (Interior, Exterior, or legacy)
    const apiKey = Deno.env.get('MNML_INTERIOR_API_KEY') || 
                   Deno.env.get('MNML_EXTERIOR_API_KEY') || 
                   Deno.env.get('MNML_API_KEY');
                   
    if (!apiKey) {
      console.error('[CHECK-STATUS] No mnml API key configured');
      return new Response(
        JSON.stringify({ error: 'No mnml API key configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('[CHECK-STATUS] Calling mnml status API for id:', id);
    
    // Call mnml status API
    const response = await fetch(`https://api.mnmlai.dev/v1/status/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    })

    console.log('[CHECK-STATUS] mnml API response status:', response.status);
    
    const data = await response.json()
    console.log('[CHECK-STATUS] mnml API response data:', data);

    if (!response.ok) {
      console.error('[CHECK-STATUS] Status check failed:', data);
      return new Response(
        JSON.stringify({ error: 'Status check failed', details: data }),
        { 
          status: response.status, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('[CHECK-STATUS] Status check successful');
    // storeImageHistory(data.userEmail, data.prompt, data.message?.[0] || '');

    const imageurl = data?.data.message?.[0] || '';
    const storeResult = await storeImageHistory(
      "vennilavanmarimuthu@gmail.com",
      data.prompt || "",
      imageurl
    );
    const responsePayload = {
      ...data,
      store: storeResult 
    };

    return new Response(JSON.stringify(responsePayload), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error('[CHECK-STATUS] Error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : String(error) 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})