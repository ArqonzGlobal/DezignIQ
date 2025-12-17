from fastapi import FastAPI, File, Form, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import requests, os, time
from dotenv import load_dotenv
from pydantic import BaseModel
import asyncio
import json

load_dotenv()
app = FastAPI(title="MNML Multi-Tool API")

# Allow frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MNML_API_KEY = os.getenv("MNML_API_KEY")
MNML_BASE_URL = "https://api.mnmlai.dev/v1"
MNML_BASE_URL_2  = "https://api.mnmlai.dev/v1"

# 🔧 MNML Tool Registry (v4.1)
MNML_TOOLS = {
    "interior-ai": {
        "endpoint": "/archDiffusion-v41",
        "job_based": True,
        "requires_image": True,
        "default_payload": { "expert_name": "interior" }
    },
    "exterior-ai": {
        "endpoint": "/archDiffusion-v41",
        "job_based": True,
        "requires_image": True,
        "default_payload": { "expert_name": "exterior" }
    },
    "imagine-ai": {
        "endpoint": "/imagine-ai",
        "job_based": True,
        "requires_image": False
    },
    "video-ai": {
        "endpoint": "/video-ai",
        "job_based": True,
        "requires_image": True
    },
    "virtual-staging": {
        "endpoint": "/virtual-staging-ai",
        "job_based": False,
        "requires_image": True
    },
    "prompt-generator": {
        "endpoint": "/prompt-generator",
        "job_based": False,
        "requires_image": True
    },
    "style-transfer": {
        "endpoint": "/style/transfer",
        "job_based": True,
        "requires_image": True
    },
    "render-enhancer": {
        "endpoint": "/render/enhancer",
        "job_based": True,
        "requires_image": True
    },
    "upscale-4k": {
        "endpoint": "/upscale",
        "job_based": False,
        "requires_image": True
    },
    "sketch-to-image": {
        "endpoint": "/sketch-to-img",
        "job_based": True,
        "requires_image": True
    }
}

@app.post("/mnml/run")
async def run_mnml_tool(
    tool: str = Form(...),
    image: UploadFile = File(None),
    mask: UploadFile = File(None),
    reference_image: UploadFile = File(None),
    payload: str = Form("{}")
):
    if tool not in MNML_TOOLS:
        raise HTTPException(400, f"Unsupported tool: {tool}")

    cfg = MNML_TOOLS[tool]

    if cfg["requires_image"] and not image:
        raise HTTPException(400, "Image is required for this tool")

    headers = {
        "Authorization": f"Bearer {MNML_API_KEY}",
        "Accept": "application/json"
    }

    files = {}

    if image:
        files["image"] = (image.filename, image.file, image.content_type)
    
    if mask:
        files["mask"] = (mask.filename, mask.file, mask.content_type)

    if reference_image:
        files["reference_image"] = (
            reference_image.filename,
            reference_image.file,
            reference_image.content_type
        )


    try:
        data = json.loads(payload)
    except:
        raise HTTPException(400, "Invalid JSON payload")

    # Merge default payload (used by interior/exterior)
    if "default_payload" in cfg:
        data = {**cfg["default_payload"], **data}

    url = MNML_BASE_URL + cfg["endpoint"]

    print(f"📤 MNML TOOL → {tool}")
    print("Endpoint:", url)
    print("Payload:", data)
    print("Files:", list(files.keys()))

    response = requests.post(
        url,
        headers=headers,
        files=files if files else None,
        data=data
    )

    if response.status_code != 200:
        raise HTTPException(response.status_code, response.text)

    result = response.json()

    # Job-based tools
    if cfg["job_based"]:
        job_id = result.get("id") or result.get("prediction_id")
        if not job_id:
            raise HTTPException(500, f"No job id returned: {result}")

        return sendSuccessResponse({
            "tool": tool,
            "job_id": job_id,
            "seed": result.get("seed"),
            "credits": result.get("credits"),
        })

    # Instant tools
    return sendSuccessResponse({
        "tool": tool,
        "result": result,
    })

