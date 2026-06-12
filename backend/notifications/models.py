import uuid
from django.conf import settings
from django.db import models


class Notification(models.Model):
    """
    In-app notification model.
    Also tracks email/SMS delivery status.
    """

    class Channel(models.TextChoices):
        IN_APP = "in_app", "In-App"
        EMAIL = "email", "Email"
        SMS = "sms", "SMS"

    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        SENT = "sent", "Sent"
        FAILED = "failed", "Failed"
        READ = "read", "Read"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    recipient = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="notifications",
    )
    title = models.CharField(max_length=255)
    message = models.TextField()
    channel = models.CharField(
        max_length=10,
        choices=Channel.choices,
        default=Channel.IN_APP,
    )
    status = models.CharField(
        max_length=10,
        choices=Status.choices,
        default=Status.PENDING,
    )
    related_request = models.ForeignKey(
        "certificate_requests.CertificateRequest",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "notification"
        verbose_name_plural = "notifications"

    def __str__(self):
        return f"{self.title} → {self.recipient.email}"
