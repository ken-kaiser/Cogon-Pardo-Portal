# pyrefly: ignore [missing-import]
from rest_framework import serializers
from .models import CertificateRequest, CertificateDocument

class CertificateDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = CertificateDocument
        fields = ["id", "name", "file", "uploaded_at"]


class CertificateRequestSerializer(serializers.ModelSerializer):
    certificate_type_display = serializers.CharField(
        source="get_certificate_type_display", read_only=True
    )
    status_display = serializers.CharField(
        source="get_status_display", read_only=True
    )
    resident_name = serializers.CharField(
        source="resident.full_name", read_only=True
    )
    resident_purok_sitio = serializers.CharField(
        source="resident.purok_sitio", read_only=True
    )
    resident_contact_number = serializers.SerializerMethodField()
    documents = CertificateDocumentSerializer(many=True, read_only=True)

    class Meta:
        model = CertificateRequest
        fields = [
            "id",
            "request_id",
            "resident",
            "resident_name",
            "resident_purok_sitio",
            "resident_contact_number",
            "certificate_type",
            "certificate_type_display",
            "purpose",
            "status",
            "status_display",
            "requested_by",
            "assigned_staff",
            "notes",
            "rejection_reason",
            "extra_fields",
            "documents",
            "qr_token",
            "qr_code_image",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "request_id",
            "qr_token",
            "qr_code_image",
            "created_at",
            "updated_at",
        ]

    def get_resident_contact_number(self, obj):
        """Return resident contact_number, falling back to user phone_number."""
        if obj.resident and obj.resident.contact_number:
            return obj.resident.contact_number
        if obj.resident and hasattr(obj.resident, "user") and obj.resident.user:
            return obj.resident.user.phone_number or ""
        return ""


class CertificateRequestCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CertificateRequest
        fields = ["certificate_type", "purpose", "notes", "extra_fields"]

    def create(self, validated_data):
        user = self.context["request"].user
        validated_data["requested_by"] = user
        if hasattr(user, "resident_profile"):
            validated_data["resident"] = user.resident_profile
        else:
            raise serializers.ValidationError(
                {"detail": "Your account does not have an associated resident profile. Please complete your registration."}
            )
        return super().create(validated_data)


class CertificateRequestUpdateSerializer(serializers.ModelSerializer):
    """Staff-only serializer for updating status and assignment."""

    class Meta:
        model = CertificateRequest
        fields = ["status", "assigned_staff", "notes", "rejection_reason"]
