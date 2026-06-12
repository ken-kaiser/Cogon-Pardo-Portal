import uuid
from django.conf import settings
from django.db import models


class CertificateTemplate(models.Model):
    """
    Stores HTML templates for each certificate type.
    Staff can manage templates via admin.
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    certificate_type = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=200)
    html_template = models.TextField(
        help_text="HTML template with Django template tags. "
        "Available context: resident, request, date, barangay_captain, etc."
    )
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["name"]
        verbose_name = "certificate template"
        verbose_name_plural = "certificate templates"

    def __str__(self):
        return self.name


class GeneratedCertificate(models.Model):
    """
    Record of each generated certificate PDF.
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    certificate_request = models.ForeignKey(
        "certificate_requests.CertificateRequest",
        on_delete=models.CASCADE,
        related_name="generated_certificates",
    )
    template_used = models.ForeignKey(
        CertificateTemplate,
        on_delete=models.SET_NULL,
        null=True,
    )
    pdf_file = models.FileField(upload_to="certificates/generated/%Y/%m/")
    generated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
    )
    generated_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-generated_at"]
        verbose_name = "generated certificate"
        verbose_name_plural = "generated certificates"

    def __str__(self):
        return f"Certificate for {self.certificate_request.request_id}"
