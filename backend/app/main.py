from fastapi import FastAPI
from contextlib import asynccontextmanager
from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings
from app.database import db
from app.routes import auth_routes, ai, items
from fastapi.middleware.cors import CORSMiddleware


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup Logic
    try:
        db.client = AsyncIOMotorClient(settings.MONGO_URL)
        # Send a ping to confirm a successful connection
        await db.client.admin.command('ping')
        print("✅ Successfully connected to MongoDB Atlas!")
    except Exception as e:
        print(f"❌ Connection failed: {e}")
    
    yield
    
    # Shutdown Logic
    db.client.close()
    print("🔻 Disconnected from MongoDB")

app = FastAPI(title="CampusConnect API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], # Allow React
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register the router
app.include_router(auth_routes.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(ai.router) # <--- Added this line! (It creates the /analyze endpoint)
app.include_router(items.router, prefix="/items", tags=["Items"])

@app.get("/")
def read_root():
    return {"message": "Welcome to CampusConnect Backend 🚀"}