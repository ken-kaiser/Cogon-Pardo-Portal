try:
    from celery import shared_task
except ImportError:
    # Celery not installed — create a no-op decorator
    def shared_task(*args, **kwargs):
        def decorator(func):
            func.delay = lambda *a, **kw: None
            return func
        if args and callable(args[0]):
            return decorator(args[0])
        return decorator

from django.core.mail import send_mail
from django.conf import settings


@shared_task(bind=True, max_retries=3)
def send_email_notification(self, notification_id):
    """Send an email notification. Retries up to 3 times on failure."""
    from .models import Notification  # avoid circular import

    try:
        notification = Notification.objects.select_related("recipient").get(
            id=notification_id
        )
    except Notification.DoesNotExist:
        return

    try:
        send_mail(
            subject=notification.title,
            message=notification.message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[notification.recipient.email],
            fail_silently=False,
        )
        notification.status = Notification.Status.SENT
        notification.save(update_fields=["status"])
    except Exception as exc:
        notification.status = Notification.Status.FAILED
        notification.save(update_fields=["status"])
        if hasattr(self, "retry"):
            raise self.retry(exc=exc, countdown=60)


@shared_task
def send_otp_email(user_id, otp_code):
    """Send OTP verification email."""
    from django.contrib.auth import get_user_model

    User = get_user_model()
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return

    send_mail(
        subject="Your OTP Verification Code – Cogon-Pardo Portal",
        message=f"Your OTP code is: {otp_code}\n\nThis code expires in 5 minutes.",
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user.email],
        fail_silently=False,
    )


@shared_task
def send_sms_notification(phone_number, message):
    """
    Placeholder for SMS via Twilio or gateway.
    TODO: Integrate Twilio client when ready.
    """
    pass
