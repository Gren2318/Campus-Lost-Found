import asyncio
from motor.motor_asyncio import AsyncIOMotorClient  # 👈 Import Motor Client
from app.database import db
from app.core.security import get_password_hash
from app.core.config import settings
from datetime import datetime

async def create_admin():
    print("Connecting to MongoDB...")

    db.client = AsyncIOMotorClient(settings.MONGO_URL)
    
    print("Creating Admin User...")
    
    existing_admin = await db.client[settings.DB_NAME]["users"].find_one({"email": "admin@campusconnect.com"})
    if existing_admin:
        print("Admin already exists!")
        return

    admin_user = {
        "username": "admin",
        "email": "admin@campusconnect.com", 
        "password": get_password_hash("admin"), 
        "role": "admin", 
        "created_at": datetime.utcnow()
    }

    await db.client[settings.DB_NAME]["users"].insert_one(admin_user)
    print("Admin user created successfully!")
    print("Login Email: admin@campusconnect.com")
    print("Login Password: admin")

if __name__ == "__main__":
    asyncio.run(create_admin())