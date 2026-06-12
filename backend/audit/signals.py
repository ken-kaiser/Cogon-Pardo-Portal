from django.contrib.auth.signals import user_logged_in, user_logged_out
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver

from requests.models import CertificateRequest
from residents.models import Resident
from .models import AuditLog


def _get_client_ip(request):
    """Extract client IP from request if available."""
    if request is None:
        return None
    x_forwarded = request.META.get("HTTP_X_FORWARDED_FOR")
    if x_forwarded:
        return x_forwarded.split(",")[0].strip()
    return request.META.get("REMOTE_ADDR")


# ── Login / Logout ────────────────────────────────────────────────
@receiver(user_logged_in)
def audit_login(sender, request, user, **kwargs):
    AuditLog.objects.create(
        user=user,
        action=AuditLog.Action.LOGIN,
        model_name="User",
        object_id=str(user.pk),
        object_repr=str(user),
        ip_address=_get_client_ip(request),
    )


@receiver(user_logged_out)
def audit_logout(sender, request, user, **kwargs):
    if user:
        AuditLog.objects.create(
            user=user,
            action=AuditLog.Action.LOGOUT,
            model_name="User",
            object_id=str(user.pk),
            object_repr=str(user),
            ip_address=_get_client_ip(request),
        )


# ── Certificate Requests ─────────────────────────────────────────
@receiver(post_save, sender=CertificateRequest)
def audit_request_save(sender, instance, created, **kwargs):
    AuditLog.objects.create(
        user=instance.requested_by,
        action=AuditLog.Action.CREATE if created else AuditLog.Action.UPDATE,
        model_name="CertificateRequest",
        object_id=str(instance.pk),
        object_repr=str(instance),
        changes={"status": instance.status} if not created else {},
    )


@receiver(post_delete, sender=CertificateRequest)
def audit_request_delete(sender, instance, **kwargs):
    AuditLog.objects.create(
        user=instance.requested_by,
        action=AuditLog.Action.DELETE,
        model_name="CertificateRequest",
        object_id=str(instance.pk),
        object_repr=str(instance),
    )


# ── Residents ─────────────────────────────────────────────────────
@receiver(post_save, sender=Resident)
def audit_resident_save(sender, instance, created, **kwargs):
    AuditLog.objects.create(
        user=instance.user,
        action=AuditLog.Action.CREATE if created else AuditLog.Action.UPDATE,
        model_name="Resident",
        object_id=str(instance.pk),
        object_repr=str(instance),
        changes=(
            {"verification_status": instance.verification_status}
            if not created
            else {}
        ),
    )
