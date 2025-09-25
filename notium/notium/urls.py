from django.contrib import admin
from django.urls import path
from ninja import NinjaAPI

from core.auth import router as auth_router

api = NinjaAPI(
    title="Notium",
    description="Notes With Superpowers: Notes API Backend Build With Django & Django Ninja",
    version="1.0.0",
)

api.add_router("/auth", auth_router, tags=["authentication"])

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", api.urls),
]
