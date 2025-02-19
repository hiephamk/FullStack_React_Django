from rest_framework import generics
from rest_framework.generics import get_object_or_404
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication

from .serializers import PublicZoneSerializer
from .models import Publiczone


# Create your views here.
class PublicZoneView(generics.ListCreateAPIView):
    serializer_class = PublicZoneSerializer
    queryset = Publiczone.objects.all()
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticatedOrReadOnly]


class PublicZoneDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PublicZoneSerializer
    queryset = Publiczone.objects.all()
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticatedOrReadOnly]

    def update(self, request, pk=None):
        content = get_object_or_404(Publiczone, pk=pk)
        user = request.user
        if content.content_owner == request.user:
            serializer = self.get_serializer(content, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)


