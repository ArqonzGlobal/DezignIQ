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
    const apiKey = Deno.env.get('MNML_STYLE_TRANSFER_API_KEY');
    if (!apiKey) {
      console.error('MNML_STYLE_TRANSFER_API_KEY not found in environment variables');
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
    const referenceImage = formData.get('reference_image') as File;
    const prompt = formData.get('prompt') as string || "Apply artistic watercolor style";
    const strength = parseFloat(formData.get('strength') as string) || 0.7;
    const preserveStructure = formData.get('preserve_structure') === 'true';
    const colorPreservation = parseFloat(formData.get('color_preservation') as string) || 0.3;

    // Validate required parameters
    if (!image || !referenceImage) {
      return new Response(
        JSON.stringify({ error: 'Both image and reference_image are required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Style transfer request:', { 
      prompt, 
      strength, 
      preserveStructure, 
      colorPreservation,
      imageSize: image.size,
      referenceImageSize: referenceImage.size
    });

    // Prepare form data for API call
    const apiFormData = new FormData();
    apiFormData.append('image', image);
    apiFormData.append('reference_image', referenceImage);
    apiFormData.append('prompt', prompt);
    apiFormData.append('strength', strength.toString());
    apiFormData.append('preserve_structure', preserveStructure.toString());
    apiFormData.append('color_preservation', colorPreservation.toString());

    // Make request to mnml.ai API
    const response = await fetch('https://api.mnmlai.dev/v1/style/transfer', {
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
          error: responseData.error || 'Style transfer failed',
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