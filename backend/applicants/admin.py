from django.contrib import admin
from .models import Applicant, ApplicantDocument


class ApplicantDocumentInline(admin.TabularInline):
    model = ApplicantDocument
    extra = 0
    readonly_fields = ["uploaded_at"]


@admin.register(Applicant)
class ApplicantAdmin(admin.ModelAdmin):
    list_display = [
        "first_name",
        "last_name",
        "email",
        "phone_number",
        "status",
        "highest_education",
        "created_at",
    ]
    list_filter = ["status", "highest_education", "created_at"]
    search_fields = ["first_name", "last_name", "email", "phone_number"]
    inlines = [ApplicantDocumentInline]
    ordering = ["-created_at"]


@admin.register(ApplicantDocument)
class ApplicantDocumentAdmin(admin.ModelAdmin):
    list_display = ["applicant", "document_type", "uploaded_at"]
    list_filter = ["document_type", "uploaded_at"]
    search_fields = ["applicant__first_name", "applicant__last_name", "document_type"]
