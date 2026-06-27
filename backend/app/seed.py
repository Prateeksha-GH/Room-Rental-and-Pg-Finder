"""Seed script: populates demo users + properties. Run: python -m app.seed"""
import asyncio
import random
from datetime import datetime, timezone
from app.database.mongodb import connect_to_mongo, get_db, close_mongo_connection
from app.utils.security import hash_password


SAMPLE_IMAGES = [
    "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200",
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200",
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200",
    "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200",
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200",
    "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200",
]


CITY_AREAS: dict[str, list[str]] = {
    "Bangalore": ["Marathahalli", "Electronic City", "Jayanagar", "Hebbal", "JP Nagar"],
    "Mumbai": ["Andheri West", "Bandra", "Powai", "Goregaon East", "Thane"],
    "Delhi": ["Karol Bagh", "Saket", "Dwarka Sector 12", "Lajpat Nagar", "Rohini"],
    "Hyderabad": ["Madhapur", "Gachibowli", "Kondapur", "Begumpet", "Banjara Hills"],
    "Chennai": ["Adyar", "T. Nagar", "Velachery", "OMR Thoraipakkam", "Anna Nagar"],
    "Kolkata": ["Salt Lake Sector V", "Park Street", "New Town", "Howrah", "Ballygunge"],
    "Pune": ["Hinjewadi Phase 1", "Kothrud", "Viman Nagar", "Baner", "Wakad"],
    "Ahmedabad": ["Bopal", "Vastrapur", "Satellite", "SG Highway", "Maninagar"],
    "Jaipur": ["Malviya Nagar", "Vaishali Nagar", "Mansarovar", "C-Scheme"],
    "Lucknow": ["Gomti Nagar", "Hazratganj", "Aliganj", "Indira Nagar"],
    "Chandigarh": ["Sector 17", "Sector 22", "Sector 35", "Sector 44"],
    "Indore": ["Vijay Nagar", "AB Road", "Palasia", "Rajwada"],
    "Bhopal": ["MP Nagar", "New Market", "Arera Colony", "Shahpura"],
    "Coimbatore": ["RS Puram", "Saibaba Colony", "Peelamedu", "Race Course"],
    "Kochi": ["MG Road", "Edappally", "Kakkanad", "Fort Kochi"],
    "Visakhapatnam": ["Beach Road", "MVP Colony", "Madhurawada", "Dwaraka Nagar"],
    "Bhubaneswar": ["Patia", "Saheed Nagar", "Khandagiri", "Jaydev Vihar"],
    "Nagpur": ["Dharampeth", "Sitabuldi", "Wardha Road", "Civil Lines"],
    "Surat": ["Adajan", "Vesu", "Athwa", "Piplod"],
    "Mysore": ["Vijayanagar", "Saraswathipuram", "Kuvempunagar", "Gokulam"],
}

PROPERTY_TYPES = [
    ("Boys PG", "pg", "shared"),
    ("Girls PG", "pg", "single"),
    ("Co-Living", "rental", "private"),
    ("Hostel", "hostel", "dormitory"),
    ("1BHK Flat", "flat", "private"),
    ("2BHK Flat", "flat", "private"),
    ("Studio Apartment", "rental", "private"),
    ("Luxury PG", "pg", "single"),
    ("Budget PG", "pg", "shared"),
    ("Premium Co-Living", "rental", "private"),
]

ADJECTIVES = ["Sunrise", "Skyline", "Greenview", "Urban Nest", "Sakura", "Cozy",
              "Royal", "Elite", "Comfort", "Lotus", "Pearl", "Maple", "Oakwood",
              "Silver Oak", "Emerald", "Sapphire", "Harmony", "Serene", "Crown",
              "Heritage", "Bliss", "Tranquil", "Vista", "Horizon"]


def build_generated_properties(count: int, owner_id, now: str) -> list[dict]:
    rng = random.Random(42)
    city_keys = list(CITY_AREAS.keys())
    props: list[dict] = []
    for i in range(count):
        city = city_keys[i % len(city_keys)]
        area = rng.choice(CITY_AREAS[city])
        adj = rng.choice(ADJECTIVES)
        ptype_word, category, room_type = rng.choice(PROPERTY_TYPES)
        gender = rng.choice(["male", "female", "any"])
        price = rng.choice([5500, 6500, 7500, 8500, 9500, 11000, 13500, 16000,
                            18500, 22000, 26000, 30000])
        ac = rng.random() < 0.7
        wifi = rng.random() < 0.95
        food = rng.random() < 0.6 if category in ("pg", "hostel") else rng.random() < 0.2
        furnished = rng.random() < 0.8
        parking = rng.random() < 0.5
        laundry = rng.random() < 0.6
        amenities = [a for a, on in [
            ("AC", ac), ("WiFi", wifi), ("Food", food), ("Parking", parking),
            ("Laundry", laundry), ("CCTV", rng.random() < 0.6),
            ("Hot Water", rng.random() < 0.8), ("Power Backup", rng.random() < 0.5),
            ("Gym", rng.random() < 0.25), ("Housekeeping", rng.random() < 0.4),
        ] if on]
        img_start = i % len(SAMPLE_IMAGES)
        images = SAMPLE_IMAGES[img_start:img_start + 3]
        if len(images) < 3:
            images += SAMPLE_IMAGES[: 3 - len(images)]
        props.append({
            "title": f"{adj} {ptype_word} - {area}",
            "description": (
                f"Comfortable {ptype_word.lower()} in {area}, {city}. "
                f"Walking distance to public transport. Well-maintained property "
                f"with a friendly community and responsive management."
            ),
            "location": area,
            "city": city,
            "price": price,
            "gender": gender,
            "room_type": room_type,
            "category": category,
            "food_included": food,
            "ac": ac,
            "wifi": wifi,
            "furnished": furnished,
            "parking": parking,
            "laundry": laundry,
            "amenities": amenities,
            "owner_id": owner_id,
            "images": images,
            "map_url": None,
            "available": True,
            "rating": round(3.5 + rng.random() * 1.5, 1),
            "review_count": rng.randint(0, 50),
            "created_at": now,
        })
    return props


