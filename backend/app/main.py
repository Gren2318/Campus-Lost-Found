from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles 
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings
from app.database import db
import os

# Import Routes
from app.routes import auth_routes, items, ai, messages

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


current_file_path = os.path.abspath(__file__)
app_folder = os.path.dirname(current_file_path)
backend_root = os.path.dirname(app_folder)
static_folder = os.path.join(backend_root, "static")

print(f"📂 Mounting Static Files from: {static_folder}")

os.makedirs(static_folder, exist_ok=True)
app.mount("/static", StaticFiles(directory=static_folder), name="static")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",                                          # local dev
        "https://campus-lost-found-nine.vercel.app",                     # production domain
        "https://campus-lost-found-2po44uj4t-gren2318s-projects.vercel.app",  # current preview
    ],
    allow_origin_regex=r"https://.*\.vercel\.app",  # all future Vercel preview URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_routes.router, prefix="/api/auth", tags=["Auth"])
app.include_router(ai.router)
app.include_router(items.router, prefix="/items", tags=["Items"])
app.include_router(messages.router, prefix="/messages", tags=["Messages"])

@app.get("/")
def read_root():
    return {"message": "CampusConnect Backend Running"}