from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles 
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings
from app.database import db
import os

# Import Routes
from app.routes import auth_routes, ai, items 

@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        db.client = AsyncIOMotorClient(settings.MONGO_URL)
        await db.client.admin.command('ping')
        print("✅ MongoDB Connected")
    except Exception as e:
        print(f"❌ MongoDB Error: {e}")
    yield
    db.client.close()

app = FastAPI(lifespan=lifespan)

# 👇 THE FIX: Calculate the exact path to 'backend/static'
# 1. Get the path of this specific file (main.py)
current_file_path = os.path.abspath(__file__)
# 2. Get the folder it is in (backend/app)
app_folder = os.path.dirname(current_file_path)
# 3. Go up one level to the root (backend)
backend_root = os.path.dirname(app_folder)
# 4. Point to the static folder
static_folder = os.path.join(backend_root, "static")

# Print it so we can see it in the terminal (Debug)
print(f"📂 Mounting Static Files from: {static_folder}")

# 5. Mount it (only if it exists, to be safe)
os.makedirs(static_folder, exist_ok=True)
app.mount("/static", StaticFiles(directory=static_folder), name="static")

# CORS Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Routers
app.include_router(auth_routes.router, prefix="/api/auth", tags=["Auth"])
app.include_router(ai.router)
app.include_router(items.router, prefix="/items", tags=["Items"])

@app.get("/")
def read_root():
    return {"message": "CampusConnect Backend Running"}