async def run() -> None:
    await connect_to_mongo()
    db = get_db()
    await db.users.delete_many({})
    await db.properties.delete_many({})
    await db.bookings.delete_many({})
    await db.reviews.delete_many({})
    await db.wishlists.delete_many({})
    await db.notifications.delete_many({})

    now = datetime.now(timezone.utc).isoformat()

    users = [
        {"name": "Admin User", "email": "admin@roomnest.com", "password": hash_password("admin123"),
         "role": "admin", "phone": "+91-9000000001", "avatar": None, "bio": "Platform admin", "created_at": now},
        {"name": "Rahul Owner", "email": "owner@roomnest.com", "password": hash_password("owner123"),
         "role": "owner", "phone": "+91-9000000002", "avatar": None, "bio": "PG owner in Bangalore", "created_at": now},
        {"name": "Priya Tenant", "email": "tenant@roomnest.com", "password": hash_password("tenant123"),
         "role": "tenant", "phone": "+91-9000000003", "avatar": None, "bio": "Looking for cozy PG", "created_at": now},
    ]
    res = await db.users.insert_many(users)
    owner_id = res.inserted_ids[1]

    sample_props = [
        {
            "title": "Sunrise Boys PG - Koramangala",
            "description": "Modern boys PG with AC, WiFi, food, and gym. 5 min from Forum mall.",
            "location": "Koramangala 5th Block", "city": "Bangalore", "price": 9500,
            "gender": "male", "room_type": "shared", "category": "pg",
            "food_included": True, "ac": True, "wifi": True, "furnished": True,
            "parking": True, "laundry": True,
            "amenities": ["AC", "WiFi", "Food", "Laundry", "CCTV", "Hot Water"],
        },
        {
            "title": "Sakura Girls PG - HSR Layout",
            "description": "Safe and secure girls PG. 24/7 security, hygienic food, single & shared rooms.",
            "location": "HSR Layout Sector 1", "city": "Bangalore", "price": 11000,
            "gender": "female", "room_type": "single", "category": "pg",
            "food_included": True, "ac": True, "wifi": True, "furnished": True,
            "parking": False, "laundry": True,
            "amenities": ["AC", "WiFi", "Food", "Security", "Power Backup"],
        },
        {
            "title": "Urban Nest Co-Living - Indiranagar",
            "description": "Premium co-living with rooftop, gaming room, gym & weekly housekeeping.",
            "location": "Indiranagar 100ft Road", "city": "Bangalore", "price": 16000,
            "gender": "any", "room_type": "private", "category": "rental",
            "food_included": False, "ac": True, "wifi": True, "furnished": True,
            "parking": True, "laundry": True,
            "amenities": ["Gym", "Gaming", "Housekeeping", "Rooftop"],
        },
        {
            "title": "Budget Friendly PG - BTM",
            "description": "Affordable PG near tech parks. Basic amenities included.",
            "location": "BTM 2nd Stage", "city": "Bangalore", "price": 6500,
            "gender": "male", "room_type": "shared", "category": "pg",
            "food_included": True, "ac": False, "wifi": True, "furnished": False,
            "parking": False, "laundry": False,
            "amenities": ["WiFi", "Food", "Hot Water"],
        },
        {
            "title": "Skyline 2BHK Flat - Whitefield",
            "description": "Fully furnished 2BHK flat ideal for working professionals or families.",
            "location": "Whitefield ITPL Main Road", "city": "Bangalore", "price": 28000,
            "gender": "any", "room_type": "private", "category": "flat",
            "food_included": False, "ac": True, "wifi": True, "furnished": True,
            "parking": True, "laundry": False,
            "amenities": ["AC", "WiFi", "Parking", "Lift", "Power Backup"],
        },
        {
            "title": "Greenview Hostel - Pune Uni",
            "description": "Affordable hostel for students near Pune University.",
            "location": "Aundh", "city": "Pune", "price": 5500,
            "gender": "male", "room_type": "dormitory", "category": "hostel",
            "food_included": True, "ac": False, "wifi": True, "furnished": True,
            "parking": False, "laundry": True,
            "amenities": ["WiFi", "Food", "Study Room"],
        },
    ]

    for i, p in enumerate(sample_props):
        p.update({
            "owner_id": owner_id,
            "images": SAMPLE_IMAGES[i % len(SAMPLE_IMAGES):i % len(SAMPLE_IMAGES) + 3] or SAMPLE_IMAGES[:3],
            "map_url": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d62208.06!2d77.59!3d12.97!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae15ba!2sBangalore!5e0!3m2!1sen!2sin",
            "available": True, "rating": 4.0 + (i % 3) * 0.3, "review_count": 5 + i,
            "created_at": now,
        })

    all_props = sample_props + build_generated_properties(100, owner_id, now)
    await db.properties.insert_many(all_props)
    print(f"[OK] Seed complete: {len(users)} users, {len(all_props)} properties")
    print("  admin@roomnest.com / admin123")
    print("  owner@roomnest.com / owner123")
    print("  tenant@roomnest.com / tenant123")
    await close_mongo_connection()


if __name__ == "__main__":
    asyncio.run(run())
