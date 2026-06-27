"""Reusable helper to push notifications to a user."""
from datetime import datetime, timezone
from app.database.mongodb import get_db
from app.utils.helpers import to_object_id


async def push_notification(user_id: str, title: str, message: str, n_type: str = "info") -> None:
    db = get_db()
    oid = to_object_id(user_id)
    if not oid:
        return
    await db.notifications.insert_one({
        "user_id": oid,
        "title": title,
        "message": message,
        "type": n_type,
        "read": False,
        "created_at": datetime.now(timezone.utc).isoformat(),
    })
