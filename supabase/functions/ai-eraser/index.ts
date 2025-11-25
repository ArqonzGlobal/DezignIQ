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
    const apiKey = Deno.env.get('MNML_AI_ERASER_API_KEY');
    if (!apiKey) {
      console.error('MNML_AI_ERASER_API_KEY not found in environment variables');
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
    const mask = formData.get('mask') as File;
    const outputFormat = formData.get('output_format') as string || 'png';

    // Validate required parameters
    if (!image || !mask) {
      return new Response(
        JSON.stringify({ error: 'Both image and mask are required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Validate output format
    if (!['png', 'jpg', 'jpeg'].includes(outputFormat)) {
      return new Response(
        JSON.stringify({ error: 'Invalid output format. Must be png, jpg, or jpeg' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('AI eraser request:', { 
      outputFormat,
      imageSize: image.size,
      maskSize: mask.size
    });

    // Prepare form data for API call
    const apiFormData = new FormData();
    apiFormData.append('image', image);
    apiFormData.append('mask', mask);
    apiFormData.append('output_format', outputFormat);

    // Make request to mnml.ai API
    const response = await fetch('https://api.mnmlai.dev/v1/ai-eraser', {
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
          error: responseData.error || 'AI eraser failed',
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