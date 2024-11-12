
from rest_framework import serializers
from .models import Post, Comment
from django.contrib.auth import get_user_model
from django.conf import settings

User = get_user_model()


class CommentSerializer(serializers.ModelSerializer):
    author_profile_img = serializers.ReadOnlyField()
    author_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Comment
        fields = ['id', 'text', 'author', 'post','created_at', 'author_name', 'author_profile_img']

    def get_author_name(self, obj):
        return f"{obj.author.first_name} {obj.author.last_name}" if obj.author else None

    def get_author_profile_img(self, obj):
        if obj.author.account and obj.author.account.profile_img:
            return obj.author.account.profile_img.url  # Get the image URL
        return None

class PostSerializer(serializers.ModelSerializer):
    author_profile_img = serializers.ReadOnlyField()
    author_name = serializers.SerializerMethodField()
    class Meta:
        model = Post
        fields = ['id', 'content', 'author', 'created_at', 'author_name','author_profile_img']

    def get_author_name(self, obj):
        return f"{obj.author.first_name} {obj.author.last_name}" if obj.author else None

    def get_author_profile_img(self, obj):
        if obj.author.account and obj.author.account.profile_img:
            return obj.author.account.profile_img.url  # Get the image URL
        return None