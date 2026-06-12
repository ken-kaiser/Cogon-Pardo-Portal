from django.contrib.auth import get_user_model
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView

from .permissions import IsAdmin
from .serializers import (
    CustomTokenObtainPairSerializer,
    RegisterSerializer,
    UserAdminSerializer,
    UserSerializer,
)

User = get_user_model()


# ── JWT Auth ──────────────────────────────────────────────────────
class CustomTokenObtainPairView(TokenObtainPairView):
    """Login endpoint returning JWT with custom claims (role, email)."""

    serializer_class = CustomTokenObtainPairSerializer


# ── Registration ──────────────────────────────────────────────────
class RegisterView(generics.CreateAPIView):
    """Public registration endpoint for new residents."""

    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(
            {
                "message": "Registration successful. Please verify your account.",
                "user_id": str(user.id),
                "email": user.email,
            },
            status=status.HTTP_201_CREATED,
        )


# ── Current User Profile ─────────────────────────────────────────
class ProfileView(generics.RetrieveUpdateAPIView):
    """Retrieve or update the authenticated user's own profile."""

    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


# ── Admin: User Management ───────────────────────────────────────
class UserListView(generics.ListAPIView):
    """Admin-only endpoint to list all users."""

    queryset = User.objects.select_related("resident_profile").all()
    serializer_class = UserAdminSerializer
    permission_classes = [IsAdmin]


class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Admin-only endpoint to manage individual users."""

    queryset = User.objects.all()
    serializer_class = UserAdminSerializer
    permission_classes = [IsAdmin]
    lookup_field = "id"


class VerifyPasswordView(APIView):
    """
    Endpoint for Admin/Staff to verify their password before proceeding with sensitive CRUD operations.
    """

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        password = request.data.get("password")
        if not password:
            return Response(
                {"error": "Password is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = request.user
        if not user.check_password(password):
            return Response(
                {"error": "Incorrect password. Verification failed."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response({"message": "Password verified successfully."}, status=status.HTTP_200_OK)
