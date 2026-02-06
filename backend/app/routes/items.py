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

    image_url = None
    if file:
        
        file.filename = f"{uuid.uuid4()}.jpg"
        contents = await file.read()
        
        os.makedirs(IMAGEDIR, exist_ok=True)
        
        with open(f"{IMAGEDIR}{file.filename}", "wb") as f:
            f.write(contents)
        
        image_url = f"/static/images/{file.filename}"

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

    result = await db.client.campus_connect_db.items.insert_one(new_item)

    new_item["_id"] = str(result.inserted_id)

    return new_item


@router.get("/", response_model=list[ItemResponse])
async def get_items():
    items = await db.client.campus_connect_db.items.find().to_list(100)
    
    for item in items:
        item["_id"] = str(item["_id"])
        
    return items


@router.get("/user/me", response_model=list[ItemResponse])
async def get_my_items(current_user: dict = Depends(get_current_user)):
    items = await db.client.campus_connect_db.items.find(
        {"owner_id": current_user["email"]}
    ).to_list(100)
    
    for item in items:
        item["_id"] = str(item["_id"])
        
    return items


@router.get("/{item_id}", response_model=ItemResponse)
async def get_item(item_id: str):

    if not ObjectId.is_valid(item_id):
        raise HTTPException(status_code=400, detail="Invalid Item ID")

    item = await db.client.campus_connect_db.items.find_one({"_id": ObjectId(item_id)})
    
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    item["_id"] = str(item["_id"])
    return item



@router.delete("/{item_id}")
async def delete_item(item_id: str, current_user: dict = Depends(get_current_user)):

    if not ObjectId.is_valid(item_id):
        raise HTTPException(status_code=400, detail="Invalid Item ID")

    item = await db.client.campus_connect_db.items.find_one({"_id": ObjectId(item_id)})
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
        

    is_owner = item["owner_id"] == current_user["email"]
    is_admin = current_user.get("role") == "admin" 

    if not is_owner and not is_admin:
        raise HTTPException(status_code=403, detail="Not authorized to delete this item")
    try:
        if "image_url" in item and item["image_url"]:

            relative_path = item["image_url"].lstrip("/")
            file_path = os.path.join(os.getcwd(), relative_path)
            
            if os.path.exists(file_path):
                os.remove(file_path)
                print(f"✅ Deleted local file: {file_path}")
            else:
                print(f"⚠️ File not found on disk: {file_path}")
    except Exception as e:
        print(f"❌ Error deleting file: {e}")


    await db.client.campus_connect_db.items.delete_one({"_id": ObjectId(item_id)})
    
    return {"message": "Item and image deleted successfully"}