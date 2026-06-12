from django.urls import path
from . import views

app_name = "certificates"

urlpatterns = [
    # ── Templates ─────────────────────────────────────────────────
    path("templates/", views.TemplateListView.as_view(), name="template-list"),
    path("templates/<uuid:id>/", views.TemplateDetailView.as_view(), name="template-detail"),
    # ── Preview & Generate ────────────────────────────────────────
    path("preview/<uuid:request_id>/", views.CertificatePreviewView.as_view(), name="certificate-preview"),
    path("generate/<uuid:request_id>/", views.CertificateGenerateView.as_view(), name="certificate-generate"),
    # ── Generated List ────────────────────────────────────────────
    path("generated/", views.GeneratedCertificateListView.as_view(), name="generated-list"),
]
