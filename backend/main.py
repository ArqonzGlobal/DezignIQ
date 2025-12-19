from fastapi import FastAPI, File, Form, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, EmailStr
import requests, os, time
from bson import ObjectId
from datetime import datetime
from dotenv import load_dotenv
from pydantic import BaseModel
from typing import Optional
import base64
import pytz
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

MONGO_URI = os.getenv("MONGO_URI")
client = AsyncIOMotorClient(MONGO_URI)
db = client["DesignIQ"]
image_collection = db["ImageHistory"]

class ImageHistoryRequest(BaseModel):
    userEmail: str
    toolName: str
    imageUrl: str
    imageType: str 
    prompt: Optional[str] = None



@app.post("/image-history/save")
async def save_image_history(payload: ImageHistoryRequest):
    # 1️⃣ Validate required fields
    if not payload.userEmail or not payload.toolName or not payload.imageUrl:
        raise HTTPException(400, "Missing required fields")

    # 2️⃣ Handle image
    if payload.imageType == "base64":
        image_base64 = payload.imageUrl.strip()
        
        if image_base64.startswith("data:image"):
            image_base64 = image_base64.split(",", 1)[1]

        if not image_base64:
            raise HTTPException(400, "Base64 image is empty")

    elif payload.imageType == "url":
        # 🔹 Download image
        try:
            response = requests.get(payload.imageUrl, timeout=15)
            response.raise_for_status()
            image_bytes = response.content
        except Exception as e:
            raise HTTPException(400, f"Failed to download image: {str(e)}")

        if not image_bytes:
            raise HTTPException(400, "Downloaded image is empty")

        image_base64 = base64.b64encode(image_bytes).decode("utf-8")

    else:
        raise HTTPException(400, "Invalid imageType. Use 'url' or 'base64'")

    # 3️⃣ IST timestamp (stored as UTC+05:30 offset correctly)
    ist = pytz.timezone("Asia/Kolkata")
    ist_now = datetime.now(ist)

    document = {
        "userEmail": payload.userEmail,
        "toolName": payload.toolName,
        "prompt": payload.prompt,
        "image": image_base64,
        "createdAt": ist_now
    }

    # 4️⃣ Insert into MongoDB
    result = await image_collection.insert_one(document)

    if not result.inserted_id:
        raise HTTPException(500, "Mongo insert failed")

    return {
        "success": True,
        "id": str(result.inserted_id)
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
class ImageHistoryGetRequest(BaseModel):
    userEmail: str

@app.post("/image-history/get")
async def get_image_history(payload: ImageHistoryGetRequest):
    if not payload.userEmail:
        raise HTTPException(400, "userEmail is required")

    cursor = image_collection.find(
        {"userEmail": payload.userEmail}
    ).sort("createdAt", -1)

    results = []

    ist = pytz.timezone("Asia/Kolkata")

    async for doc in cursor:
        created_at = doc.get("createdAt")

        # Convert UTC → IST if needed
        if created_at and created_at.tzinfo is None:
            created_at = pytz.utc.localize(created_at)

        if created_at:
            created_at = created_at.astimezone(ist)

        results.append({
            "id": str(doc["_id"]),
            "toolName": doc.get("toolName"),
            "prompt": doc.get("prompt"),
            "image": f"data:image/png;base64,{doc.get('image')}",
            "createdAt": created_at.isoformat() if created_at else None
        })

    return {
        "success": True,
        "data": results
    }

class ImageHistoryDeleteRequest(BaseModel):
    id: str

@app.post("/image-history/delete")
async def delete_image_history(payload: ImageHistoryDeleteRequest):
    if not payload.id:
        raise HTTPException(400, "Image history id is required")

    # Validate ObjectId
    try:
        object_id = ObjectId(payload.id)
    except Exception:
        raise HTTPException(400, "Invalid image history id")

    result = await image_collection.delete_one({"_id": object_id})

    if result.deleted_count == 0:
        raise HTTPException(404, "Image history not found")

    return {
        "success": True,
        "message": "Image history deleted successfully",
        "id": payload.id
    }

def sendSuccessResponse(data: dict):
    print("✅ Success Response:", data)
    return {
        "success": True,
        "data": data
    }
