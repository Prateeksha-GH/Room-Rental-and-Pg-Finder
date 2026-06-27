"""Pydantic schemas for property reviews."""
from pydantic import BaseModel, Field
from typing import Optional


class ReviewCreate(BaseModel):
    property_id: str
    rating: float = Field(..., ge=1, le=5)
    comment: Optional[str] = None


class ReviewOut(BaseModel):
    id: str
    property_id: str
    user_id: str
    user_name: Optional[str] = None
    user_avatar: Optional[str] = None
    rating: float
    comment: Optional[str] = None
    created_at: Optional[str] = None
