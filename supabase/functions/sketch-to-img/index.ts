import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-requested-with',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Max-Age': '86400',
}

serve(async (req) => {
  console.log(`[SKETCH-TO-IMG] ${new Date().toISOString()} - ${req.method} request received`);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('[SKETCH-TO-IMG] Handling CORS preflight request');
    return new Response('ok', { 
      headers: corsHeaders,
      status: 200 
    })
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { 
        status: 405, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }

  try {
    console.log('[SKETCH-TO-IMG] Processing sketch-to-img request');
    
    const formData = await req.formData()
    const image = formData.get('image') as File
    const prompt = formData.get('prompt') as string
    const style = formData.get('style') as string || 'photorealistic'
    const detailLevel = formData.get('detail_level') as string || 'high'
    const colorMode = formData.get('color_mode') as string || 'full_color'
    const lighting = formData.get('lighting') as string || 'natural'

    console.log('[SKETCH-TO-IMG] Request parameters:', { 
      hasImage: !!image, 
      prompt: prompt?.substring(0, 100) + '...',
      style,
      detailLevel,
      colorMode,
      lighting
    });

    if (!image || !prompt) {
      console.error('[SKETCH-TO-IMG] Missing image or prompt');
      return new Response(
        JSON.stringify({ error: 'Missing image or prompt' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const apiKey = Deno.env.get('MNML_API_KEY')
    if (!apiKey) {
      console.error('[SKETCH-TO-IMG] MNML_API_KEY not found');
      return new Response(
        JSON.stringify({ error: 'API key not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('[SKETCH-TO-IMG] Calling mnml sketch-to-img API...');
    
    // Create form data for mnml API
    const mnmlFormData = new FormData()
    mnmlFormData.append('image', image)
    mnmlFormData.append('prompt', prompt)
    mnmlFormData.append('style', style)
    mnmlFormData.append('detail_level', detailLevel)
    mnmlFormData.append('color_mode', colorMode)
    mnmlFormData.append('lighting', lighting)

    // Call mnml API
    const response = await fetch('https://api.mnmlai.dev/v1/sketch-to-img', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
      body: mnmlFormData,
    })

    console.log('[SKETCH-TO-IMG] mnml API response status:', response.status);
    
    const data = await response.json()
    console.log('[SKETCH-TO-IMG] mnml API response data:', data);

    if (!response.ok) {
      console.error('[SKETCH-TO-IMG] API request failed:', data);
      return new Response(
        JSON.stringify({ error: 'API request failed', details: data }),
        { 
          status: response.status, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('[SKETCH-TO-IMG] Request successful');
    return new Response(
      JSON.stringify(data),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('[SKETCH-TO-IMG] Error:', error)
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