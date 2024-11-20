from requests import Response
from rest_framework import permissions, viewsets
from rest_framework import generics
from rest_framework.authentication import TokenAuthentication, SessionAuthentication

from .models import Account
from .serializers import AccountSerializer

class AccountViewSet(generics.ListCreateAPIView):
    queryset = Account.objects.all()
    serializer_class = AccountSerializer
    permission_classes = [permissions.IsAuthenticated]


