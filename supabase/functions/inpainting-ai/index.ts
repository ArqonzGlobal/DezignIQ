import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-requested-with',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Max-Age': '86400',
}

serve(async (req) => {
  console.log(`[INPAINTING-AI] ${new Date().toISOString()} - ${req.method} request received`);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('[INPAINTING-AI] Handling CORS preflight request');
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
    console.log('[INPAINTING-AI] Processing inpainting request');
    
    const formData = await req.formData()
    const image = formData.get('image') as File
    const mask = formData.get('mask') as File
    const prompt = formData.get('prompt') as string || ''
    const negativePrompt = formData.get('negative_prompt') as string || ''
    const seed = formData.get('seed') as string
    const maskType = formData.get('mask_type') as string || 'manual'

    console.log('[INPAINTING-AI] Request parameters:', { 
      hasImage: !!image,
      hasMask: !!mask,
      prompt: prompt?.substring(0, 100) + '...',
      negativePrompt: negativePrompt?.substring(0, 50) + '...',
      seed,
      maskType
    });

    if (!image || !mask) {
      console.error('[INPAINTING-AI] Missing image or mask');
      return new Response(
        JSON.stringify({ error: 'Missing image or mask' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const apiKey = Deno.env.get('MNML_INPAINTING_API_KEY')
    if (!apiKey) {
      console.error('[INPAINTING-AI] MNML_INPAINTING_API_KEY not found');
      return new Response(
        JSON.stringify({ error: 'API key not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('[INPAINTING-AI] Calling mnml inpainting API...');
    
    // Create form data for mnml API
    const mnmlFormData = new FormData()
    mnmlFormData.append('image', image)
    mnmlFormData.append('mask', mask)
    if (prompt) mnmlFormData.append('prompt', prompt)
    if (negativePrompt) mnmlFormData.append('negative_prompt', negativePrompt)
    if (seed) mnmlFormData.append('seed', seed)
    mnmlFormData.append('mask_type', maskType)

    // Call mnml API
    const response = await fetch('https://api.mnmlai.dev/v1/inpaint', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
      body: mnmlFormData,
    })

    console.log('[INPAINTING-AI] mnml API response status:', response.status);
    
    const data = await response.json()
    console.log('[INPAINTING-AI] mnml API response data:', data);

    if (!response.ok) {
      console.error('[INPAINTING-AI] API request failed:', data);
      return new Response(
        JSON.stringify({ error: 'API request failed', details: data }),
        { 
          status: response.status, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('[INPAINTING-AI] Request successful');
    return new Response(
      JSON.stringify(data),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('[INPAINTING-AI] Error:', error)
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