from fastapi import APIRouter, HTTPException, UploadFile, File, Form, Depends
from app.database import db
from app.models.item_model import ItemResponse
from app.routes.auth_routes import get_current_user
from datetime import datetime
import os
import uuid
from bson import ObjectId

router = APIRouter()

IMAGEDIR = "static/images/"

@router.post("/", response_model=ItemResponse)
async def create_item(
    title: str = Form(...),
    description: str = Form(...),
    category: str = Form(...),
    location: str = Form(...),
    date_lost: str = Form(...),
    owner_id: str = Form(...),
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
        "owner_id": owner_id
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

# 👇 This is the new endpoint causing the error (Fixed now)
@router.get("/user/me", response_model=list[ItemResponse])
async def get_my_items(current_user: dict = Depends(get_current_user)):
    # 1. We know the user's email from the token (current_user["email"])
    # 2. Find items where 'owner_id' matches their email
    items = await db.client.campus_connect_db.items.find(
        {"owner_id": current_user["email"]}
    ).to_list(100)
    
    # 3. Convert ObjectIds
    for item in items:
        item["_id"] = str(item["_id"])
        
    return items

@router.get("/{item_id}", response_model=ItemResponse)
async def get_item(item_id: str):
    # 1. Validate ID format
    if not ObjectId.is_valid(item_id):
        raise HTTPException(status_code=400, detail="Invalid Item ID")
    
    # 2. Find in DB
    item = await db.client.campus_connect_db.items.find_one({"_id": ObjectId(item_id)})
    
    # 3. Handle Not Found
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
        
    # 4. Convert ID and Return
    item["_id"] = str(item["_id"])
    return item

@router.delete("/{item_id}")
async def delete_item(item_id: str, current_user: dict = Depends(get_current_user)):
    # 1. Validate ID
    if not ObjectId.is_valid(item_id):
        raise HTTPException(status_code=400, detail="Invalid Item ID")
    
    # 2. Find the item
    item = await db.client.campus_connect_db.items.find_one({"_id": ObjectId(item_id)})
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
        
    # 3. SECURITY CHECK: Does the logged-in user own this item?
    # We compare the item's 'owner_id' (email) with the token's email
    if item["owner_id"] != current_user["email"]:
        raise HTTPException(status_code=403, detail="Not authorized to delete this item")
    
    # 4. Delete it
    await db.client.campus_connect_db.items.delete_one({"_id": ObjectId(item_id)})
    
    return {"message": "Item deleted successfully"}