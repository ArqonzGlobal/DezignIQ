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
    const apiKey = Deno.env.get('MNML_4K_UPSCALER_API_KEY');
    if (!apiKey) {
      console.error('MNML_4K_UPSCALER_API_KEY not found in environment variables');
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
    const scale = parseInt(formData.get('scale') as string) || 2;
    const faceEnhance = formData.get('face_enhance') === 'true';

    // Validate required parameters
    if (!image) {
      return new Response(
        JSON.stringify({ error: 'Image is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Validate scale parameter
    if (![2, 4, 8].includes(scale)) {
      return new Response(
        JSON.stringify({ error: 'Scale must be 2, 4, or 8' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('4K upscaler request:', { 
      scale,
      faceEnhance,
      imageSize: image.size
    });

    // Prepare form data for API call
    const apiFormData = new FormData();
    apiFormData.append('image', image);
    apiFormData.append('scale', scale.toString());
    apiFormData.append('face_enhance', faceEnhance.toString());

    // Make request to mnml.ai API
    const response = await fetch('https://api.mnmlai.dev/v1/upscale', {
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
          error: responseData.error || '4K upscaling failed',
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