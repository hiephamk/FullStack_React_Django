from django.http import Http404, JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import permissions, viewsets, status
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



@api_view(['POST', 'PUT'])
def account_create_or_update(request):
    if request.method == 'POST':
        # Create new account for the authenticated user
        user = request.user
        if Account.objects.filter(user=user).exists():
            return Response({'detail': 'Account already exists.'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = AccountSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'PUT':
        # Update existing account for the authenticated user
        account = Account.objects.get(user=request.user)
        serializer = AccountSerializer(account, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
