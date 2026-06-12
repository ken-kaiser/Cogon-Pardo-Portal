from django.db.models.signals import post_save
from django.dispatch import receiver

from requests.models import CertificateRequest
from .models import Notification
from .tasks import send_email_notification


# ── Status change notifications ──────────────────────────────────
STATUS_MESSAGES = {
    "under_review": "Your request {req_id} is now under review.",
    "for_verification": "Your request {req_id} is being verified.",
    "approved": "Great news! Your request {req_id} has been approved.",
    "rejected": "Your request {req_id} has been rejected. Reason: {reason}",
    "ready_printing": "Your certificate for request {req_id} is being printed.",
    "ready_pickup": "Your certificate for request {req_id} is ready for pickup!",
    "completed": "Your request {req_id} has been completed. Thank you!",
}


@receiver(post_save, sender=CertificateRequest)
def notify_on_status_change(sender, instance, created, **kwargs):
    """Create notification when a certificate request status changes."""
    if created:
        # Notify staff about new request
        Notification.objects.create(
            recipient=instance.requested_by,
            title="Request Submitted",
            message=f"Your request {instance.request_id} for "
            f"{instance.get_certificate_type_display()} has been submitted.",
            channel=Notification.Channel.IN_APP,
            related_request=instance,
            status=Notification.Status.SENT,
        )
        return

    # Status change notification
    msg_template = STATUS_MESSAGES.get(instance.status)
    if msg_template and instance.requested_by:
        message = msg_template.format(
            req_id=instance.request_id,
            reason=instance.rejection_reason or "N/A",
        )
        notification = Notification.objects.create(
            recipient=instance.requested_by,
            title=f"Request {instance.request_id} – {instance.get_status_display()}",
            message=message,
            channel=Notification.Channel.IN_APP,
            related_request=instance,
            status=Notification.Status.SENT,
        )

        # Queue email notification via Celery (non-blocking)
        try:
            send_email_notification.delay(str(notification.id))
        except Exception:
            # Celery not running — notification saved in-app, email skipped
            pass
