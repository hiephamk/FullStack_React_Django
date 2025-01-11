from rest_framework import serializers
from .models import Channel, ChannelPost, ChannelTopic, ChannelComment, Membership, Notification, ChannelLike


class ChannelSerializer(serializers.ModelSerializer):
    owner_name = serializers.SerializerMethodField()
    class Meta:
        model = Channel
        fields = '__all__'
    def get_owner_name(self, obj):
        return f"{obj.owner.get_full_name}"
class ChannelTopicSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChannelTopic
        fields = '__all__'
class ChannelPostSerializer(serializers.ModelSerializer):
    author_name = serializers.SerializerMethodField()
    profile = serializers.SerializerMethodField()
    author_profile_img = serializers.SerializerMethodField()
    class Meta:
        model = ChannelPost
        fields = '__all__'
    def get_author_name(self, obj):
        return f"{obj.owner.get_full_name}" if obj.owner else None
    def get_profile(self,obj):
        if obj.owner.account and obj.owner.account.profile:
            return obj.owner.account.profile
        return None
    def get_author_profile_img(self, obj):
        if obj.owner.account and obj.owner.account.profile_img:
            return obj.owner.account.profile_img.url
        return None
class ChannelCommentSerializer(serializers.ModelSerializer):
    author_name = serializers.SerializerMethodField()
    profile = serializers.SerializerMethodField()
    author_profile_img = serializers.SerializerMethodField()

    class Meta:
        model = ChannelComment
        fields = '__all__'

    def get_author_name(self, obj):
        return f"{obj.owner.get_full_name}" if obj.owner else None

    def get_profile(self, obj):
        if obj.owner.account and obj.owner.account.profile:
            return obj.owner.account.profile
        return None

    def get_author_profile_img(self, obj):
        if obj.owner.account and obj.owner.account.profile_img:
            return obj.owner.account.profile_img.url
        return None

class MembershipSerializer(serializers.ModelSerializer):
    member_name = serializers.SerializerMethodField()
    class Meta:
        model = Membership
        fields = '__all__'
    def get_member_name(self, obj):
        return f"{obj.user.get_full_name}"
class NotificationSerializer(serializers.ModelSerializer):
    member_name = serializers.SerializerMethodField()
    class Meta:
        model = Notification
        fields = '__all__'
    def get_member_name(self, obj):
        return f"{obj.membership.get_member_name}"
class ChannelLikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChannelLike
        fields = '__all__'