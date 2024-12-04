
from rest_framework import serializers
from .models import Post, Comment, Like, Topic, SubTopic, Membership, Notification
from django.contrib.auth import get_user_model
from django.conf import settings

User = get_user_model()
class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'

class MembershipSerializer(serializers.ModelSerializer):
    topic_name = serializers.SerializerMethodField()
    class Meta:
        model = Membership
        fields = ['id', 'user', 'topic', 'status', 'topic_name']
    def get_topic_name(self, obj):
        return f"{obj.topic.topicTitle}" if obj.topic else None

class TopicSerializer(serializers.ModelSerializer):
    author_name = serializers.SerializerMethodField()
    class Meta:
        model = Topic
        fields = ['id', 'topicTitle','topicDescription','author_name', 'status', 'author', 'created_at', 'updated_at']
    def get_author_name(self, obj):
        return f"{obj.author.first_name} {obj.author.last_name}" if obj.author else None

class SubTopicSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubTopic
        fields = '__all__'
    def get_author_name(self, obj):
        return f"{obj.author.first_name} {obj.author.last_name}" if obj.author else None

class CommentSerializer(serializers.ModelSerializer):
    author_profile_img = serializers.ReadOnlyField()
    author_name = serializers.SerializerMethodField()
    accountId = serializers.SerializerMethodField()
    profile = serializers.SerializerMethodField()
    class Meta:
        model = Comment
        fields = ['id', 'text', 'author','profile', 'post','file','created_at', 'author_name','accountId','author_profile_img', 'like_count']

    def get_author_name(self, obj):
        return f"{obj.author.first_name} {obj.author.last_name}" if obj.author else None

    def get_author_profile_img(self, obj):
        if obj.author.account and obj.author.account.profile_img:
            return obj.author.account.profile_img.url  # Get the image URL
        return None
    def get_accountId(self, obj):
        if obj.author.account and obj.author.account.id:
            return obj.author.account.id  # Get the userId
        return None
    def get_profile(self, obj):
        if obj.author.account and obj.author.account.profile:
            return obj.author.account.profile  # Get the userId
        return None

    def get_author_lookup_key(self, obj):
        return obj.author.account.lookup_key

class PostSerializer(serializers.ModelSerializer):
    author_profile_img = serializers.ReadOnlyField()
    author_name = serializers.SerializerMethodField()
    profile = serializers.SerializerMethodField()
    class Meta:
        model = Post
        fields = ['id','title','content','subtopic','file','author', 'created_at', 'author_name','author_profile_img','like_count','profile']

    def get_author_name(self, obj):
        return f"{obj.author.first_name} {obj.author.last_name}" if obj.author else None

    def get_author_profile_img(self, obj):
        if obj.author.account and obj.author.account.profile_img:
            return obj.author.account.profile_img.url  # Get the image URL
        return None

    def get_profile(self, obj):
        if obj.author.account and obj.author.account.profile:
            return obj.author.account.profile  # Get the userId
        return None
class LikeSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset=get_user_model().objects.all())
    post = serializers.PrimaryKeyRelatedField(queryset=Post.objects.all())

    class Meta:
        model = Like
        fields = ['user', 'post', 'created_at']