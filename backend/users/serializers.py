from django.contrib.auth import get_user_model
from djoser.serializers import UserCreateSerializer
from rest_framework import serializers


User = get_user_model()

class CreateUserSerializer(UserCreateSerializer):
    image = serializers.ImageField(required=False)

    class Meta(UserCreateSerializer.Meta):
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'password', 'image']