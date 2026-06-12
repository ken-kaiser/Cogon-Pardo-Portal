import uuid
from django.conf import settings
from django.db import models


class Applicant(models.Model):
    """
    Staff Hiring Application tracking pipeline.
    Captures multi-step background checks and educational profiles.
    """

    class ApplicationStatus(models.TextChoices):
        PENDING = "pending", "Pending"
        INTERVIEW = "interview_scheduled", "Interview Scheduled"
        APPROVED = "approved", "Approved"
        REJECTED = "rejected", "Rejected"
        HIRED = "hired", "Hired"

    class EducationLevel(models.TextChoices):
        HIGH_SCHOOL = "high_school", "High School Graduate"
        COLLEGE_UNDERGRAD = "college_undergrad", "College Undergraduate"
        COLLEGE_GRADUATE = "college_graduate", "College Graduate"
        POST_GRADUATE = "post_graduate", "Post-Graduate"
        VOCATIONAL = "vocational", "Vocational Course"

    class SitioChoices(models.TextChoices):
        ALL_SEASON_1 = "All Season 1", "All Season 1"
        ALL_SEASON_2 = "All Season 2", "All Season 2"
        ALL_SEASON_3 = "All Season 3", "All Season 3"
        CAIMITO = "Caimito", "Caimito"
        ELMA = "Elma", "Elma"
        LAGUNA_1 = "Laguna 1", "Laguna 1"
        LAGUNA_2 = "Laguna 2", "Laguna 2"
        LITTLE_HAWAII = "Little Hawaii", "Little Hawaii"
        LOURDES_EXTENSION = "Lourdes Extension", "Lourdes Extension"
        LOURDES_PROPER = "Lourdes Proper", "Lourdes Proper"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="staff_application",
    )

    # ── Personal Information ──────────────────────────────────────
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField()
    phone_number = models.CharField(max_length=20)
    sitio = models.CharField(
        max_length=100,
        choices=SitioChoices.choices,
        default=SitioChoices.LOURDES_PROPER,
    )

    # ── Educational Background ────────────────────────────────────
    highest_education = models.CharField(
        max_length=50,
        choices=EducationLevel.choices,
        default=EducationLevel.COLLEGE_GRADUATE,
    )
    school_institution = models.CharField(max_length=200)
    year_graduated = models.IntegerField()

    # ── Background Check Details ──────────────────────────────────
    has_criminal_record = models.BooleanField(default=False)
    background_details = models.TextField(blank=True, default="")

    # ── pipeline status & consent ──────────────────────────────────
    status = models.CharField(
        max_length=30,
        choices=ApplicationStatus.choices,
        default=ApplicationStatus.PENDING,
    )
    consent_checkbox = models.BooleanField(default=False)

    # ── Audit Timestamps ──────────────────────────────────────────
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "applicant"
        verbose_name_plural = "applicants"
        indexes = [
            models.Index(fields=["status"], name="applicant_status_idx"),
            models.Index(fields=["email"], name="applicant_email_idx"),
            models.Index(fields=["last_name", "first_name"], name="applicant_name_idx"),
            models.Index(fields=["-created_at"], name="applicant_created_idx"),
        ]

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.status})"


class ApplicantDocument(models.Model):
    """
    Supporting applicant documentation uploads: resumes, clearances, government IDs.
    """

    class DocumentType(models.TextChoices):
        RESUME = "resume", "Resume / CV"
        NBI_CLEARANCE = "nbi_clearance", "NBI Clearance"
        POLICE_CLEARANCE = "police_clearance", "Police Clearance"
        GOVERNMENT_ID = "government_id", "Government ID"
        OTHER = "other", "Other Document"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    applicant = models.ForeignKey(
        Applicant,
        on_delete=models.CASCADE,
        related_name="documents",
    )
    document_type = models.CharField(
        max_length=30,
        choices=DocumentType.choices,
        default=DocumentType.RESUME,
    )
    file = models.FileField(upload_to="applicants/documents/%Y/%m/")
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-uploaded_at"]
        verbose_name = "applicant document"
        verbose_name_plural = "applicant documents"
        indexes = [
            models.Index(fields=["applicant", "document_type"], name="doc_applicant_type_idx"),
        ]
        constraints = [
            models.UniqueConstraint(
                fields=["applicant", "document_type"],
                name="unique_applicant_document_type"
            )
        ]

    def __str__(self):
        return f"{self.applicant.last_name} - {self.get_document_type_display()}"
