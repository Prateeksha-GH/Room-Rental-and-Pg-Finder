"""Pydantic schemas for property listings."""
from pydantic import BaseModel, Field
from typing import Optional, Literal


class PropertyBase(BaseModel):
    title: str = Field(..., min_length=3, max_length=120)
    description: str = Field(..., min_length=10)
    location: str
    city: str
    price: float = Field(..., gt=0)
    gender: Literal["male", "female", "any"] = "any"
    room_type: Literal["single", "shared", "private", "dormitory"] = "single"
    category: Literal["pg", "rental", "hostel", "flat"] = "pg"
    food_included: bool = False
    ac: bool = False
    wifi: bool = False
    furnished: bool = False
    parking: bool = False
    laundry: bool = False
    images: list[str] = []
    amenities: list[str] = []
    map_url: Optional[str] = None
    available: bool = True


class PropertyCreate(PropertyBase):
    pass


class PropertyUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    location: Optional[str] = None
    city: Optional[str] = None
    price: Optional[float] = None
    gender: Optional[str] = None
    room_type: Optional[str] = None
    category: Optional[str] = None
    food_included: Optional[bool] = None
    ac: Optional[bool] = None
    wifi: Optional[bool] = None
    furnished: Optional[bool] = None
    parking: Optional[bool] = None
    laundry: Optional[bool] = None
    images: Optional[list[str]] = None
    amenities: Optional[list[str]] = None
    map_url: Optional[str] = None
    available: Optional[bool] = None


class PropertyOut(PropertyBase):
    id: str
    owner_id: str
    rating: float = 0.0
    review_count: int = 0
    created_at: Optional[str] = None
