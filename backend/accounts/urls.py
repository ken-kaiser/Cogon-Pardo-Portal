from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from . import views

app_name = "accounts"

urlpatterns = [
    # ── Auth ──────────────────────────────────────────────────────
    path("login/", views.CustomTokenObtainPairView.as_view(), name="login"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token-refresh"),
    path("register/", views.RegisterView.as_view(), name="register"),
    # ── Profile ───────────────────────────────────────────────────
    path("profile/", views.ProfileView.as_view(), name="profile"),
    path("verify-password/", views.VerifyPasswordView.as_view(), name="verify-password"),
    # ── Admin: User Management ────────────────────────────────────
    path("users/", views.UserListView.as_view(), name="user-list"),
    path("users/<uuid:id>/", views.UserDetailView.as_view(), name="user-detail"),
]
