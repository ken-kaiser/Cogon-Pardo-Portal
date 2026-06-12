from rest_framework import serializers
from .models import Resident


class ResidentSerializer(serializers.ModelSerializer):
    full_name = serializers.ReadOnlyField()

    class Meta:
        model = Resident
        fields = [
            "id",
            "user",
            "first_name",
            "middle_name",
            "last_name",
            "suffix",
            "full_name",
            "date_of_birth",
            "gender",
            "civil_status",
            "purok_sitio",
            "address",
            "contact_number",
            "email",
            "photo",
            "verification_status",
            "verified_by",
            "verified_at",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "verification_status",
            "verified_by",
            "verified_at",
            "created_at",
            "updated_at",
        ]


class ResidentCreateSerializer(serializers.ModelSerializer):
    """Used during registration — auto-links to the authenticated user."""

    class Meta:
        model = Resident
        fields = [
            "first_name",
            "middle_name",
            "last_name",
            "suffix",
            "date_of_birth",
            "gender",
            "civil_status",
            "purok_sitio",
            "address",
            "contact_number",
            "email",
            "photo",
        ]

    def create(self, validated_data):
        validated_data["user"] = self.context["request"].user
        return super().create(validated_data)


class ResidentVerifySerializer(serializers.ModelSerializer):
    """Staff-only serializer for verifying/rejecting a resident."""

    class Meta:
        model = Resident
        fields = ["verification_status"]
