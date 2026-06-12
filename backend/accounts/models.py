import uuid
from django.contrib.auth.models import AbstractUser
from django.db import models

from .managers import CustomUserManager


class User(AbstractUser):
    """
    Custom User model extending AbstractUser.
    Uses email as the primary login identifier.
    Role field drives RBAC across the platform.
    """

    class Role(models.TextChoices):
        ADMIN = "admin", "Admin"
        STAFF = "staff", "Staff"
        RESIDENT = "resident", "Resident"

    # Remove username field; use email instead
    username = None
    email = models.EmailField("email address", unique=True)

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.RESIDENT,
    )
    phone_number = models.CharField(max_length=20, blank=True)
    is_verified = models.BooleanField(default=False)
    otp_code = models.CharField(max_length=6, blank=True)
    otp_created_at = models.DateTimeField(null=True, blank=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["first_name", "last_name"]

    objects = CustomUserManager()

    class Meta:
        verbose_name = "user"
        verbose_name_plural = "users"
        ordering = ["-date_joined"]

    def __str__(self):
        return f"{self.get_full_name()} ({self.email})"

    @property
    def is_admin(self):
        return self.role == self.Role.ADMIN

    @property
    def is_staff_user(self):
        return self.role in (self.Role.ADMIN, self.Role.STAFF)

    @property
    def is_resident(self):
        return self.role == self.Role.RESIDENT
