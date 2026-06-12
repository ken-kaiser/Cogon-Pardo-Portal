import uuid
from django.conf import settings
from django.db import models


class Resident(models.Model):
    """
    Resident profile linked to a User account.
    Stores personal details needed for certificate generation.
    """

    class VerificationStatus(models.TextChoices):
        PENDING = "pending", "Pending"
        VERIFIED = "verified", "Verified"
        REJECTED = "rejected", "Rejected"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="resident_profile",
    )

    # ── Personal Information ──────────────────────────────────────
    first_name = models.CharField(max_length=100)
    middle_name = models.CharField(max_length=100, blank=True)
    last_name = models.CharField(max_length=100)
    suffix = models.CharField(max_length=20, blank=True)  # Jr., Sr., III, etc.
    date_of_birth = models.DateField(null=True, blank=True)
    gender = models.CharField(
        max_length=10,
        choices=[
            ("male", "Male"),
            ("female", "Female"),
        ],
        blank=True,
    )
    civil_status = models.CharField(
        max_length=20,
        choices=[
            ("single", "Single"),
            ("married", "Married"),
            ("widowed", "Widowed"),
            ("separated", "Separated"),
        ],
        blank=True,
    )

    # ── Address ───────────────────────────────────────────────────
    purok_sitio = models.CharField("Purok / Sitio", max_length=100)
    address = models.TextField(
        "Complete Address",
        help_text="House No., Street, Barangay Cogon-Pardo, City",
    )

    # ── Contact ───────────────────────────────────────────────────
    contact_number = models.CharField(max_length=20)
    email = models.EmailField(blank=True)

    # ── Photo & Verification ─────────────────────────────────────
    photo = models.ImageField(
        upload_to="residents/photos/%Y/%m/",
        blank=True,
        null=True,
    )
    verification_status = models.CharField(
        max_length=20,
        choices=VerificationStatus.choices,
        default=VerificationStatus.PENDING,
    )
    verified_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="verified_residents",
    )
    verified_at = models.DateTimeField(null=True, blank=True)

    # ── Timestamps ────────────────────────────────────────────────
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["last_name", "first_name"]
        verbose_name = "resident"
        verbose_name_plural = "residents"

    def __str__(self):
        return self.full_name

    @property
    def full_name(self):
        parts = [self.first_name, self.middle_name, self.last_name, self.suffix]
        return " ".join(p for p in parts if p)
