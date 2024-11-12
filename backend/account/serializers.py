from rest_framework import serializers
from .models import Account
from django.conf import settings

class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = '__all__'