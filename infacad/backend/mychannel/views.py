from django.db.models import Q, Value
from django.db.models.functions import Concat
from django.http import JsonResponse
from django.shortcuts import render
from rest_framework import generics, permissions, viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.generics import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth.decorators import login_required
from rest_framework.views import APIView

from .models import Channel, ChannelTopic, ChannelPost, ChannelComment, Notification, Membership, ChannelLike
from .serializers import ChannelSerializer, ChannelPostSerializer, ChannelTopicSerializer, ChannelCommentSerializer, MembershipSerializer, NotificationSerializer, ChannelLikeSerializer


class ChannelViewSet(generics.ListCreateAPIView):
    queryset = Channel.objects.all()
    serializer_class = ChannelSerializer
    permission_classes = [IsAuthenticated]

class ChannelTopicListView(generics.ListCreateAPIView):
    serializer_class = ChannelTopicSerializer
    permission_classes = [IsAuthenticated]
    queryset = ChannelTopic.objects.all()
class ChannelPostListView(generics.ListCreateAPIView):
    serializer_class = ChannelPostSerializer
    permission_classes = [IsAuthenticated]
    queryset = ChannelPost.objects.all()
class ChannelCommentListView(generics.ListCreateAPIView):
    serializer_class = ChannelCommentSerializer
    permission_classes = [IsAuthenticated]
    queryset = ChannelComment.objects.all()

class MembershipListView(generics.ListCreateAPIView):
    serializer_class = MembershipSerializer
    permission_classes = [IsAuthenticated]
    queryset = Membership.objects.all()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    def get_queryset(self):
        user = self.request.user
        return Membership.objects.filter(user=user, status=Membership.APPROVED)

    def post(self, request, channel_id):
        channel = get_object_or_404(Channel, id=channel_id)
        membership_status = Membership.PENDING if channel.channel_type == "private" else Membership.APPROVED
        membership = Membership.objects.create(user=request.user, channel=channel, status=membership_status)

        if channel.channel_type == "private":
            Notification.objects.create(
                user=channel.owner,
                membership=membership,
                message=f"{request.user.get_full_name} has requested to join your channel '{channel.name}'."
            )
            return Response({"detail": "Join request sent to the owner for approval."}, status=200)
        else:
            return Response({"detail": "You have joined the channel."}, status=200)


class NotificationListView(APIView):
    permission_classes = [IsAuthenticated]
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer

    def get(self, request):
        notifications = Notification.objects.filter(user=request.user).order_by('-created_at')
        data = [
            {
                "id": notification.id,
                "user":notification.user.id,
                "message": notification.message,
                "is_read": notification.is_read,
                "is_handled":notification.is_handled,
                "created_at": notification.created_at,
                "member_name":notification.membership.user.get_full_name,
                "membership": notification.membership.id if notification.membership else None
            }
            for notification in notifications
        ]
        return Response(data)

    def post(self, request, membership_id, action=None):
        membership = get_object_or_404(Membership, id=membership_id)
        notification = Notification.objects.get(membership=membership, user=request.user)

        if membership.channel.owner != request.user:  # Check if user is the owner
            return Response({"detail": "You are not the owner of this channel."}, status=status.HTTP_403_FORBIDDEN)

        if action == "approve":
            membership.status = Membership.APPROVED
            notification.is_read = True
            notification.is_handled = True
        elif action == "reject":
            membership.status = Membership.REJECTED
            notification.is_read = True
            notification.is_handled = True
        else:
            return Response({"detail": "Invalid action."}, status=status.HTTP_400_BAD_REQUEST)

        membership.save()
        notification.save()
        return Response({"detail": f"User's request has been {action}ed."}, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def like_post(request, post_id):
    user = request.user  # Ensure this is the authenticated user
    post = get_object_or_404(ChannelPost, id=post_id)
    post.like_count += 1
    post.save()
    return Response({'like_count': post.like_count})

@login_required
def get_joined_approved_channel(request):
    user = request.user
    memberships = Membership.objects.filter(user=user, status=Membership.APPROVED)
    channel = [membership.channel for membership in memberships]

    topic_data = [
        {
            'name': channel.name,
            'description': channel.description,
            'channel_type': channel.channel_type,
        }
        for topic in channel
    ]

    return JsonResponse({'channel': topic_data})

class ChannelSearchView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        # Get the keyword from the query parameters
        keyword = request.GET.get('keyword', '').strip()  # Default to an empty string if not provided

        # Annotate the owner's full name for searching
        channels = Channel.objects.annotate(
            owner_full_name=Concat('owner__first_name', Value(' '), 'owner__last_name')
        ).filter(
            Q(name__icontains=keyword) |
            Q(description__icontains=keyword) |
            Q(channel_type__icontains=keyword) |
            Q(owner_full_name__icontains=keyword)
        ).order_by('-created_at')

        # Serialize the data
        serializer = ChannelSerializer(channels, many=True)
        return Response(serializer.data)
