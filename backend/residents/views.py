from django.utils import timezone
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.permissions import IsOwnerOrStaff, IsStaffUser

from .models import Resident
from .serializers import (
    ResidentCreateSerializer,
    ResidentSerializer,
    ResidentVerifySerializer,
)


class ResidentListView(generics.ListAPIView):
    """Staff can list all residents; residents see only their own."""

    serializer_class = ResidentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role in ("admin", "staff"):
            return Resident.objects.filter(user__role="resident")
        return Resident.objects.filter(user=user)


class ResidentCreateView(generics.CreateAPIView):
    """Authenticated users create their own resident profile."""

    serializer_class = ResidentCreateSerializer
    permission_classes = [permissions.IsAuthenticated]


class ResidentDetailView(generics.RetrieveUpdateAPIView):
    """View/update a resident profile. Staff can access any; residents own only."""

    queryset = Resident.objects.all()
    serializer_class = ResidentSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrStaff]
    lookup_field = "id"


class ResidentVerifyView(APIView):
    """Staff-only endpoint to verify or reject a resident."""

    permission_classes = [IsStaffUser]

    def patch(self, request, id):
        try:
            resident = Resident.objects.get(id=id)
        except Resident.DoesNotExist:
            return Response(
                {"detail": "Resident not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = ResidentVerifySerializer(resident, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)

        resident.verification_status = serializer.validated_data["verification_status"]
        resident.verified_by = request.user
        resident.verified_at = timezone.now()
        resident.save()

        return Response(ResidentSerializer(resident).data)
