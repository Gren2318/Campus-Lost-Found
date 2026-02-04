from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from bson import ObjectId

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

class ItemCreate(BaseModel):
    title: str
    description: str
    category: str  
    location: str
    date_lost: str 
    contact_email: Optional[str] = None 

class ItemResponse(ItemCreate):
    id: str = Field(default_factory=str, alias="_id")
    owner_id: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    image_url: Optional[str] = None 

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}