from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from . import views

urlpatterns = [
    path('topics/', views.TopicListCreateView.as_view(), name='topic-list-create'),
    path('topics/<int:pk>', views.TopicDetailView.as_view(), name='topic-detail'),

    path('subtopics/', views.SubTopicListCreateView.as_view(), name='subtopic-list-create'),
    path('subtopics/<int:pk>', views.SubTopicDetailView.as_view(), name='subtopic-detail'),

    path('posts/', views.PostListCreateView.as_view(), name='post-list-create'),
    path('posts/<int:pk>', views.PostDetailView.as_view(), name='post-detail'),
    path('posts/<int:post_id>/like/', views.like_post, name='post-like'),

    path('comments/', views.CommentListCreateView.as_view(), name='comment-list-create'),
    path('comments/<int:pk>/', views.CommentDetailView.as_view(), name='comment-detail'),
]
