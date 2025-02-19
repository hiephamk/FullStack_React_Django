from django.urls import path
#from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views
from django.conf import settings
from django.conf.urls.static import static
from .views import *


urlpatterns = [

    path('channels/', views.ChannelViewSet.as_view(), name='channel-list'),
    path('channels/<int:pk>/', views.ChannelViewSet.as_view(), name='channel-list-detail'),
    path('channels/notifications/',views.NotificationListView.as_view(), name='notifications-list'),
    path('channels/memberships/', views.MembershipListView.as_view(), name='membership-list'),
    path('channels/join-channel/<int:channel_id>/', views.MembershipListView.as_view(), name='join-channel'),
    path('channels/notifications/<int:membership_id>/<str:action>/',NotificationListView.as_view(), name='notifications-list'),

    path('channels/topics/', views.ChannelTopicListView.as_view(), name='topics-list'),
    path('channels/topics/posts/', views.ChannelPostListView.as_view(), name='posts-list'),

    path('channels/posts/comments/', views.ChannelCommentListView.as_view(), name='comments-list'),
    path('channels/topics/posts/<int:post_id>/like/', views.like_post, name='like-post'),
    path('channels/search-channels/', views.ChannelSearchView.as_view(), name='search-channels')

]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)