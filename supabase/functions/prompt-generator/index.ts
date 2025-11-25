import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const MNML_API_KEY = Deno.env.get('MNML_PROMPT_GENERATOR_API_KEY');
    if (!MNML_API_KEY) {
      console.error('MNML_PROMPT_GENERATOR_API_KEY not configured');
      throw new Error('API key not configured');
    }

    const formData = await req.formData();
    const image = formData.get('image') as File;
    const prompt = formData.get('prompt') as string;

    if (!image) {
      throw new Error('No image provided');
    }

    console.log('Submitting to Prompt Generator API...');
    
    const apiFormData = new FormData();
    apiFormData.append('image', image);
    if (prompt) {
      apiFormData.append('prompt', prompt);
    }

    const response = await fetch('https://api.mnmlai.dev/v1/prompt-generator', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MNML_API_KEY}`,
      },
      body: apiFormData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Prompt Generator API error:', response.status, errorText);
      throw new Error(`API request failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Prompt Generator API response:', data);

    if (data.status === 'success') {
      return new Response(
        JSON.stringify({
          status: 'success',
          message: data.message,
          prompt: data.prompt,
        }),
        { 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          } 
        }
      );
    } else {
      throw new Error('Prompt generation failed');
    }

  } catch (error) {
    console.error('Error in prompt-generator function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});