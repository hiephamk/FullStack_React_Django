from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from .models import Feedback
from .serializers import FeedbackSerializer


# Create your views here.
class FeedbackView(generics.ListCreateAPIView):
    queryset = Feedback.objects.all()
    serializer_class = FeedbackSerializer
    permission_classes = [IsAuthenticated]