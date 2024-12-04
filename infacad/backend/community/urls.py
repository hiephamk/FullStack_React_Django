from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from .views import JoinTopicView, ApproveRequestView, UserJoinedTopicsView, NotificationListView, MembershipCreateView

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
    
    path('topics/<int:topic_id>/join/', JoinTopicView.as_view(), name='join-topic'),
    path('membership/<int:membership_id>/<str:action>/', ApproveRequestView.as_view(), name='membership-action'),
    path('join-topic/<int:topic_id>/', JoinTopicView.as_view(), name='join-topic'),
    path('join-topic/<int:topic_id>/', JoinTopicView.as_view(), name='join-topic'),
    path('notifications/', NotificationListView.as_view(), name='notification-list-create'),
    path('membership/', MembershipCreateView.as_view(), name='membership-post-create'),
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
