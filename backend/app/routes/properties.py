"""Property CRUD + search/filter endpoints."""
import re
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, Query
from app.schemas.property import PropertyCreate, PropertyUpdate, PropertyOut
from app.database.mongodb import get_db
from app.middleware.auth import get_current_user, require_roles
from app.utils.helpers import to_object_id, serialize_doc, serialize_list

router = APIRouter(prefix="/api/properties", tags=["properties"])


@router.get("/")
async def list_properties(
    q: str | None = None,
    city: str | None = None,
    min_price: float | None = None,
    max_price: float | None = None,
    gender: str | None = None,
    room_type: str | None = None,
    food_included: bool | None = None,
    ac: bool | None = None,
    wifi: bool | None = None,
    furnished: bool | None = None,
    category: str | None = None,
    page: int = Query(1, ge=1),
    limit: int = Query(12, ge=1, le=60),
):
    db = get_db()
    filter_q: dict = {}
    if q and q.strip():
        pattern = re.escape(q.strip())
        filter_q["$or"] = [
            {"title": {"$regex": pattern, "$options": "i"}},
            {"location": {"$regex": pattern, "$options": "i"}},
            {"city": {"$regex": pattern, "$options": "i"}},
        ]
    if city and city.strip():
        filter_q["city"] = {"$regex": re.escape(city.strip()), "$options": "i"}
    if gender:
        filter_q["gender"] = gender
    if room_type:
        filter_q["room_type"] = room_type
    if category:
        filter_q["category"] = category
    if food_included is not None:
        filter_q["food_included"] = food_included
    if ac is not None:
        filter_q["ac"] = ac
    if wifi is not None:
        filter_q["wifi"] = wifi
    if furnished is not None:
        filter_q["furnished"] = furnished
    price_q: dict = {}
    if min_price is not None:
        price_q["$gte"] = min_price
    if max_price is not None:
        price_q["$lte"] = max_price
    if price_q:
        filter_q["price"] = price_q

    total = await db.properties.count_documents(filter_q)
    cursor = db.properties.find(filter_q).sort("created_at", -1).skip((page - 1) * limit).limit(limit)
    items = [serialize_doc(d) async for d in cursor]
    return {
        "items": items,
        "total": total,
        "page": page,
        "limit": limit,
        "pages": (total + limit - 1) // limit,
    }


@router.get("/featured")
async def featured():
    db = get_db()
    cursor = db.properties.find({"available": True}).sort("rating", -1).limit(6)
    return serialize_list([d async for d in cursor])


@router.get("/{prop_id}", response_model=PropertyOut)
async def get_property(prop_id: str):
    db = get_db()
    oid = to_object_id(prop_id)
    if not oid:
        raise HTTPException(status_code=404, detail="Not found")
    prop = await db.properties.find_one({"_id": oid})
    if not prop:
        raise HTTPException(status_code=404, detail="Not found")
    return serialize_doc(prop)


@router.post("/", response_model=PropertyOut, status_code=201)
async def create_property(payload: PropertyCreate, user=Depends(require_roles("owner", "admin"))):
    db = get_db()
    doc = payload.model_dump()
    doc.update({
        "owner_id": to_object_id(user["id"]),
        "rating": 0.0,
        "review_count": 0,
        "created_at": datetime.now(timezone.utc).isoformat(),
    })
    result = await db.properties.insert_one(doc)
    created = await db.properties.find_one({"_id": result.inserted_id})
    return serialize_doc(created)


@router.put("/{prop_id}", response_model=PropertyOut)
async def update_property(prop_id: str, payload: PropertyUpdate, user=Depends(require_roles("owner", "admin"))):
    db = get_db()
    oid = to_object_id(prop_id)
    if not oid:
        raise HTTPException(status_code=404, detail="Not found")
    prop = await db.properties.find_one({"_id": oid})
    if not prop:
        raise HTTPException(status_code=404, detail="Not found")
    # Owners can only edit their own properties.
    if user["role"] != "admin" and str(prop.get("owner_id")) != user["id"]:
        raise HTTPException(status_code=403, detail="Forbidden")
    update = {k: v for k, v in payload.model_dump().items() if v is not None}
    if update:
        await db.properties.update_one({"_id": oid}, {"$set": update})
    updated = await db.properties.find_one({"_id": oid})
    return serialize_doc(updated)


@router.delete("/{prop_id}")
async def delete_property(prop_id: str, user=Depends(require_roles("owner", "admin"))):
    db = get_db()
    oid = to_object_id(prop_id)
    if not oid:
        raise HTTPException(status_code=404, detail="Not found")
    prop = await db.properties.find_one({"_id": oid})
    if not prop:
        raise HTTPException(status_code=404, detail="Not found")
    if user["role"] != "admin" and str(prop.get("owner_id")) != user["id"]:
        raise HTTPException(status_code=403, detail="Forbidden")
    await db.properties.delete_one({"_id": oid})
    return {"message": "Deleted"}


@router.get("/owner/mine")
async def my_properties(user=Depends(require_roles("owner", "admin"))):
    db = get_db()
    cursor = db.properties.find({"owner_id": to_object_id(user["id"])}).sort("created_at", -1)
    return serialize_list([d async for d in cursor])
