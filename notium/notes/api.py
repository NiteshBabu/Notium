"""
Notes API endpoints.
"""
from typing import List, Optional
from ninja import Router
from ninja.errors import HttpError

from core.auth import AuthBearer
from .models import Note
from .schemas import NoteIn, NoteOut, NoteUpdate
from .services import get_or_create_tags, filter_notes

router = Router()
auth = AuthBearer()


@router.post("", response=NoteOut, auth=auth)
def create_note(request, data: NoteIn) -> NoteOut:
    """
    Create a new note.

    Requires authentication. Tags will be created if they don't exist.
    """
    user = request.auth["user"]
    tags = get_or_create_tags(data.tags)

    note = Note.objects.create(
        user=user, title=data.title, content=data.content
    )
    note.tags.set(tags)

    return NoteOut.from_orm(note)


@router.get("", response=List[NoteOut], auth=auth)
def list_notes(
    request,
    search: Optional[str] = None,
    tag: Optional[str] = None,
    starred: Optional[bool] = None,
) -> List[NoteOut]:
    """
    List all notes for the authenticated user.

    Supports filtering by:
    - search: Search in title and content
    - tag: Filter by tag name
    - starred: Filter by starred status (true/false)
    """
    user = request.auth["user"]
    notes = filter_notes(user, search=search, tag=tag, starred=starred)
    return [NoteOut.from_orm(note) for note in notes]


@router.get("/recent", response=List[NoteOut], auth=auth)
def recent_notes(request, limit: int = 10) -> List[NoteOut]:
    """
    Get recent notes for the authenticated user.

    Returns the most recently updated notes, limited by the limit parameter.
    """
    user = request.auth["user"]
    notes = Note.objects.filter(user=user).order_by("-updated_at")[:limit]
    return [NoteOut.from_orm(note) for note in notes]


@router.get("/{note_id}", response=NoteOut, auth=auth)
def get_note(request, note_id: int) -> NoteOut:
    """
    Get a specific note by ID.

    Returns 404 if note doesn't exist or doesn't belong to the user.
    """
    user = request.auth["user"]
    try:
        note = Note.objects.get(id=note_id, user=user)
    except Note.DoesNotExist:
        raise HttpError(404, "Note not found")
    return NoteOut.from_orm(note)


@router.put("/{note_id}", response=NoteOut, auth=auth)
def update_note(request, note_id: int, data: NoteUpdate) -> NoteOut:
    """
    Update a note.

    Only updates provided fields. Tags will be created if they don't exist.
    Returns 404 if note doesn't exist or doesn't belong to the user.
    """
    user = request.auth["user"]
    try:
        note = Note.objects.get(id=note_id, user=user)
    except Note.DoesNotExist:
        raise HttpError(404, "Note not found")

    if data.title is not None:
        note.title = data.title
    if data.content is not None:
        note.content = data.content
    if data.tags is not None:
        tags = get_or_create_tags(data.tags)
        note.tags.set(tags)

    note.save()
    return NoteOut.from_orm(note)


@router.delete("/{note_id}", response={204: None}, auth=auth)
def delete_note(request, note_id: int) -> None:
    """
    Delete a note.

    Returns 404 if note doesn't exist or doesn't belong to the user.
    """
    user = request.auth["user"]
    try:
        note = Note.objects.get(id=note_id, user=user)
    except Note.DoesNotExist:
        raise HttpError(404, "Note not found")
    note.delete()
    return 204, None


@router.post("/{note_id}/star", response=NoteOut, auth=auth)
def toggle_star(request, note_id: int) -> NoteOut:
    """
    Toggle the starred status of a note.

    Returns 404 if note doesn't exist or doesn't belong to the user.
    """
    user = request.auth["user"]
    try:
        note = Note.objects.get(id=note_id, user=user)
    except Note.DoesNotExist:
        raise HttpError(404, "Note not found")

    note.starred = not note.starred
    note.save()
    return NoteOut.from_orm(note)

