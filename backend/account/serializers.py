from rest_framework import serializers
from .models import Account
from django.conf import settings

class AccountSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(source='user.get_full_name', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    class Meta:
        model = Account
        fields = ['id', 'full_name','email','aboutMe','created_at','updated_at']
 # Add fields you want to update

    def update(self, instance, validated_data):
        # Handle the profile image update
        profile_img = validated_data.get('profile_img', None)
        if profile_img:
            instance.profile_img = profile_img

        # Update other fields
        instance.aboutMe = validated_data.get('aboutMe', instance.aboutMe)
        instance.save()
        return instance