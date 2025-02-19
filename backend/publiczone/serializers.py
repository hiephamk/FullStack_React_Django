from rest_framework import serializers
from .models import Publiczone

class PublicZoneSerializer(serializers.ModelSerializer):
    owner_name = serializers.SerializerMethodField()
    owner_profile_img = serializers.ReadOnlyField()
    profile = serializers.SerializerMethodField()
    class Meta:
        model = Publiczone
        fields = '__all__'
    def get_owner_name(self, obj):
        if obj.content_owner:
            return f"{obj.content_owner.get_full_name}" or "Anonymous"
        return "Anonymous"

    def get_owner_profile_img(self, obj):
        if obj.content_owner.account and obj.content_owner.account.profile_img:
            return obj.author.account.profile_img.url  # Get the image URL
        return "Anonymous"

    def get_profile(self, obj):
        if obj.content_owner.account and obj.content_owner.account.profile:
            return obj.content_owner.account.profile  # Get the userId
        return None