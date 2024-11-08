# forum/serializers.py
from rest_framework import serializers
from .models import *

class CommentSerializer(serializers.ModelSerializer):
    author_username = serializers.CharField(source='author.username', read_only=True)
    class Meta:
        model = Comment
        fields = ['id', 'text','author_username', 'post', 'author']

class PostSerializer(serializers.ModelSerializer):
    author_username = serializers.CharField(source='author.username', read_only=True)
    class Meta:
        model = Post
        fields = fields = ['id', 'title', 'content', 'author_username', 'author'] 
        read_only_fields = ['author']# Including 'author'
