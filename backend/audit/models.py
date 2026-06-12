import uuid
from django.conf import settings
from django.db import models


class AuditLog(models.Model):
    """
    Simple audit log capturing all significant actions in the system.
    Triggered via Django signals on model save/delete events.
    """

    class Action(models.TextChoices):
        CREATE = "create", "Create"
        UPDATE = "update", "Update"
        DELETE = "delete", "Delete"
        STATUS_CHANGE = "status_change", "Status Change"
        LOGIN = "login", "Login"
        LOGOUT = "logout", "Logout"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="audit_logs",
    )
    action = models.CharField(max_length=20, choices=Action.choices)
    model_name = models.CharField(max_length=100)
    object_id = models.CharField(max_length=255, blank=True)
    object_repr = models.CharField(max_length=255, blank=True)
    changes = models.JSONField(default=dict, blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-timestamp"]
        verbose_name = "audit log"
        verbose_name_plural = "audit logs"

    def __str__(self):
        return f"[{self.timestamp:%Y-%m-%d %H:%M}] {self.user} → {self.action} {self.model_name}"
