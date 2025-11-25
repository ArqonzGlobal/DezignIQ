import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-requested-with',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Max-Age': '86400',
}

serve(async (req) => {
  console.log(`[INTERIOR-AI] ${new Date().toISOString()} - ${req.method} request received`);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('[INTERIOR-AI] Handling CORS preflight request');
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
    console.log('Interior AI Edge Function called');

    // Get the API key from environment variables
    const apiKey = Deno.env.get('MNML_INTERIOR_API_KEY');
    if (!apiKey) {
      console.error('MNML_INTERIOR_API_KEY not found');
      return new Response(
        JSON.stringify({ error: 'API key not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Parse the form data from the request
    const formData = await req.formData();
    const image = formData.get('image') as File;
    const prompt = formData.get('prompt') as string;
    const imageType = formData.get('imageType') as string || '3dmass';
    const scenario = formData.get('scenario') as string || 'creative';
    const geometry_input = formData.get('geometry_input') as string || '75';
    const styles = formData.get('styles') as string || 'realistic';
    const renderspeed = formData.get('renderspeed') as string || 'best';

    console.log('Request parameters:', { 
      hasImage: !!image, 
      prompt, 
      imageType, 
      scenario, 
      geometry_input, 
      styles, 
      renderspeed 
    });

    if (!image || !prompt) {
      return new Response(
        JSON.stringify({ error: 'Image and prompt are required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Create form data for the mnml API
    const mnmlFormData = new FormData();
    mnmlFormData.append('image', image);
    mnmlFormData.append('prompt', prompt);
    mnmlFormData.append('imageType', imageType);
    mnmlFormData.append('scenario', scenario);
    mnmlFormData.append('geometry_input', geometry_input);
    mnmlFormData.append('styles', styles);
    mnmlFormData.append('renderspeed', renderspeed);

    console.log('Calling mnml Interior API...');

    // Make request to mnml Interior API
    const response = await fetch('https://api.mnmlai.dev/v1/interior', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
      body: mnmlFormData,
    });

    console.log('mnml API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('mnml API error:', errorText);
      return new Response(
        JSON.stringify({ error: `mnml API error: ${response.status} - ${errorText}` }),
        { 
          status: response.status, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const result = await response.json();
    console.log('mnml API result:', result);

    return new Response(
      JSON.stringify(result),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Edge Function error:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Internal server error' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
})