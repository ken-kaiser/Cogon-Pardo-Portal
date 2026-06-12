from django.urls import path
from . import views

app_name = "residents"

urlpatterns = [
    path("", views.ResidentListView.as_view(), name="resident-list"),
    path("create/", views.ResidentCreateView.as_view(), name="resident-create"),
    path("<uuid:id>/", views.ResidentDetailView.as_view(), name="resident-detail"),
    path("<uuid:id>/verify/", views.ResidentVerifyView.as_view(), name="resident-verify"),
]
