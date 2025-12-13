import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Max-Age': '86400',
}

serve(async (req) => {
  console.log(`[IMAGINE-AI] ${new Date().toISOString()} - ${req.method} request received`);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('[IMAGINE-AI] Handling CORS preflight request');
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
    console.log('[IMAGINE-AI] Processing imagine-ai request');
    
    const { prompt, render_type, aspect_ratio, style_strength, seed } = await req.json()

    console.log('[IMAGINE-AI] Request parameters:', { 
      prompt: prompt?.substring(0, 100) + '...',
      render_type,
      aspect_ratio,
      style_strength,
      seed
    });

    if (!prompt) {
      console.error('[IMAGINE-AI] Missing prompt');
      return new Response(
        JSON.stringify({ error: 'Missing prompt' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    if (prompt.length > 2000) {
      console.error('[IMAGINE-AI] Prompt too long');
      return new Response(
        JSON.stringify({ error: 'Prompt must be less than 2000 characters' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const apiKey = Deno.env.get('MNML_IMAGINE_API_KEY')
    if (!apiKey) {
      console.error('[IMAGINE-AI] MNML_IMAGINE_API_KEY not found');
      return new Response(
        JSON.stringify({ error: 'API key not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('[IMAGINE-AI] Calling mnml imagine-ai API...');
    
    // Create form data for mnml API
    const formData = new FormData()
    formData.append('prompt', prompt)
    if (render_type) formData.append('render_type', render_type)
    if (aspect_ratio) formData.append('aspect_ratio', aspect_ratio)
    if (style_strength !== undefined) formData.append('style_strength', style_strength.toString())
    if (seed !== undefined) formData.append('seed', seed.toString())

    // Call mnml API
    const response = await fetch('https://api.mnmlai.dev/v1/imagine-ai', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
      body: formData,
    })

    console.log('[IMAGINE-AI] mnml API response status:', response.status);
    
    const data = await response.json()
    console.log('[IMAGINE-AI] mnml API response data:', data);

    if (!response.ok) {
      console.error('[IMAGINE-AI] API request failed:', data);
      return new Response(
        JSON.stringify({ error: 'API request failed', details: data }),
        { 
          status: response.status, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('[IMAGINE-AI] Request successful');
    return new Response(
      JSON.stringify(data),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('[IMAGINE-AI] Error:', error)
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