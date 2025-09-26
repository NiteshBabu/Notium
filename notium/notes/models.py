"""
Database models for the Notes application.
"""
from django.db import models
from django.contrib.auth.models import User


class Tag(models.Model):
    """Tag model for categorizing notes."""

    name = models.CharField(max_length=50, unique=True)

    class Meta:
        ordering = ["name"]

    def __str__(self) -> str:
        return self.name


class Note(models.Model):
    """Note model representing user notes."""

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notes")
    title = models.CharField(max_length=200)
    content = models.TextField()
    tags = models.ManyToManyField(Tag, related_name="notes", blank=True)
    starred = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-updated_at"]

    def __str__(self) -> str:
        return f"{self.title} ({self.user.username})"

