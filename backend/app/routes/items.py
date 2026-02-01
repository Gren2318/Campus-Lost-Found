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
    owner_id: str = Form(...),  # 👈 CHANGED: Accept Owner ID from Frontend
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
        "owner_id": owner_id  # 👈 CHANGED: Use the real ID
    }

    # 3. Save to 'campus_connect_db'
    result = await db.client.campus_connect_db.items.insert_one(new_item)

    # Manually attach the ID and return immediately
    new_item["_id"] = str(result.inserted_id)

    return new_item

@router.get("/", response_model=list[ItemResponse])
async def get_items():
    items = await db.client.campus_connect_db.items.find().to_list(100)
    
    # Convert ObjectIds to strings
    for item in items:
        item["_id"] = str(item["_id"])
        
    return items