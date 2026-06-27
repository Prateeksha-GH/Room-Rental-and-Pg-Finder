"""Schemas for in-app notifications."""
from pydantic import BaseModel
from typing import Optional


class NotificationCreate(BaseModel):
    user_id: str
    title: str
    message: str
    type: Optional[str] = "info"


class NotificationOut(BaseModel):
    id: str
    user_id: str
    title: str
    message: str
    type: str = "info"
    read: bool = False
    created_at: Optional[str] = None
