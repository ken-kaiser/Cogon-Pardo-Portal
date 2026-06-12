"""
URL configuration for core project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
"""
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("admin/", admin.site.urls),
    # ── API v1 ────────────────────────────────────────────────────
    path("api/v1/accounts/", include("accounts.urls", namespace="accounts")),
    path("api/v1/residents/", include("residents.urls", namespace="residents")),
    path("api/v1/requests/", include("requests.urls", namespace="requests")),
    path("api/v1/certificates/", include("certificates.urls", namespace="certificates")),
    path("api/v1/notifications/", include("notifications.urls", namespace="notifications")),
    path("api/v1/applicants/", include("applicants.urls")),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
