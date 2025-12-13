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
    const apiKey = Deno.env.get('MNML_VIRTUAL_STAGING_API_KEY');
    if (!apiKey) {
      console.error('MNML_VIRTUAL_STAGING_API_KEY not found in environment variables');
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
    const seed = formData.get('seed') ? parseInt(formData.get('seed') as string) : Math.floor(Math.random() * 1000000);

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

    // Validate prompt length
    if (prompt.length > 2000) {
      return new Response(
        JSON.stringify({ error: 'Prompt must be less than 2000 characters' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Virtual staging request:', { 
      prompt, 
      seed,
      imageSize: image.size
    });

    // Prepare form data for API call
    const apiFormData = new FormData();
    apiFormData.append('image', image);
    apiFormData.append('prompt', prompt);
    apiFormData.append('seed', seed.toString());

    // Make request to mnml.ai API
    const response = await fetch('https://api.mnmlai.dev/v2/virtual-staging-ai', {
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
          error: responseData.error || 'Virtual staging failed',
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