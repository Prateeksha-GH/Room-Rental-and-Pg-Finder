"""Async MongoDB client + collection accessors."""
import certifi
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from app.config.settings import settings


class MongoDB:
    client: AsyncIOMotorClient | None = None
    db: AsyncIOMotorDatabase | None = None


mongo = MongoDB()


async def connect_to_mongo() -> None:
    # tlsCAFile=certifi.where() avoids "CERTIFICATE_VERIFY_FAILED" on Windows when hitting Atlas.
    mongo.client = AsyncIOMotorClient(settings.MONGO_URI, tlsCAFile=certifi.where())
    mongo.db = mongo.client[settings.DB_NAME]
    # Useful indexes
    await mongo.db.users.create_index("email", unique=True)
    await mongo.db.properties.create_index([("title", "text"), ("location", "text")])
    await mongo.db.properties.create_index("owner_id")
    await mongo.db.bookings.create_index("tenant_id")
    await mongo.db.bookings.create_index("property_id")
    await mongo.db.wishlists.create_index([("user_id", 1), ("property_id", 1)], unique=True)
    await mongo.db.reviews.create_index("property_id")
    await mongo.db.notifications.create_index("user_id")


async def close_mongo_connection() -> None:
    if mongo.client:
        mongo.client.close()


def get_db() -> AsyncIOMotorDatabase:
    assert mongo.db is not None, "MongoDB not initialized"
    return mongo.db
