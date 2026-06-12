from rest_framework import serializers
from .models import Applicant, ApplicantDocument


class ApplicantDocumentSerializer(serializers.ModelSerializer):
    document_type_display = serializers.CharField(
        source="get_document_type_display",
        read_only=True,
    )
    file_url = serializers.SerializerMethodField()

    class Meta:
        model = ApplicantDocument
        fields = [
            "id",
            "document_type",
            "document_type_display",
            "file",
            "file_url",
            "uploaded_at",
        ]

    def get_file_url(self, obj):
        request = self.context.get("request")
        if obj.file and hasattr(obj.file, "url"):
            if request:
                return request.build_absolute_uri(obj.file.url)
            return obj.file.url
        return None


class ApplicantSerializer(serializers.ModelSerializer):
    documents = ApplicantDocumentSerializer(many=True, read_only=True)
    status_display = serializers.CharField(
        source="get_status_display",
        read_only=True,
    )
    education_level_display = serializers.CharField(
        source="get_highest_education_display",
        read_only=True,
    )

    class Meta:
        model = Applicant
        fields = [
            "id",
            "user",
            "first_name",
            "last_name",
            "email",
            "phone_number",
            "sitio",
            "highest_education",
            "education_level_display",
            "school_institution",
            "year_graduated",
            "has_criminal_record",
            "background_details",
            "status",
            "status_display",
            "consent_checkbox",
            "documents",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "user",
            "status",
            "created_at",
            "updated_at",
        ]

    def validate_consent_checkbox(self, value):
        if not value:
            raise serializers.ValidationError(
                "Consent checkbox is required to submit your application."
            )
        return value
