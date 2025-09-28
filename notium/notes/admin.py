from django.contrib import admin
from .models import Tag, Note


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ["id", "name"]
    search_fields = ["name"]


@admin.register(Note)
class NoteAdmin(admin.ModelAdmin):
    list_display = ["id", "title", "user", "starred", "created_at", "updated_at"]
    list_filter = ["starred", "created_at", "tags"]
    search_fields = ["title", "content"]
    filter_horizontal = ["tags"]

