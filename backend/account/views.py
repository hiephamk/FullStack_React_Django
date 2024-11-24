from django.http import Http404, JsonResponse
from rest_framework.response import Response
from rest_framework import permissions, viewsets
from rest_framework import generics
from rest_framework.authentication import TokenAuthentication, SessionAuthentication

from .models import Account
from .serializers import AccountSerializer

class AccountViewSet(generics.ListCreateAPIView):
    queryset = Account.objects.all()
    serializer_class = AccountSerializer
    permission_classes = [permissions.IsAuthenticated]
class AccountDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Account.objects.all()
    serializer_class = AccountSerializer
    permission_classes = [permissions.IsAuthenticated]
class UserProfileUpdateView(generics.UpdateAPIView):
    queryset = Account.objects.all()
    serializer_class = AccountSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user.account

class UserProfileView(generics.RetrieveAPIView):
    queryset = Account.objects.all()
    serializer_class = AccountSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return self.queryset

    def get_object(self):
        # Fetch user profile based on the passed identifier
        lookup_field = self.kwargs.get('lookup_field', 'id')
        lookup_value = self.kwargs.get('lookup_value')
        filter_kwargs = {lookup_field: lookup_value}
        try:
            account = self.queryset.get(**filter_kwargs)
            return account
        except Account.DoesNotExist:
            raise Http404("Account not found")




