from django.urls import path
from . import views

app_name = "notifications"

urlpatterns = [
    path("", views.NotificationListView.as_view(), name="notification-list"),
    path("<uuid:id>/read/", views.NotificationMarkReadView.as_view(), name="notification-read"),
    path("read-all/", views.NotificationMarkAllReadView.as_view(), name="notification-read-all"),
]
