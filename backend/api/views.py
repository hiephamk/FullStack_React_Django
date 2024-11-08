# forum/views.py
from rest_framework import viewsets, permissions
from .models import *
from .serializers import *
from rest_framework.response import Response

class NewsViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.AllowAny]  
    queryset = News.objects.all()
    serializer_class = NewsSerializer
    
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

