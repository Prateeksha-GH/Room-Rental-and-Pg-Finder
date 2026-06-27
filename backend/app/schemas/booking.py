"""Pydantic schemas for bookings & visit scheduling."""
from pydantic import BaseModel, Field
from typing import Optional, Literal

BookingStatus = Literal["pending", "approved", "rejected", "cancelled", "completed"]


class BookingCreate(BaseModel):
    property_id: str
    visit_date: str = Field(..., description="ISO date for visit / move-in")
    message: Optional[str] = None


class BookingUpdate(BaseModel):
    status: BookingStatus


class BookingOut(BaseModel):
    id: str
    property_id: str
    tenant_id: str
    owner_id: str
    visit_date: str
    message: Optional[str] = None
    status: BookingStatus
    created_at: Optional[str] = None
    property: Optional[dict] = None
    tenant: Optional[dict] = None
