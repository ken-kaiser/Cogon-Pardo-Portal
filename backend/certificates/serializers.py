from rest_framework import serializers
from .models import CertificateTemplate, GeneratedCertificate


class CertificateTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CertificateTemplate
        fields = [
            "id",
            "certificate_type",
            "name",
            "html_template",
            "is_active",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


class GeneratedCertificateSerializer(serializers.ModelSerializer):
    class Meta:
        model = GeneratedCertificate
        fields = [
            "id",
            "certificate_request",
            "template_used",
            "pdf_file",
            "generated_by",
            "generated_at",
        ]
        read_only_fields = ["id", "pdf_file", "generated_by", "generated_at"]
