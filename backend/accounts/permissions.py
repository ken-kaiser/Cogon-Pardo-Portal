from rest_framework.permissions import BasePermission


class IsAdmin(BasePermission):
    """Allow access only to Admin users."""

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role == "admin"
        )


class IsStaffUser(BasePermission):
    """Allow access to Admin and Staff users."""

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role in ("admin", "staff")
        )


class IsOnlyStaff(BasePermission):
    """Allow access strictly to Staff users."""

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role == "staff"
        )


class IsResident(BasePermission):
    """Allow access only to Resident users."""

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role == "resident"
        )


class IsOwnerOrStaff(BasePermission):
    """
    Object-level permission:
    - Staff/Admin can access any object.
    - Residents can only access their own objects.
    """

    def has_object_permission(self, request, view, obj):
        if request.user.role in ("admin", "staff"):
            return True
        # Check common ownership patterns
        if hasattr(obj, "user"):
            return obj.user == request.user
        if hasattr(obj, "requested_by"):
            return obj.requested_by == request.user
        if hasattr(obj, "resident") and hasattr(request.user, "resident_profile"):
            return obj.resident == request.user.resident_profile
        return False
