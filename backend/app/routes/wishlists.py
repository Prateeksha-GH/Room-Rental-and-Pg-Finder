"""Wishlist / saved-property endpoints."""
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException
from app.database.mongodb import get_db
from app.middleware.auth import get_current_user
from app.utils.helpers import to_object_id, serialize_doc, serialize_list

router = APIRouter(prefix="/api/wishlists", tags=["wishlists"])


@router.get("/")
async def my_wishlist(user=Depends(get_current_user)):
    db = get_db()
    user_oid = to_object_id(user["id"])
    cursor = db.wishlists.find({"user_id": user_oid})
    items = [d async for d in cursor]
    prop_ids = [d["property_id"] for d in items]
    if not prop_ids:
        return []
    props_cursor = db.properties.find({"_id": {"$in": prop_ids}})
    return serialize_list([p async for p in props_cursor])


@router.post("/{prop_id}")
async def add_wishlist(prop_id: str, user=Depends(get_current_user)):
    db = get_db()
    prop_oid = to_object_id(prop_id)
    user_oid = to_object_id(user["id"])
    if not prop_oid:
        raise HTTPException(status_code=404, detail="Not found")
    try:
        await db.wishlists.update_one(
            {"user_id": user_oid, "property_id": prop_oid},
            {"$setOnInsert": {
                "user_id": user_oid,
                "property_id": prop_oid,
                "created_at": datetime.now(timezone.utc).isoformat(),
            }},
            upsert=True,
        )
    except Exception:
        pass
    return {"message": "Added"}


@router.delete("/{prop_id}")
async def remove_wishlist(prop_id: str, user=Depends(get_current_user)):
    db = get_db()
    prop_oid = to_object_id(prop_id)
    user_oid = to_object_id(user["id"])
    await db.wishlists.delete_one({"user_id": user_oid, "property_id": prop_oid})
    return {"message": "Removed"}
