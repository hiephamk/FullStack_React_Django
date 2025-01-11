from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from .views import *

urlpatterns = [

    path('posts/', views.PostListCreateView.as_view(), name='post-list-create'),
    path('posts/<int:pk>', views.PostDetailView.as_view(), name='post-detail'),
    path('posts/<int:post_id>/like/', views.like_post, name='post-like'),
    path('posts/<int:post_id>/share/', views.share_post_with_circle, name='post-share'),

    path('comments/', views.CommentListCreateView.as_view(), name='comment-list-create'),
    path('comments/<int:pk>/', views.CommentDetailView.as_view(), name='comment-detail'),

    path('circles/', views.CircleListView.as_view(), name='circle-list'),
    path('circles/<int:pk>/', views.CircleDetailView.as_view(), name='circle-list'),
    path('circles/notifications/', views.CircleNotificationView.as_view(), name='circle-notification'),
    path('circles/notifications/<str:action>/', views.CircleNotificationAcction.as_view(), name='circle-notification'),
    #path('circles/notifications/<int:notification_id>/', views.notification_detail, name='circle-notification-detail'),


]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