@app.post("/generate-image")
async def generate_image(
    image: UploadFile = File(...),
    prompt: str = Form(...),

    # v4.1 fields
    expert_name: str = Form("exterior"),
    imagetype: str = Form("photo"),
    camera_angle: str = Form("same_as_input"),
    scene_mood: str = Form("auto_daylight"),
    render_style: str = Form("realistic"),
    render_scenario: str = Form("precise"),
    context: str = Form('["exterior"]'),
    seed: str = Form(None),
):
    if not MNML_API_KEY:
        raise HTTPException(500, "MNML_API_KEY missing")

    headers = {
        "Authorization": f"Bearer {MNML_API_KEY}",
        "Accept": "application/json",
    }

    files = {
        "image": (image.filename, image.file, image.content_type)
    }

    data = {
        "expert_name": expert_name,
        "prompt": prompt,
        "imagetype": imagetype,
        "camera_angle": camera_angle,
        "scene_mood": scene_mood,
        "render_style": render_style,
        "render_scenario": render_scenario,
        "context": context,
    }

    if seed:
        data["seed"] = seed

    print("📤 Submitting job → archDiffusion-v41")

    response = requests.post(
        "https://api.mnmlai.dev/v1/archDiffusion-v41",
        headers=headers,
        files=files,
        data=data,
    )

    if response.status_code != 200:
        raise HTTPException(response.status_code, response.text)

    result = response.json()

    if not result.get("id"):
        raise HTTPException(500, "MNML did not return job id")

    return sendSuccessResponse({
        "job_id": result["id"],
        "expert": expert_name,
        "seed": result.get("seed"),
        "credits": result.get("credits"),
    })

@app.post("/virtual-staging")
async def virtual_staging(
    image: UploadFile = File(...),
    prompt: str = Form(...),
    seed: str = Form(None)
):
    if not MNML_API_KEY:
        raise HTTPException(500, "MNML_API_KEY missing")

    headers = {"Authorization": f"Bearer {MNML_API_KEY}"}

    if not image or not prompt:
        raise HTTPException(400, "Image file and prompt are required")


    files = {
        "image": (image.filename, image.file, image.content_type)
    }

    data = {
        "prompt": prompt,
    }

    if seed:
        data["seed"] = seed

    print("📤 Submitting job to:", MNML_BASE_URL + "/virtual-staging-ai")

    response = requests.post(
        f"{MNML_BASE_URL}/virtual-staging-ai",
        headers=headers,
        files=files,
        data=data
    )

    try:
        result = response.json()
    except:
        raise HTTPException(500, "MNML returned invalid response")

    # Virtual staging returns the FINAL image directly in message
    if result.get("status") == "success" and isinstance(result.get("message"), str):
        return sendSuccessResponse({
            "image_url": result["message"],
            "message": "Virtual staging completed"
        })

    raise HTTPException(500, f"Unexpected response: {result}")


class ImagineAIRequest(BaseModel):
    prompt: str
    render_type: str
    aspect_ratio: str
    style_strength: int
    seed: int | None = None

@app.post("/imagine-ai")
async def imagine_ai(req: ImagineAIRequest):
    if not MNML_API_KEY:
        raise HTTPException(500, "MNML_API_KEY missing")
    
    if not req.prompt:
        raise HTTPException(400, "prompt is required")

    payload = {
        "prompt": req.prompt,
        "render_type": req.render_type,
        "aspect_ratio": req.aspect_ratio,
        "style_strength": req.style_strength,
    }

    if req.seed:
        payload["seed"] = req.seed

    print("Sending FORM DATA payload to MNML:", payload)

    response = requests.post(
        f"{MNML_BASE_URL}/imagine-ai",
        headers={"Authorization": f"Bearer {MNML_API_KEY}"},
        data=payload   # <-- important
    )

    print("MNML STATUS:", response.status_code)
    print("MNML RAW RESPONSE:", response.text)

    try:
        result = response.json()
    except Exception:
        raise HTTPException(
            500,
            f"MNML returned non-JSON response: {response.text}"
        )

    print("MNML PARSED RESPONSE:", result)

    job_id = result.get("prediction_id") or result.get("id")
    if not job_id:
        raise HTTPException(500, f"No job ID returned by MNML: {result}")

    return sendSuccessResponse({
        "job_id": job_id,
        "message": "Imagine AI job submitted",
    })

