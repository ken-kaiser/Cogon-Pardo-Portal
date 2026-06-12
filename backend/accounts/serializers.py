from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()


# ── JWT ───────────────────────────────────────────────────────────
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Inject role and user_id as custom JWT claims."""

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["role"] = user.role
        token["email"] = user.email
        token["full_name"] = user.get_full_name()
        return token


# ── Registration ──────────────────────────────────────────────────
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True)
    sitio = serializers.CharField(write_only=True, required=True)

    SITIO_CHOICES = [
        "All Season 1",
        "All Season 2",
        "All Season 3",
        "Apple",
        "Caimito",
        "Elma",
        "Laguna 1",
        "Laguna 2",
        "Little Hawaii",
        "Lourdes Extension",
        "Lourdes Proper",
    ]

    class Meta:
        model = User
        fields = [
            "email",
            "first_name",
            "last_name",
            "phone_number",
            "password",
            "password_confirm",
            "sitio",
        ]

    def validate_sitio(self, value):
        if value not in self.SITIO_CHOICES:
            raise serializers.ValidationError("Invalid Sitio selection.")
        return value

    def validate(self, attrs):
        if attrs["password"] != attrs.pop("password_confirm"):
            raise serializers.ValidationError(
                {"password_confirm": "Passwords do not match."}
            )
        return attrs

    def create(self, validated_data):
        sitio = validated_data.pop("sitio", "TBD")
        user = User.objects.create_user(**validated_data)
        # Auto-create a Resident profile using the selected Sitio address
        from residents.models import Resident
        Resident.objects.create(
            user=user,
            first_name=user.first_name,
            last_name=user.last_name,
            purok_sitio=sitio,
            address=f"Sitio {sitio}, Barangay Cogon-Pardo, Cebu City",
            contact_number=user.phone_number or "",
            email=user.email or "",
        )
        return user


# ── User Detail ───────────────────────────────────────────────────
class UserSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "first_name",
            "last_name",
            "full_name",
            "role",
            "phone_number",
            "is_verified",
            "date_joined",
        ]
        read_only_fields = ["id", "role", "is_verified", "date_joined"]

    def get_full_name(self, obj):
        return obj.get_full_name()


class UserAdminSerializer(serializers.ModelSerializer):
    """Serializer for admin to manage users including role assignment."""
    purok_sitio = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "first_name",
            "last_name",
            "role",
            "phone_number",
            "purok_sitio",
            "is_verified",
            "is_active",
            "date_joined",
        ]
        read_only_fields = ["id", "date_joined", "purok_sitio"]

    def get_purok_sitio(self, obj):
        if hasattr(obj, "resident_profile") and obj.resident_profile:
            return obj.resident_profile.purok_sitio
        return "N/A"
