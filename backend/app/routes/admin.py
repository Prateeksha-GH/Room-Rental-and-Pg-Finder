"""Admin-only endpoints: manage users, listings, reports."""
from fastapi import APIRouter, Depends, HTTPException
from app.database.mongodb import get_db
from app.middleware.auth import require_roles
from app.utils.helpers import to_object_id, serialize_list

router = APIRouter(prefix="/api/admin", tags=["admin"])


@router.get("/stats")
async def stats(_=Depends(require_roles("admin"))):
    db = get_db()
    return {
        "users": await db.users.count_documents({}),
        "properties": await db.properties.count_documents({}),
        "bookings": await db.bookings.count_documents({}),
        "reviews": await db.reviews.count_documents({}),
        "tenants": await db.users.count_documents({"role": "tenant"}),
        "owners": await db.users.count_documents({"role": "owner"}),
    }


@router.get("/users")
async def list_users(_=Depends(require_roles("admin"))):
    db = get_db()
    cursor = db.users.find({}).sort("created_at", -1)
    users = serialize_list([d async for d in cursor])
    for u in users:
        u.pop("password", None)
    return users


@router.delete("/users/{user_id}")
async def delete_user(user_id: str, _=Depends(require_roles("admin"))):
    db = get_db()
    oid = to_object_id(user_id)
    if not oid:
        raise HTTPException(status_code=404, detail="Not found")
    await db.users.delete_one({"_id": oid})
    return {"message": "User deleted"}


@router.get("/properties")
async def list_all_properties(_=Depends(require_roles("admin"))):
    db = get_db()
    cursor = db.properties.find({}).sort("created_at", -1)
    return serialize_list([d async for d in cursor])


@router.delete("/properties/{prop_id}")
async def delete_property(prop_id: str, _=Depends(require_roles("admin"))):
    db = get_db()
    oid = to_object_id(prop_id)
    if not oid:
        raise HTTPException(status_code=404, detail="Not found")
    await db.properties.delete_one({"_id": oid})
    return {"message": "Property deleted"}
