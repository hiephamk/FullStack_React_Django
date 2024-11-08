# forum/views.py
from rest_framework import viewsets, permissions
from .models import *
from .serializers import *
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.authentication import SessionAuthentication, BasicAuthentication



class PostViewSet(viewsets.ModelViewSet):
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    permission_classes = [permissions.AllowAny]
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    
    def list(self, request):
        'user': str(request.user),
        queryset = self.queryset
        serializers = self.serializer_class(queryset, many=True)
        return Response(serializers.data)

    def create(self, request):
        serializers = self.serializer_class(data=request.data)
        if serializers.is_valid():
            serializers.save()
            return Response(serializers.data)
        else:
            return Response(serializers.errors, status=400)

    def retrieve(self, request, pk=None):
        post = self.queryset.get(pk=pk)
        serializers = self.serializer_class(post)
        return Response(serializers.data)

    def update(self, request, pk=None):
        post = self.queryset.get(pk=pk)
        serializers = self.serializer_class(post, data=request.data)
        if serializers.is_valid():
            serializers.save()
            return Response(serializers.data)
        else:
            return Response(serializers.errors, status=400)


    def destroy(self, request, pk=None):
        post = self.queryset.get(pk=pk)
        post.delete()
        return Response(status = 204)

class CommentViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.AllowAny]  
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    
    def list(self, request):
        queryset = self.queryset
        serializers = self.serializer_class(queryset, many=True)
        return Response(serializers.data)

    def create(self, request):
        serializers = self.serializer_class(data=request.data)
        if serializers.is_valid():
            serializers.save()
            return Response(serializers.data)
        else:
            return Response(serializers.errors, status=400)

    def retrieve(self, request, pk=None):
        comment = self.queryset.get(pk=pk)
        serializers = self.serializer_class(comment)
        return Response(serializers.data)

    def update(self, request, pk=None):
        comment = self.queryset.get(pk=pk)
        serializers = self.serializer_class(comment, data=request.data)
        if serializers.is_valid():
            serializers.save()
            return Response(serializers.data)
        else:
            return Response(serializers.errors, status=400)


    def destroy(self, request, pk=None):
        comment = self.queryset.get(pk=pk)
        comment.delete()
        return Response(status = 204)
