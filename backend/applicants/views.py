from rest_framework import generics, permissions, status, parsers
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Applicant, ApplicantDocument
from .serializers import ApplicantSerializer, ApplicantDocumentSerializer


class ApplicantCreateView(generics.CreateAPIView):
    """
    Public endpoint for new staff application submission.
    Binds active authenticated user optional profile details.
    """

    queryset = Applicant.objects.all()
    serializer_class = ApplicantSerializer
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        user = self.request.user if self.request.user.is_authenticated else None
        serializer.save(user=user)


class MyApplicantStatusView(generics.ListAPIView):
    """
    Track active staff applications submitted by the logged-in user.
    """

    serializer_class = ApplicantSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Applicant.objects.filter(user=self.request.user)


class DocumentUploadView(APIView):
    """
    Multipart file upload endpoint to attach resume, clearances, and IDs to applications.
    """

    permission_classes = [permissions.AllowAny]
    parser_classes = [parsers.MultiPartParser, parsers.FormParser]

    def post(self, request, *args, **kwargs):
        applicant_id = request.data.get("applicant_id")
        document_type = request.data.get("document_type", "resume")
        file_obj = request.FILES.get("file")

        if not applicant_id:
            return Response(
                {"error": "applicant_id is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if not file_obj:
            return Response(
                {"error": "file field is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            applicant = Applicant.objects.get(id=applicant_id)
        except Applicant.DoesNotExist:
            return Response(
                {"error": "Applicant profile not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        doc = ApplicantDocument.objects.create(
            applicant=applicant,
            document_type=document_type,
            file=file_obj,
        )
        
        serializer = ApplicantDocumentSerializer(doc, context={"request": request})
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class AdminApplicantListView(generics.ListCreateAPIView):
    """
    Admin-only endpoint to list all applicants or update their progress.
    """

    queryset = Applicant.objects.all()
    serializer_class = ApplicantSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Allow checking all applicants if admin/staff
        if self.request.user.role in ("admin", "staff"):
            return Applicant.objects.all()
        return Applicant.objects.filter(user=self.request.user)


class AdminApplicantDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update, or delete applicant files.
    """

    queryset = Applicant.objects.all()
    serializer_class = ApplicantSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = "id"
