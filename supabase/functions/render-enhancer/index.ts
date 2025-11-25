import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { 
          status: 405, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Get the API key from environment variables
    const apiKey = Deno.env.get('MNML_RENDER_ENHANCER_API_KEY');
    if (!apiKey) {
      console.error('MNML_RENDER_ENHANCER_API_KEY not found in environment variables');
      return new Response(
        JSON.stringify({ error: 'API key not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Parse form data
    const formData = await req.formData();
    const image = formData.get('image') as File;
    const prompt = formData.get('prompt') as string;
    const geometry = parseFloat(formData.get('geometry') as string) || 1;
    const creativity = parseFloat(formData.get('creativity') as string) || 0.3;
    const dynamic = parseInt(formData.get('dynamic') as string) || 5;
    const seed = formData.get('seed') ? parseInt(formData.get('seed') as string) : Math.floor(Math.random() * 1000000);
    const sharpen = parseFloat(formData.get('sharpen') as string) || 0.5;

    // Validate required parameters
    if (!image || !prompt) {
      return new Response(
        JSON.stringify({ error: 'Both image and prompt are required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Render enhancer request:', { 
      prompt, 
      geometry, 
      creativity, 
      dynamic, 
      seed,
      sharpen,
      imageSize: image.size
    });

    // Prepare form data for API call
    const apiFormData = new FormData();
    apiFormData.append('image', image);
    apiFormData.append('prompt', prompt);
    apiFormData.append('geometry', geometry.toString());
    apiFormData.append('creativity', creativity.toString());
    apiFormData.append('dynamic', dynamic.toString());
    apiFormData.append('seed', seed.toString());
    apiFormData.append('sharpen', sharpen.toString());

    // Make request to mnml.ai API
    const response = await fetch('https://api.mnmlai.dev/v1/render/enhancer', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
      body: apiFormData,
    });

    const responseData = await response.json();
    console.log('API Response:', responseData);

    if (!response.ok) {
      console.error('API Error:', responseData);
      return new Response(
        JSON.stringify({ 
          error: responseData.error || 'Render enhancement failed',
          details: responseData
        }),
        { 
          status: response.status, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    return new Response(
      JSON.stringify(responseData),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});