"""Property review endpoints."""
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException
from app.schemas.review import ReviewCreate, ReviewOut
from app.database.mongodb import get_db
from app.middleware.auth import get_current_user
from app.utils.helpers import to_object_id, serialize_doc, serialize_list

router = APIRouter(prefix="/api/reviews", tags=["reviews"])


async def _recompute_rating(prop_id) -> None:
    """Recompute aggregate rating + review_count for a property."""
    db = get_db()
    cursor = db.reviews.find({"property_id": prop_id})
    ratings = [r["rating"] async for r in cursor]
    avg = sum(ratings) / len(ratings) if ratings else 0.0
    await db.properties.update_one(
        {"_id": prop_id},
        {"$set": {"rating": round(avg, 1), "review_count": len(ratings)}},
    )


@router.post("/", response_model=ReviewOut, status_code=201)
async def create_review(payload: ReviewCreate, user=Depends(get_current_user)):
    db = get_db()
    prop_oid = to_object_id(payload.property_id)
    if not prop_oid:
        raise HTTPException(status_code=404, detail="Property not found")
    doc = {
        "property_id": prop_oid,
        "user_id": to_object_id(user["id"]),
        "user_name": user.get("name"),
        "user_avatar": user.get("avatar"),
        "rating": payload.rating,
        "comment": payload.comment,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    result = await db.reviews.insert_one(doc)
    await _recompute_rating(prop_oid)
    created = await db.reviews.find_one({"_id": result.inserted_id})
    return serialize_doc(created)


@router.get("/property/{prop_id}")
async def list_reviews(prop_id: str):
    db = get_db()
    oid = to_object_id(prop_id)
    if not oid:
        raise HTTPException(status_code=404, detail="Not found")
    cursor = db.reviews.find({"property_id": oid}).sort("created_at", -1)
    return serialize_list([d async for d in cursor])
