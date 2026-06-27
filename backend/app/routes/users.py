"""User profile endpoints (read/update self, change password)."""
from fastapi import APIRouter, Depends, HTTPException
from app.schemas.user import UserUpdate, UserOut, ChangePassword
from app.database.mongodb import get_db
from app.middleware.auth import get_current_user
from app.utils.helpers import to_object_id, serialize_doc
from app.utils.security import hash_password, verify_password

router = APIRouter(prefix="/api/users", tags=["users"])


@router.get("/profile", response_model=UserOut)
async def get_profile(user=Depends(get_current_user)):
    user.pop("password", None)
    return user


@router.put("/profile", response_model=UserOut)
async def update_profile(payload: UserUpdate, user=Depends(get_current_user)):
    db = get_db()
    oid = to_object_id(user["id"])
    update = {k: v for k, v in payload.model_dump().items() if v is not None}
    if update:
        await db.users.update_one({"_id": oid}, {"$set": update})
    updated = await db.users.find_one({"_id": oid})
    updated = serialize_doc(updated)
    updated.pop("password", None)
    return updated


@router.put("/password")
async def change_password(payload: ChangePassword, user=Depends(get_current_user)):
    db = get_db()
    oid = to_object_id(user["id"])
    full = await db.users.find_one({"_id": oid})
    if not verify_password(payload.old_password, full.get("password", "")):
        raise HTTPException(status_code=400, detail="Old password is incorrect")
    await db.users.update_one({"_id": oid}, {"$set": {"password": hash_password(payload.new_password)}})
    return {"message": "Password updated"}
