from django.contrib import admin
from .models import Notification


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ("title", "recipient", "channel", "status", "is_read", "created_at")
    list_filter = ("channel", "status", "is_read", "created_at")
    search_fields = ("title", "recipient__email", "message")
    readonly_fields = ("id", "created_at")
    ordering = ("-created_at",)