@app.get("/get-result/{job_id}")
async def get_result(job_id: str):
    headers = {"Authorization": f"Bearer {MNML_API_KEY}"}
    status_url = f"{MNML_BASE_URL}/status/{job_id}"

    response = requests.get(status_url, headers=headers)
    if response.status_code != 200:
        raise HTTPException(response.status_code, response.text)

    result = response.json()
    status = result.get("status")

    if status == "success":
        return sendSuccessResponse({
            "status": "success",              # ✅ REQUIRED
            "message": result.get("message"), # array or string
            "job_id": job_id
        })

    if status == "failed":
        return sendSuccessResponse({
            "status": "failed",
            "error": result
        })

    # still processing
    return sendSuccessResponse({
        "status": status or "processing",    # ✅ REQUIRED
        "job_id": job_id
    })


@app.post("/prompt-generator")
async def prompt_generator(
    image: UploadFile = File(...),
    prompt: str = Form(""),
    endpoint: str = Form("prompt-generator-ai")
):
    if not MNML_API_KEY:
        raise HTTPException(500, "MNML_API_KEY missing")

    headers = {"Authorization": f"Bearer {MNML_API_KEY}"}

    # Build multipart/form-data
    files = {
        "image": (image.filename, image.file, image.content_type)
    }

    data = {}
    if prompt.strip():
        data["prompt"] = prompt

    print(f"📤 Sending Prompt Generator Request → {endpoint}")

    try:
        response = requests.post(
            f"{MNML_BASE_URL}/{endpoint}",
            headers=headers,
            files=files,
            data=data
        )

        print("MNML RESPONSE CODE:", response.status_code)
        print("MNML RAW:", response.text[:200])

        if response.status_code != 200:
            raise HTTPException(response.status_code, response.text)

        result = response.json()

        # MNML usually returns: { "status": "success", "message": "...generated_prompt..." }
        generated_prompt = result.get("message")

        if not generated_prompt:
            raise HTTPException(500, f"Prompt not found in MNML response: {result}")

        return sendSuccessResponse({"generated_prompt": generated_prompt})

    except Exception as e:
        raise HTTPException(500, f"Error calling MNML Prompt Generator: {e}")

@app.post("/video-ai")
async def video_ai(
    image: UploadFile = File(...),
    prompt: str = Form(...),
    duration: str = Form("5"),
    cfg_scale: str = Form("0.5"),
    aspect_ratio: str = Form("16:9"),
    movement_type: str = Form("horizontal"),
    direction: str = Form("left"),
    negative_prompt: str = Form(None)
):
    if not MNML_API_KEY:
        raise HTTPException(500, "Missing MNML API Key")

    headers = {"Authorization": f"Bearer {MNML_API_KEY}"}

    files = {
        "image": (image.filename, image.file, image.content_type)
    }

    data = {
        "prompt": prompt,
        "duration": duration,
        "cfg_scale": cfg_scale,
        "aspect_ratio": aspect_ratio,
        "movement_type": movement_type,
        "direction": direction
    }

    if negative_prompt:
        data["negative_prompt"] = negative_prompt

    print("📤 Sending data to MNML Video AI:", data)

    response = requests.post(
        f"{MNML_BASE_URL}/video-ai",
        headers=headers,
        files=files,
        data=data
    )

    if response.status_code != 200:
        raise HTTPException(response.status_code, response.text)

    try:
        result = response.json()
    except:
        raise HTTPException(500, "Invalid JSON returned by MNML")

    if result.get("status") == "success" and isinstance(result.get("message"), str):
        return sendSuccessResponse({"instant": True,
            "video_url": result["message"]})
    
    job_id = result.get("id") or result.get("prediction_id")

    if not job_id:
        raise HTTPException(500, f"MNML returned neither video nor job id: {result}")

    return sendSuccessResponse({"job_id": job_id})

def sendSuccessResponse(data: dict):
    print("✅ Success Response:", data)
    return {
        "success": True,
        "data": data
    }
