from django.contrib import admin
from .models import CertificateRequest


@admin.register(CertificateRequest)
class CertificateRequestAdmin(admin.ModelAdmin):
    list_display = (
        "request_id",
        "resident",
        "certificate_type",
        "status",
        "assigned_staff",
        "created_at",
    )
    list_filter = ("status", "certificate_type", "created_at")
    search_fields = ("request_id", "resident__first_name", "resident__last_name")
    readonly_fields = ("id", "request_id", "qr_token", "qr_code_image", "created_at", "updated_at")
    ordering = ("-created_at",)
