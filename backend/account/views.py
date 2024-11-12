from rest_framework import permissions
from rest_framework import generics

from .models import Account
from .serializers import AccountSerializer

class AccountViewSet(generics.ListCreateAPIView):
    queryset = Account.objects.all()
    serializer_class = AccountSerializer
    permission_classes = [permissions.BasePermission]