from rest_framework import generics, permissions, status
from django.shortcuts import get_object_or_404
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Post, Comment, Like, Topic, SubTopic
from .serializers import PostSerializer, CommentSerializer, TopicSerializer, SubTopicSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

class TopicListCreateView(generics.ListAPIView):
    serializer_class = TopicSerializer
    queryset = Topic.objects.all()
    authentication_classes = (JWTAuthentication,)
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

class TopicDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TopicSerializer
    queryset = Topic.objects.all()
    authentication_classes = (JWTAuthentication,)
    permission_classes = [permissions.IsAuthenticated]



class SubTopicListCreateView(generics.ListAPIView):
    serializer_class = SubTopicSerializer
    queryset = SubTopic.objects.all()
    authentication_classes = (JWTAuthentication,)
    permission_classes = (permissions.IsAuthenticated,)
    def perform_create(self, serializer):
        serializer.save(author=self.request.user)
class SubTopicDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = SubTopicSerializer
    queryset = SubTopic.objects.all()
    authentication_classes = (JWTAuthentication,)
    permission_classes = [permissions.IsAuthenticated]

class PostListCreateView(generics.ListCreateAPIView):

    serializer_class = PostSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    def get_queryset(self):
        subtopic_id = self.request.query_params.get('subtopic', None)
        if subtopic_id:
            return Post.objects.filter(subtopic_id=subtopic_id)
        return Post.objects.all()


class PostDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]


# Comment Views
class CommentListCreateView(generics.ListCreateAPIView):
    queryset = Comment.objects.all().order_by('-created_at')
    serializer_class = CommentSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class CommentDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]



# Like view
@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def like_post(request, post_id):
    user = request.user  # Ensure this is the authenticated user
    post = get_object_or_404(Post, id=post_id)
    post.like_count += 1
    post.save()
    return Response({'like_count': post.like_count})


