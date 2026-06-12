from django.contrib import admin
from .models import CertificateTemplate, GeneratedCertificate


@admin.register(CertificateTemplate)
class CertificateTemplateAdmin(admin.ModelAdmin):
    list_display = ("name", "certificate_type", "is_active", "updated_at")
    list_filter = ("is_active", "certificate_type")
    search_fields = ("name", "certificate_type")


@admin.register(GeneratedCertificate)
class GeneratedCertificateAdmin(admin.ModelAdmin):
    list_display = ("certificate_request", "template_used", "generated_by", "generated_at")
    list_filter = ("generated_at",)
    readonly_fields = ("id", "certificate_request", "template_used", "pdf_file", "generated_by", "generated_at")
