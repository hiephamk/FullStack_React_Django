from django.shortcuts import render
from rest_framework import generics, permissions

from backend.users.serializers import UserSerializer, User


# Create your views here.
class UserViewSet(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]