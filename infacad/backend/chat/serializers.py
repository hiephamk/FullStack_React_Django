from rest_framework import serializers
from .models import Chat, Message


class ChatSerializer(serializers.ModelSerializer):
    sender_name = serializers.SerializerMethodField()
    receiver_name = serializers.SerializerMethodField()
    member_name = serializers.SerializerMethodField()
    member_profile_imgs = serializers.SerializerMethodField()
    class Meta:
        model = Chat
        fields = '__all__'
    def get_sender_name(self, obj):
        return f"{obj.sender.first_name} {obj.sender.last_name}" if obj.sender else None
    def get_receiver_name(self, obj):
        return f"{obj.receiver.first_name} {obj.receiver.last_name}" if obj.receiver else None
    def get_member_name(self, obj):
        return ", ".join([f'{member.first_name} {member.last_name}' for member in obj.members.all()])

    def get_member_profile_imgs(self, obj):
        # Collects profile images of all members
        return [
            member.account.profile_img.url
            for member in obj.members.all()
            if hasattr(member, "account") and member.account.profile_img
        ]


class MessageSerializer(serializers.ModelSerializer):
    author_profile_img = serializers.SerializerMethodField()
    sender_name = serializers.SerializerMethodField()
    class Meta:
        model = Message
        fields = '__all__'
    def get_sender_name(self, obj):
        return f"{obj.sender.first_name} {obj.sender.last_name}" if obj.sender else None
    def get_author_profile_img(self, obj):
        if obj.sender.account and obj.sender.account.profile_img:
            return obj.sender.account.profile_img.url  # Get the image URL
        return None
