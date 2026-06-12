from django.contrib import admin
from .models import Resident


@admin.register(Resident)
class ResidentAdmin(admin.ModelAdmin):
    list_display = (
        "full_name",
        "purok_sitio",
        "contact_number",
        "verification_status",
        "created_at",
    )
    list_filter = ("verification_status", "purok_sitio", "gender", "civil_status")
    search_fields = ("first_name", "last_name", "contact_number", "address")
    readonly_fields = ("id", "created_at", "updated_at", "verified_by", "verified_at")
    ordering = ("-created_at",)
