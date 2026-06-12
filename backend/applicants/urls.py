from django.urls import path
from .views import (
    ApplicantCreateView,
    MyApplicantStatusView,
    DocumentUploadView,
    AdminApplicantListView,
    AdminApplicantDetailView,
)

urlpatterns = [
    # Citizen endpoints
    path("apply/", ApplicantCreateView.as_view(), name="applicant-apply"),
    path("status/", MyApplicantStatusView.as_view(), name="applicant-status"),
    path("upload-document/", DocumentUploadView.as_view(), name="applicant-upload-document"),

    # Admin/Staff endpoints
    path("list/", AdminApplicantListView.as_view(), name="admin-applicant-list"),
    path("<uuid:id>/", AdminApplicantDetailView.as_view(), name="admin-applicant-detail"),
]
