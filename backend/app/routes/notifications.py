"""Notification endpoints (list, mark-read)."""
from fastapi import APIRouter, Depends, HTTPException
from app.database.mongodb import get_db
from app.middleware.auth import get_current_user
from app.utils.helpers import to_object_id, serialize_list

router = APIRouter(prefix="/api/notifications", tags=["notifications"])


@router.get("/")
async def list_notifications(user=Depends(get_current_user)):
    db = get_db()
    cursor = db.notifications.find({"user_id": to_object_id(user["id"])}).sort("created_at", -1)
    return serialize_list([d async for d in cursor])


@router.put("/{notif_id}/read")
async def mark_read(notif_id: str, user=Depends(get_current_user)):
    db = get_db()
    oid = to_object_id(notif_id)
    if not oid:
        raise HTTPException(status_code=404, detail="Not found")
    await db.notifications.update_one(
        {"_id": oid, "user_id": to_object_id(user["id"])},
        {"$set": {"read": True}},
    )
    return {"message": "Marked as read"}


@router.put("/read-all")
async def mark_all_read(user=Depends(get_current_user)):
    db = get_db()
    await db.notifications.update_many(
        {"user_id": to_object_id(user["id"])},
        {"$set": {"read": True}},
    )
    return {"message": "All marked as read"}
