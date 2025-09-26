"""
Pydantic schemas for Notes API.
"""
from datetime import datetime
from typing import Optional, List
from ninja import Schema


class TagSchema(Schema):
    """Tag schema."""

    id: int
    name: str


class NoteIn(Schema):
    """Note creation schema."""

    title: str
    content: str
    tags: Optional[List[str]] = []


class NoteUpdate(Schema):
    """Note update schema."""

    title: Optional[str] = None
    content: Optional[str] = None
    tags: Optional[List[str]] = None


class NoteOut(Schema):
    """Note output schema."""

    id: int
    title: str
    content: str
    tags: List[TagSchema]
    starred: bool
    created_at: datetime
    updated_at: datetime

