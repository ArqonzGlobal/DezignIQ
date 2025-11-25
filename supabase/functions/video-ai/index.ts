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
    const MNML_API_KEY = Deno.env.get('MNML_VIDEO_AI_API_KEY');
    if (!MNML_API_KEY) {
      console.error('MNML_VIDEO_AI_API_KEY not configured');
      throw new Error('API key not configured');
    }

    const formData = await req.formData();
    const image = formData.get('image') as File;
    const prompt = formData.get('prompt') as string;
    const duration = formData.get('duration') as string || '10';
    const cfgScale = formData.get('cfg_scale') as string || '0.5';
    const aspectRatio = formData.get('aspect_ratio') as string || '16:9';
    const negativePrompt = formData.get('negative_prompt') as string;
    const movementType = formData.get('movement_type') as string || 'horizontal';
    const direction = formData.get('direction') as string || 'left';

    if (!image) {
      throw new Error('No image provided');
    }

    if (!prompt) {
      throw new Error('No prompt provided');
    }

    console.log('Submitting to Video AI API...');
    
    const apiFormData = new FormData();
    apiFormData.append('image', image);
    apiFormData.append('prompt', prompt);
    apiFormData.append('duration', duration);
    apiFormData.append('cfg_scale', cfgScale);
    apiFormData.append('aspect_ratio', aspectRatio);
    apiFormData.append('movement_type', movementType);
    apiFormData.append('direction', direction);
    
    if (negativePrompt) {
      apiFormData.append('negative_prompt', negativePrompt);
    }

    const response = await fetch('https://api.mnmlai.dev/v1/video-ai', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MNML_API_KEY}`,
      },
      body: apiFormData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Video AI API error:', response.status, errorText);
      throw new Error(`API request failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Video AI API response:', data);

    if (data.status === 'success' && data.id) {
      return new Response(
        JSON.stringify({
          status: 'success',
          id: data.id,
          seed: data.seed,
        }),
        { 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          } 
        }
      );
    } else {
      throw new Error('Video generation failed to start');
    }

  } catch (error) {
    console.error('Error in video-ai function:', error);
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