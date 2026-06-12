import io
import json

import qrcode
from django.core.files.base import ContentFile
from rest_framework import generics, permissions, status
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.permissions import IsOnlyStaff

from .models import CertificateRequest, CertificateDocument
from .serializers import (
    CertificateRequestCreateSerializer,
    CertificateRequestSerializer,
    CertificateRequestUpdateSerializer,
)


class RequestListView(generics.ListAPIView):
    """List requests. Admin/Staff see all, residents see only their own."""

    serializer_class = CertificateRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        qs = CertificateRequest.objects.select_related("resident", "requested_by")
        if user.role in ("admin", "staff"):
            return qs.all()
        return qs.filter(requested_by=user)


class RequestCreateView(generics.CreateAPIView):
    """Create a new certificate request. Accessible to all authenticated users."""

    serializer_class = CertificateRequestCreateSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def create(self, request, *args, **kwargs):
        # Parse extra_fields if it's sent as a JSON string via multipart/form-data
        if "extra_fields" in request.data and isinstance(request.data["extra_fields"], str):
            try:
                # QueryDict is immutable, so we must make a mutable copy
                data = request.data.copy()
                data["extra_fields"] = json.loads(data["extra_fields"])
                serializer = self.get_serializer(data=data)
                serializer.is_valid(raise_exception=True)
                self.perform_create(serializer)
                headers = self.get_success_headers(serializer.data)
                return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
            except (ValueError, TypeError):
                pass
        return super().create(request, *args, **kwargs)

    def perform_create(self, serializer):
        instance = serializer.save()

        # Save any attached files as CertificateDocuments
        for key in self.request.FILES:
            for file in self.request.FILES.getlist(key):
                # We use the key as the document name (e.g. 'valid_id')
                CertificateDocument.objects.create(
                    request=instance,
                    name=key.replace('_', ' ').title(),
                    file=file
                )

        # Generate QR code image
        _generate_qr(instance)


class RequestDetailView(generics.RetrieveAPIView):
    """Retrieve a single request. Staff only."""

    queryset = CertificateRequest.objects.select_related("resident")
    serializer_class = CertificateRequestSerializer
    permission_classes = [IsOnlyStaff]
    lookup_field = "id"


class RequestUpdateView(generics.UpdateAPIView):
    """Staff-only: update status / assign staff / add notes."""

    queryset = CertificateRequest.objects.all()
    serializer_class = CertificateRequestUpdateSerializer
    permission_classes = [IsOnlyStaff]
    lookup_field = "id"


class RequestQRCodeView(APIView):
    """Return QR code PNG for a specific request. Staff only."""

    permission_classes = [IsOnlyStaff]

    def get(self, request, id):
        try:
            cert_request = CertificateRequest.objects.get(id=id)
        except CertificateRequest.DoesNotExist:
            return Response(
                {"detail": "Request not found."}, status=status.HTTP_404_NOT_FOUND
            )

        self.check_object_permissions(request, cert_request)

        if not cert_request.qr_code_image:
            _generate_qr(cert_request)

        return Response(
            {
                "request_id": cert_request.request_id,
                "qr_token": cert_request.qr_token,
                "qr_code_url": (
                    request.build_absolute_uri(cert_request.qr_code_image.url)
                    if cert_request.qr_code_image
                    else None
                ),
            }
        )


class VerifyQRTokenView(APIView):
    """Verify a QR token (used at pickup window). Staff only."""

    permission_classes = [IsOnlyStaff]

    def get(self, request, qr_token):
        try:
            cert_request = CertificateRequest.objects.select_related(
                "resident"
            ).get(qr_token=qr_token)
        except CertificateRequest.DoesNotExist:
            return Response(
                {"valid": False, "detail": "Invalid QR token."},
                status=status.HTTP_404_NOT_FOUND,
            )

        return Response(
            {
                "valid": True,
                "request_id": cert_request.request_id,
                "resident_name": cert_request.resident.full_name,
                "certificate_type": cert_request.get_certificate_type_display(),
                "status": cert_request.get_status_display(),
            }
        )


# ── Helper ────────────────────────────────────────────────────────
def _generate_qr(instance: CertificateRequest):
    """Generate a QR code PNG and attach it to the request instance."""
    qr_data = (
        f"request_id={instance.request_id}"
        f"&resident_id={instance.resident_id}"
        f"&qr_token={instance.qr_token}"
    )
    img = qrcode.make(qr_data, box_size=10, border=4)
    buffer = io.BytesIO()
    img.save(buffer, format="PNG")
    buffer.seek(0)

    filename = f"qr_{instance.request_id}.png"
    instance.qr_code_image.save(filename, ContentFile(buffer.read()), save=True)
