from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from app.database import db
from app.models.item_model import ItemResponse
from datetime import datetime
import os
import uuid

router = APIRouter()

IMAGEDIR = "static/images/"

@router.post("/", response_model=ItemResponse)
async def create_item(
    title: str = Form(...),
    description: str = Form(...),
    category: str = Form(...),
    location: str = Form(...),
    date_lost: str = Form(...),
    file: UploadFile = File(None) 
):
    # 1. Handle Image
    image_url = None
    if file:
        file.filename = f"{uuid.uuid4()}.jpg"
        contents = await file.read()
        
        # Ensure directory exists
        os.makedirs(IMAGEDIR, exist_ok=True)
        
        with open(f"{IMAGEDIR}{file.filename}", "wb") as f:
            f.write(contents)
        
        image_url = f"/static/images/{file.filename}"

    # 2. Prepare Data
    new_item = {
        "title": title,
        "description": description,
        "category": category,
        "location": location,
        "date_lost": date_lost,
        "image_url": image_url,
        "created_at": datetime.utcnow(),
        "owner_id": "user_123"
    }

    # 3. Save to 'campus_connect_db'
    # Note: Ensure this matches your MongoDB Database name exactly!
    result = await db.client.campus_connect_db.items.insert_one(new_item)

    # ✅ FIXED: Manually attach the ID and return immediately
    # (We skip the 'find_one' step to avoid database lag errors)
    new_item["_id"] = str(result.inserted_id)

    return new_item

@router.get("/", response_model=list[ItemResponse])
async def get_items():
    items = await db.client.campus_connect_db.items.find().to_list(100)
    
    # Convert ObjectIds to strings
    for item in items:
        item["_id"] = str(item["_id"])
        
    return items