"""Authentication endpoints: register, login, current user."""
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.user import UserRegister, UserLogin, UserOut, TokenOut
from app.database.mongodb import get_db
from app.utils.security import hash_password, verify_password, create_access_token
from app.utils.helpers import serialize_doc
from app.middleware.auth import get_current_user

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/register", response_model=TokenOut, status_code=status.HTTP_201_CREATED)
async def register(payload: UserRegister):
    db = get_db()
    existing = await db.users.find_one({"email": payload.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    doc = {
        "name": payload.name,
        "email": payload.email,
        "password": hash_password(payload.password),
        "role": payload.role,
        "phone": payload.phone,
        "bio": None,
        "avatar": None,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    result = await db.users.insert_one(doc)
    user = await db.users.find_one({"_id": result.inserted_id})
    user_s = serialize_doc(user)
    user_s.pop("password", None)
    token = create_access_token({"sub": user_s["id"], "role": user_s["role"]})
    return {"access_token": token, "token_type": "bearer", "user": user_s}


@router.post("/login", response_model=TokenOut)
async def login(payload: UserLogin):
    db = get_db()
    user = await db.users.find_one({"email": payload.email})
    if not user or not verify_password(payload.password, user.get("password", "")):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    user_s = serialize_doc(user)
    user_s.pop("password", None)
    token = create_access_token({"sub": user_s["id"], "role": user_s["role"]})
    return {"access_token": token, "token_type": "bearer", "user": user_s}


@router.get("/me", response_model=UserOut)
async def me(current=Depends(get_current_user)):
    current.pop("password", None)
    return current
