from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import OAuth2PasswordBearer
from app.database import db
from app.models.user_model import UserCreate, UserLogin, UserResponse
from app.core.security import get_password_hash, verify_password, create_access_token
from datetime import datetime
from app.core.config import settings
from jose import jwt, JWTError # You likely installed python-jose

router = APIRouter()

# 👇 1. Setup Security Scheme (This tells FastAPI where to look for the token)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

# 👇 2. Helper: Decode Token & Find User (The Missing Piece)
async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        # Decode the token
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
        
    # Find user in DB
    user = await db.client[settings.DB_NAME]["users"].find_one({"_id": ObjectId(user_id)})
    if user is None:
        raise credentials_exception
        
    return user

# ... (Register stays the same) ...
@router.post("/register", response_model=UserResponse)
async def register(user: UserCreate):
    # 1. Check if user already exists
    existing_user = await db.client[settings.DB_NAME]["users"].find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # 2. Hash the password
    hashed_password = get_password_hash(user.password)

    # 3. Save to MongoDB
    new_user = {
        "username": user.username,
        "email": user.email,
        "password": hashed_password,
        "role": "user",
        "created_at": datetime.utcnow()
    }
    result = await db.client[settings.DB_NAME]["users"].insert_one(new_user)

    return {
        "id": str(result.inserted_id),
        "username": user.username,
        "email": user.email
    }

# ... (Login stays the same) ...
@router.post("/login")
async def login(user: UserLogin):
    # 1. Find user by email
    db_user = await db.client[settings.DB_NAME]["users"].find_one({"email": user.email})
    if not db_user:
        raise HTTPException(status_code=400, detail="Invalid email or password")

    # 2. Verify password
    if not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=400, detail="Invalid email or password")

    # 3. Create Token
    access_token = create_access_token(data={"sub": str(db_user["_id"])})
    
    return {"access_token": access_token, "token_type": "bearer"}

# 👇 3. The NEW Route (Fixes the 404 Error)
from bson import ObjectId

@router.get("/me", response_model=UserResponse)
async def read_users_me(current_user: dict = Depends(get_current_user)):
    # Convert MongoDB _id to string for the response
    return {
        "id": str(current_user["_id"]),
        "username": current_user["username"],
        "email": current_user["email"]
    }