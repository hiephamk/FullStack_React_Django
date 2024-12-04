# from rest_framework import serializers
# from .models import Account
# from django.conf import settings
#
# class AccountSerializer(serializers.ModelSerializer):
#     full_name = serializers.CharField(source='user.get_full_name', read_only=True)
#     email = serializers.EmailField(source='user.email', read_only=True)
#     class Meta:
#         model = Account
#         fields = ['id', 'full_name','email','birth_date','profile_img','aboutMe','created_at','updated_at']
#  # Add fields you want to update
#
#     def update(self, instance, validated_data):
#         # Handle the profile image update
#         profile_img = validated_data.get('profile_img', None)
#         if profile_img:
#             instance.profile_img = profile_img
#
#         # Update other fields
#         instance.aboutMe = validated_data.get('aboutMe', instance.aboutMe)
#         instance.save()
#         return instance

from rest_framework import serializers
from .models import Account


class AccountSerializer(serializers.ModelSerializer):
    profile_img = serializers.ImageField(required=False)
    birth_date = serializers.DateField(required=False)
    full_name = serializers.CharField(source='user.get_full_name', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    class Meta:
        model = Account
        fields = ['id','user','full_name', 'email', 'birth_date', 'profile_img', 'aboutMe', 'created_at', 'updated_at','phoneNumber']

    def create(self, validated_data):
        # Creating a new account for the user
        validated_data['user'] = self.context['request'].user  # Set current authenticated user
        return super().create(validated_data)

    def update(self, instance, validated_data):
        # Updating an existing account for the user
        instance.phoneNumber = validated_data.get('phoneNumber', instance.phoneNumber)
        if 'birth_date' in validated_data:
            instance.birth_date = validated_data['birth_date']
        instance.aboutMe = validated_data.get('aboutMe', instance.aboutMe)

        profile_img = validated_data.get('profile_img', None)
        if profile_img:
            instance.profile_img = profile_img
        instance.save()
        return instance

