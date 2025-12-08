import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-requested-with",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Max-Age": "86400",
};

serve(async (req) => {
  console.log(`[EXTERIOR-AI v4.1] ${new Date().toISOString()} - ${req.method} request received`);

  // Handle CORS
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
    console.log("Exterior AI v4.1 Edge Function called");

    const apiKey = Deno.env.get("MNML_EXTERIOR_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "API key not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const formData = await req.formData();
    const image = formData.get("image") as File;
    const prompt = formData.get("prompt") as string;

    if (!image || !prompt) {
      return new Response(JSON.stringify({ error: "Image and prompt are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // NEW v4.1 fields (defaults added for Exterior AI)
    const imagetype = formData.get("imagetype") || "photo";
    const camera_angle = formData.get("camera_angle") || "same_as_input";
    const scene_mood = formData.get("scene_mood") || "auto_daylight";
    const render_style = formData.get("render_style") || "realistic";
    const render_scenario = formData.get("render_scenario") || "precise";
    const context = formData.get("context") || JSON.stringify(["exterior"]);
    const seed = formData.get("seed") || "";

    console.log("Params:", { prompt, imagetype, camera_angle, scene_mood, render_style, render_scenario });

    // --- Build v4.1 request ---
    const mnmlForm = new FormData();
    mnmlForm.append("image", image);
    mnmlForm.append("expert_name", "exterior"); // IMPORTANT
    mnmlForm.append("prompt", prompt);
    mnmlForm.append("imagetype", imagetype);
    mnmlForm.append("camera_angle", camera_angle);
    mnmlForm.append("scene_mood", scene_mood);
    mnmlForm.append("render_style", render_style);
    mnmlForm.append("render_scenario", render_scenario);
    mnmlForm.append("context", context);
    mnmlForm.append("seed", seed);

    console.log("Calling MNML archDiffusion-v41 API...");

    const response = await fetch("https://api.mnmlai.dev/v1/archDiffusion-v41", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Accept": "application/json",
      },
      body: mnmlForm,
    });

    const text = await response.text();
    let json;

    try {
      json = JSON.parse(text);
    } catch {
      json = { raw: text };
    }

    console.log("MNML v4.1 response status:", response.status);

    if (!response.ok) {
      return new Response(JSON.stringify({ error: "MNML API Error", details: json }), {
        status: response.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(json), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error("Edge Function error:", err);
    return new Response(JSON.stringify({ error: err.message || "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
