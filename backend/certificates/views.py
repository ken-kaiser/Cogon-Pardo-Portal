import io
from datetime import date

from django.core.files.base import ContentFile
from django.http import HttpResponse
from django.template import Template, Context
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.permissions import IsStaffUser
from requests.models import CertificateRequest

from .models import CertificateTemplate, GeneratedCertificate
from .serializers import CertificateTemplateSerializer, GeneratedCertificateSerializer

# Try to import WeasyPrint; fall back gracefully if not installed
try:
    from weasyprint import HTML as WeasyHTML
    HAS_WEASYPRINT = True
except (ImportError, OSError):
    HAS_WEASYPRINT = False


class TemplateListView(generics.ListCreateAPIView):
    """Staff: list and create certificate templates."""

    queryset = CertificateTemplate.objects.filter(is_active=True)
    serializer_class = CertificateTemplateSerializer
    permission_classes = [IsStaffUser]


class TemplateDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Staff: manage individual certificate templates."""

    queryset = CertificateTemplate.objects.all()
    serializer_class = CertificateTemplateSerializer
    permission_classes = [IsStaffUser]
    lookup_field = "id"


class CertificatePreviewView(APIView):
    """
    Staff-only: Preview a certificate as rendered HTML.
    Takes a request_id and renders the matching template with resident data.
    """

    permission_classes = [IsStaffUser]

    def get(self, request, request_id):
        try:
            cert_request = CertificateRequest.objects.select_related(
                "resident"
            ).get(id=request_id)
        except CertificateRequest.DoesNotExist:
            return Response(
                {"detail": "Certificate request not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        try:
            template = CertificateTemplate.objects.get(
                certificate_type=cert_request.certificate_type, is_active=True
            )
        except CertificateTemplate.DoesNotExist:
            return Response(
                {"detail": "No active template for this certificate type."},
                status=status.HTTP_404_NOT_FOUND,
            )

        html_content = _render_certificate(template, cert_request)
        return HttpResponse(html_content, content_type="text/html")


class CertificateGenerateView(APIView):
    """
    Staff-only: Generate a PDF certificate using WeasyPrint.
    Stores the generated PDF and returns it.
    """

    permission_classes = [IsStaffUser]

    def post(self, request, request_id):
        if not HAS_WEASYPRINT:
            return Response(
                {"detail": "WeasyPrint is not installed. Cannot generate PDF."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        try:
            cert_request = CertificateRequest.objects.select_related(
                "resident"
            ).get(id=request_id)
        except CertificateRequest.DoesNotExist:
            return Response(
                {"detail": "Certificate request not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        try:
            template = CertificateTemplate.objects.get(
                certificate_type=cert_request.certificate_type, is_active=True
            )
        except CertificateTemplate.DoesNotExist:
            return Response(
                {"detail": "No active template for this certificate type."},
                status=status.HTTP_404_NOT_FOUND,
            )

        html_content = _render_certificate(template, cert_request)

        # Generate PDF
        pdf_buffer = io.BytesIO()
        WeasyHTML(string=html_content).write_pdf(pdf_buffer)
        pdf_buffer.seek(0)

        # Save record
        generated = GeneratedCertificate.objects.create(
            certificate_request=cert_request,
            template_used=template,
            generated_by=request.user,
        )
        filename = f"cert_{cert_request.request_id}.pdf"
        generated.pdf_file.save(filename, ContentFile(pdf_buffer.read()), save=True)

        # Update request status
        cert_request.status = "ready_printing"
        cert_request.save()

        return Response(
            GeneratedCertificateSerializer(generated).data,
            status=status.HTTP_201_CREATED,
        )


class GeneratedCertificateListView(generics.ListAPIView):
    """Staff: list all generated certificates."""

    queryset = GeneratedCertificate.objects.select_related("certificate_request")
    serializer_class = GeneratedCertificateSerializer
    permission_classes = [IsStaffUser]


# ── Helper ────────────────────────────────────────────────────────
def _render_certificate(template: CertificateTemplate, cert_request) -> str:
    """Render a certificate HTML template with resident and request data."""
    resident = cert_request.resident
    context = Context(
        {
            "resident": resident,
            "request": cert_request,
            "full_name": resident.full_name,
            "address": resident.address,
            "purok_sitio": resident.purok_sitio,
            "certificate_type": cert_request.get_certificate_type_display(),
            "purpose": cert_request.purpose,
            "date_today": date.today(),
            "date_today_formatted": date.today().strftime("%B %d, %Y"),
            "barangay_name": "Barangay Cogon-Pardo",
            "barangay_captain": "Hon. [Barangay Captain Name]",
        }
    )
    django_template = Template(template.html_template)
    return django_template.render(context)
