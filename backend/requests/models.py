import secrets
import time
import uuid

from django.conf import settings
from django.db import models

from residents.models import Resident

STATUS_CHOICES = [
    ("pending", "Pending"),
    ("under_review", "Under Review"),
    ("for_verification", "For Verification"),
    ("approved", "Approved"),
    ("rejected", "Rejected"),
    ("ready_printing", "Ready for Printing"),
    ("ready_pickup", "Ready for Pickup"),
    ("completed", "Completed"),
    ("archived", "Archived"),
]

CERTIFICATE_TYPES = [
    ("barangay_clearance", "Barangay Clearance"),
    ("residency", "Certificate of Residency"),
    ("indigency", "Certificate of Indigency"),
    ("cedula", "Cedula"),
    ("low_income", "Certificate of Low Income"),
    ("no_income", "Certificate of No Income"),
    ("business_permit", "Certificate of Business Permit"),
    ("identification", "Certificate of Identification"),
    ("attestation", "Attestation"),
    ("jail_entrance", "Jail Entrance"),
    ("solo_parent", "Solo Parent"),
]


class CertificateRequest(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    request_id = models.CharField(max_length=20, unique=True, editable=False)
    resident = models.ForeignKey(
        Resident,
        on_delete=models.PROTECT,
        related_name="certificate_requests",
    )
    certificate_type = models.CharField(max_length=50, choices=CERTIFICATE_TYPES)
    purpose = models.TextField(blank=True, help_text="Purpose of the certificate request")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    requested_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name="requests_made",
    )
    assigned_staff = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="assigned_requests",
    )
    notes = models.TextField(blank=True)
    rejection_reason = models.TextField(blank=True)
    extra_fields = models.JSONField(default=dict, blank=True, help_text="Dynamic fields depending on certificate type")

    # ── QR Code ──────────────────────────────────────────────────
    qr_token = models.CharField(max_length=64, unique=True, blank=True)
    qr_code_image = models.ImageField(
        upload_to="requests/qr_codes/%Y/%m/",
        blank=True,
        null=True,
    )

    # ── Timestamps ───────────────────────────────────────────────
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "certificate request"
        verbose_name_plural = "certificate requests"

    def __str__(self):
        return f"{self.request_id} – {self.get_certificate_type_display()}"

    def save(self, *args, **kwargs):
        if not self.request_id:
            self.request_id = f"CP-{int(time.time())}-{secrets.token_hex(2).upper()}"
        if not self.qr_token:
            self.qr_token = secrets.token_urlsafe(32)
        super().save(*args, **kwargs)


class CertificateDocument(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    request = models.ForeignKey(
        CertificateRequest,
        on_delete=models.CASCADE,
        related_name="documents"
    )
    name = models.CharField(max_length=255, help_text="Name or type of the document (e.g., 'Valid ID', 'Proof of Residency')")
    file = models.FileField(upload_to="requests/documents/%Y/%m/")
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-uploaded_at"]

    def __str__(self):
        return f"{self.name} for {self.request.request_id}"