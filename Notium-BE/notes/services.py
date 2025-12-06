"""
Business logic services for Notes.
"""
from typing import List, Optional
from django.contrib.auth.models import User
from django.db.models import Q
from .models import Note, Tag


def get_or_create_tags(tag_names: List[str]) -> List[Tag]:
    """Get or create tags from a list of tag names."""
    tags = []
    for name in tag_names:
        tag, _ = Tag.objects.get_or_create(name=name.strip().lower())
        tags.append(tag)
    return tags


def filter_notes(
    user: User,
    search: Optional[str] = None,
    tag: Optional[str] = None,
    starred: Optional[bool] = None,
) -> List[Note]:
    """Filter notes based on search query, tag, and starred status."""
    queryset = Note.objects.filter(user=user)

    if search:
        queryset = queryset.filter(
            Q(title__icontains=search) | Q(content__icontains=search)
        )

    if tag:
        queryset = queryset.filter(tags__name__iexact=tag.lower())

    if starred is not None:
        queryset = queryset.filter(starred=starred)

    return queryset.distinct()

