import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const apiKey = Deno.env.get("MNML_INTERIOR_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "API key missing" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const inputForm = await req.formData();
    const image = inputForm.get("image") as File;
    if (!image) {
      return new Response(JSON.stringify({ error: "Image is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // your parameters from frontend
    const prompt = inputForm.get("prompt") || "";
    const imagetype = inputForm.get("imagetype") || "photo";
    const camera_angle = inputForm.get("camera_angle") || "same_as_input";
    const scene_mood = inputForm.get("scene_mood") || "auto_daylight";
    const render_style = inputForm.get("render_style") || "realistic";
    const render_scenario = inputForm.get("render_scenario") || "precise";
    const context = inputForm.get("context") || "[]";
    const seed = inputForm.get("seed") || "";

    // Build MNML v4.1 request
    const mnmlForm = new FormData();
    mnmlForm.append("image", image);
    mnmlForm.append("expert_name", "interior"); // YOU can change
    mnmlForm.append("prompt", prompt);
    mnmlForm.append("imagetype", imagetype);
    mnmlForm.append("camera_angle", camera_angle);
    mnmlForm.append("scene_mood", scene_mood);
    mnmlForm.append("render_style", render_style);
    mnmlForm.append("render_scenario", render_scenario);
    mnmlForm.append("context", context);
    mnmlForm.append("seed", seed);

    console.log("Calling MNML v4.1...");

    const response = await fetch(
      "https://api.mnmlai.dev/v1/archDiffusion-v41",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Accept": "application/json",
        },
        body: mnmlForm,
      }
    );

    const text = await response.text();
    let json;

    try {
      json = JSON.parse(text);
    } catch {
      json = { raw: text };
    }

    if (!response.ok) {
      return new Response(
        JSON.stringify({
          error: "MNML API error",
          status: response.status,
          details: json,
        }),
        {
          status: response.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(JSON.stringify(json), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (err) {
    return new Response(
      JSON.stringify({
        error: err.message || "Internal server error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
