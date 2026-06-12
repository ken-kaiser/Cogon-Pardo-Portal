from django.urls import path
from . import views

app_name = "requests"

urlpatterns = [
    path("", views.RequestListView.as_view(), name="request-list"),
    path("create/", views.RequestCreateView.as_view(), name="request-create"),
    path("<uuid:id>/", views.RequestDetailView.as_view(), name="request-detail"),
    path("<uuid:id>/update/", views.RequestUpdateView.as_view(), name="request-update"),
    path("<uuid:id>/qr/", views.RequestQRCodeView.as_view(), name="request-qr"),
    path("verify/<str:qr_token>/", views.VerifyQRTokenView.as_view(), name="verify-qr"),
]
