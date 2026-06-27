"""Shared helpers for serializing Mongo documents."""
from bson import ObjectId
from typing import Any


def to_object_id(value: str) -> ObjectId | None:
    try:
        return ObjectId(value)
    except Exception:
        return None


def serialize_doc(doc: dict[str, Any] | None) -> dict[str, Any] | None:
    """Convert Mongo ObjectId fields to strings recursively."""
    if doc is None:
        return None
    out: dict[str, Any] = {}
    for k, v in doc.items():
        key = "id" if k == "_id" else k
        if isinstance(v, ObjectId):
            out[key] = str(v)
        elif isinstance(v, list):
            out[key] = [serialize_doc(i) if isinstance(i, dict) else (str(i) if isinstance(i, ObjectId) else i) for i in v]
        elif isinstance(v, dict):
            out[key] = serialize_doc(v)
        else:
            out[key] = v
    return out


def serialize_list(docs: list[dict[str, Any]]) -> list[dict[str, Any]]:
    return [serialize_doc(d) for d in docs if d is not None]
