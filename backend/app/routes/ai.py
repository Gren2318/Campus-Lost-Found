from fastapi import APIRouter, UploadFile, File, HTTPException
import httpx
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

COLAB_URL = os.getenv("COLAB_AI_URL")

@router.post("/analyze")
async def analyze_image(file: UploadFile = File(...)):
    if not COLAB_URL:
        raise HTTPException(status_code=500, detail="Server Error: COLAB_AI_URL is missing in .env")

    image_data = await file.read()

    async with httpx.AsyncClient() as client:
        try:
            print(f"📡 Sending to AI: {COLAB_URL}")
            response = await client.post(
                COLAB_URL, 
                files={"file": (file.filename, image_data, file.content_type)},
                timeout=45.0
            )
            
            if response.status_code != 200:
                print(f"❌ AI Error: {response.text}")
                raise HTTPException(status_code=502, detail="AI Processing Failed")

            return response.json()

        except httpx.RequestError as e:
            print(f"❌ Connection Error: {e}")
            raise HTTPException(status_code=503, detail="AI Service Offline")