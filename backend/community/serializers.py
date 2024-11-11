
from rest_framework import serializers
from .models import Post, Comment
from django.contrib.auth import get_user_model
from django.conf import settings

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    # Use a SerializerMethodField to include the full URL for the image
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = User  # Use the dynamically retrieved custom user model
        fields = ['id', 'first_name', 'last_name', 'image_url']

    def get_image_url(self, obj):
        # Check if the user has an image; generate the URL
        if obj.image:
            request = self.context.get('request')
            return request.build_absolute_uri(settings.MEDIA_URL + str(obj.image))
        return None

class CommentSerializer(serializers.ModelSerializer):
    
    author_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Comment
        fields = ['id', 'text', 'author', 'post','created_at', 'author_name']

    def get_author_name(self, obj):
        return f"{obj.author.first_name} {obj.author.last_name}" if obj.author else None

class PostSerializer(serializers.ModelSerializer):

    author_name = serializers.SerializerMethodField()
    class Meta:
        model = Post
        fields = ['id', 'content', 'author', 'created_at', 'author_name']

    def get_author_name(self, obj):
        return f"{obj.author.first_name} {obj.author.last_name}" if obj.author else None