from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from bson import ObjectId

# Helper to handle MongoDB's weird _id format
class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid objectid")
        return ObjectId(v)

    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(type="string")

# 1. The Schema for creating an Item (What the Frontend sends)
class ItemCreate(BaseModel):
    title: str
    description: str
    category: str  # "Lost" or "Found"
    location: str
    date_lost: str # Keep simple as string for now (YYYY-MM-DD)
    contact_email: Optional[str] = None # Optional, if they want to override default

# 2. The Schema for reading an Item (What the Backend sends back)
class ItemResponse(ItemCreate):
    id: str = Field(default_factory=str, alias="_id")
    owner_id: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    image_url: Optional[str] = None # We will handle image storage next

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}