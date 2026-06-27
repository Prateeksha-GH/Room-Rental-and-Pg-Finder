"""Booking / visit-scheduling endpoints."""
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException
from app.schemas.booking import BookingCreate, BookingUpdate, BookingOut
from app.database.mongodb import get_db
from app.middleware.auth import get_current_user, require_roles
from app.utils.helpers import to_object_id, serialize_doc, serialize_list
from app.services.notification_service import push_notification

router = APIRouter(prefix="/api/bookings", tags=["bookings"])


async def _hydrate(doc: dict) -> dict:
    """Attach property + tenant snippets onto a booking document."""
    db = get_db()
    out = serialize_doc(doc)
    prop = await db.properties.find_one({"_id": doc.get("property_id")})
    tenant = await db.users.find_one({"_id": doc.get("tenant_id")})
    if prop:
        out["property"] = serialize_doc(prop)
    if tenant:
        t = serialize_doc(tenant)
        t.pop("password", None)
        out["tenant"] = t
    return out


@router.post("/", response_model=BookingOut, status_code=201)
async def create_booking(payload: BookingCreate, user=Depends(get_current_user)):
    db = get_db()
    prop_oid = to_object_id(payload.property_id)
    if not prop_oid:
        raise HTTPException(status_code=404, detail="Property not found")
    prop = await db.properties.find_one({"_id": prop_oid})
    if not prop:
        raise HTTPException(status_code=404, detail="Property not found")

    doc = {
        "property_id": prop_oid,
        "tenant_id": to_object_id(user["id"]),
        "owner_id": prop["owner_id"],
        "visit_date": payload.visit_date,
        "message": payload.message,
        "status": "pending",
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    result = await db.bookings.insert_one(doc)
    booking = await db.bookings.find_one({"_id": result.inserted_id})
    await push_notification(
        str(prop["owner_id"]),
        "New Booking Request",
        f"{user['name']} requested a visit on {payload.visit_date}",
        "booking",
    )
    return await _hydrate(booking)


@router.get("/my")
async def my_bookings(user=Depends(get_current_user)):
    db = get_db()
    cursor = db.bookings.find({"tenant_id": to_object_id(user["id"])}).sort("created_at", -1)
    return [await _hydrate(b) async for b in cursor]


@router.get("/owner")
async def owner_bookings(user=Depends(require_roles("owner", "admin"))):
    db = get_db()
    cursor = db.bookings.find({"owner_id": to_object_id(user["id"])}).sort("created_at", -1)
    return [await _hydrate(b) async for b in cursor]


@router.put("/{booking_id}", response_model=BookingOut)
async def update_booking(booking_id: str, payload: BookingUpdate, user=Depends(get_current_user)):
    db = get_db()
    oid = to_object_id(booking_id)
    if not oid:
        raise HTTPException(status_code=404, detail="Not found")
    booking = await db.bookings.find_one({"_id": oid})
    if not booking:
        raise HTTPException(status_code=404, detail="Not found")

    # Owners/admins approve/reject. Tenants can only cancel their own bookings.
    is_owner = str(booking.get("owner_id")) == user["id"]
    is_tenant = str(booking.get("tenant_id")) == user["id"]
    if user["role"] == "admin" or is_owner:
        new_status = payload.status
    elif is_tenant and payload.status == "cancelled":
        new_status = "cancelled"
    else:
        raise HTTPException(status_code=403, detail="Forbidden")

    await db.bookings.update_one({"_id": oid}, {"$set": {"status": new_status}})
    updated = await db.bookings.find_one({"_id": oid})
    await push_notification(
        str(booking["tenant_id"]),
        "Booking Updated",
        f"Your booking is now {new_status}",
        "booking",
    )
    return await _hydrate(updated)


@router.delete("/{booking_id}")
async def delete_booking(booking_id: str, user=Depends(get_current_user)):
    db = get_db()
    oid = to_object_id(booking_id)
    booking = await db.bookings.find_one({"_id": oid}) if oid else None
    if not booking:
        raise HTTPException(status_code=404, detail="Not found")
    if user["role"] != "admin" and str(booking.get("tenant_id")) != user["id"]:
        raise HTTPException(status_code=403, detail="Forbidden")
    await db.bookings.delete_one({"_id": oid})
    return {"message": "Deleted"}
