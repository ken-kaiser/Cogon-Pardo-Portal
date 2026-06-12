from django.apps import AppConfig


class RequestsConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "requests"
    label = "certificate_requests"  # avoid conflict with Python's 'requests' module
