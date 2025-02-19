from django.conf import settings
from django.conf.urls.static import static
from django.urls import path
from .views import search_items, get_messages, MessageViewSet, start_chat_group, get_messages_group, \
    send_message
from . import views

urlpatterns = [
    path('chat/', views.ChatViewSet.as_view(), name = 'chat-list'),
    path('chat/<int:pk>/', views.ChatViewSet.as_view(), name = 'chat-detail'),
    path('search-items/', search_items, name='search_items'),
    # path('start_chat/', start_chat, name='start_chat'),
    # path('start_chat/<int:pk>/', start_chat, name='start_chat_detail'),
    path('get_messages/', get_messages, name='get_messages'),
    path('get_messages/<int:pk>/', get_messages, name='get_messages'),
    path('messages/', views.MessageViewSet.as_view(), name='messages'),
    path('messages/<int:pk>/', views.MessageViewSet.as_view(), name='messages_Id'),
    path('start_chat_group/', views.StartChatGroup.as_view(), name='start_chat_group'),
    path('messages/<int:chat_id>/send/', send_message, name='send_message'),

]
