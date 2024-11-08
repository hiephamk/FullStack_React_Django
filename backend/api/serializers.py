# api/serializers.py
from rest_framework import serializers
from .models import *

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = News
        fields = ['id','title' 'content']

class NewsSerializer(serializers.ModelSerializer):
    class Meta:
        model = News
        fields = fields = ['id', 'title', 'content']  # Including 'author'