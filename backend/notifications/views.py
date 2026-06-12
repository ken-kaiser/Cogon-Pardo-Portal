from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Notification
from .serializers import NotificationSerializer


class NotificationListView(generics.ListAPIView):
    """List notifications for the authenticated user."""

    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(recipient=self.request.user)


class NotificationMarkReadView(APIView):
    """Mark a single notification as read."""

    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, id):
        try:
            notification = Notification.objects.get(
                id=id, recipient=request.user
            )
        except Notification.DoesNotExist:
            return Response(
                {"detail": "Notification not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        notification.is_read = True
        notification.status = Notification.Status.READ
        notification.save(update_fields=["is_read", "status"])
        return Response(NotificationSerializer(notification).data)


class NotificationMarkAllReadView(APIView):
    """Mark all notifications as read for the authenticated user."""

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        count = Notification.objects.filter(
            recipient=request.user, is_read=False
        ).update(is_read=True, status=Notification.Status.READ)
        return Response({"marked_read": count})
