from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class MessageCreate(BaseModel):
    receiver_id: str
    content: str

class MessageResponse(BaseModel):
    id: str
    sender_id: str
    receiver_id: str
    content: str
    timestamp: datetime