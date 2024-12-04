from rest_framework import generics, permissions, status
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Post, Comment, Like, Topic, SubTopic, Membership
from .serializers import PostSerializer, CommentSerializer, TopicSerializer, SubTopicSerializer, MembershipSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Notification
from django.contrib.auth.decorators import login_required


class NotificationListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        notifications = Notification.objects.filter(user=request.user).order_by('-created_at')
        data = [
            {
                "id": notification.id,
                "message": notification.message,
                "is_read": notification.is_read,
                "created_at": notification.created_at,
                "membership": notification.membership.id if notification.membership else None  # Include membership ID
            }
            for notification in notifications
        ]
        return Response(data)

    def post(self, request):  # Mark notifications as read
        notification_ids = request.data.get("ids", [])
        Notification.objects.filter(id__in=notification_ids, user=request.user).update(is_read=True)
        return Response({"detail": "Notifications marked as read."})

class UserJoinedTopicsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        # Fetch topics where the user is a member (approved or pending)
        joined_topics = Topic.objects.filter(membership__user=user).distinct()
        serializer = TopicSerializer(joined_topics, many=True)
        return Response(serializer.data)

# class JoinTopicView(APIView):
#     permission_classes = [IsAuthenticated]
#
#     def post(self, request, topic_id):
#         topic = get_object_or_404(Topic, id=topic_id)
#
#         # Check if the topic is public or private
#         if topic.status == "public":
#             # Automatically join if the topic is public
#             membership, created = Membership.objects.get_or_create(
#                 user=request.user,
#                 topic=topic,
#                 defaults={"status": "approved"},
#             )
#             if created:
#                 return Response(
#                     {"detail": "You have joined the public topic."},
#                     status=status.HTTP_200_OK,
#                 )
#             return Response(
#                 {"detail": "You are already a member of this public topic."},
#                 status=status.HTTP_400_BAD_REQUEST,
#             )
#         elif topic.status == "private":
#             # Check if a membership already exists
#             existing_membership = Membership.objects.filter(user=request.user, topic=topic).first()
#             if existing_membership:
#                 if existing_membership.status == "approved":
#                     return Response(
#                         {"detail": "You are already a member of this private topic."},
#                         status=status.HTTP_400_BAD_REQUEST,
#                     )
#                 elif existing_membership.status == "pending":
#                     return Response(
#                         {"detail": "Your request to join is pending approval."},
#                         status=status.HTTP_400_BAD_REQUEST,
#                     )
#                 elif existing_membership.status == "rejected":
#                     return Response(
#                         {"detail": "Your previous request was rejected."},
#                         status=status.HTTP_400_BAD_REQUEST,
#                     )
#
#             # For private topics, create a pending membership request
#             membership = Membership.objects.create(
#                 user=request.user, topic=topic, status="pending"
#             )
#             return Response(
#                 {"detail": "Join request sent to the owner for approval."},
#                 status=status.HTTP_200_OK,
#             )
#         else:
#             return Response(
#                 {"detail": "Invalid topic status."},
#                 status=status.HTTP_400_BAD_REQUEST,
#             )
# class JoinTopicView(APIView):
#     permission_classes = [IsAuthenticated]
#
#     def post(self, request, topic_id):
#         topic = get_object_or_404(Topic, id=topic_id)
#
#         if topic.status == "public":
#             Membership.objects.create(user=request.user, topic=topic, status="approved")
#             return Response({"detail": "You have joined the topic."}, status=status.HTTP_200_OK)
#         else:
#             Membership.objects.create(user=request.user, topic=topic, status="pending")
#
#             # Create a notification for the topic owner
#             Notification.objects.create(
#                 user=topic.author,
#                 message=f"{request.user.get_full_name()} has requested to join your topic '{topic.topicTitle}'."
#             )
#
#             return Response({"detail": "Join request sent to the owner for approval."}, status=status.HTTP_200_OK)
class JoinTopicView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, topic_id):
        topic = get_object_or_404(Topic, id=topic_id)

        if topic.status == "private":
            # Create a pending membership request
            membership = Membership.objects.create(
                user=request.user, topic=topic, status="pending"
            )

            # Create a notification for the topic owner
            Notification.objects.create(
                user=topic.author,  # Assuming `author` is the owner of the topic
                membership=membership,
                message=f"{request.user.first_name} has requested to join your topic '{topic.topicTitle}'."
            )
            return Response(
                {"detail": "Join request sent to the owner for approval."},
                status=status.HTTP_200_OK,
            )
        else:
            membership = Membership.objects.create(
                user=request.user, topic=topic, status="approved"
            )
            return Response(
                {"detail": "You are joined the chanel"},
                status=status.HTTP_200_OK,
            )
class ApproveRequestView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, membership_id, action=None):
        membership = get_object_or_404(Membership, id=membership_id)

        if membership.topic.author != request.user:
            return Response({"detail": "You are not the owner of this topic."}, status=status.HTTP_403_FORBIDDEN)

        if action == "approve":
            membership.status = Membership.APPROVED
        elif action == "reject":
            membership.status = Membership.REJECTED
        else:
            return Response({"detail": "Invalid action."}, status=status.HTTP_400_BAD_REQUEST)

        membership.save()
        return Response({"detail": f"User's request has been {action}ed."}, status=status.HTTP_200_OK)

class MembershipCreateView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = MembershipSerializer
    queryset = Membership.objects.all()

class TopicListCreateView(generics.ListCreateAPIView):
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


class SubTopicListCreateView(generics.ListCreateAPIView):
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

    def create_post(request):
        if request.FILES:
            logging.info("Files received: %s", request.FILES)
        else:
            logging.warning("No files received.")

        # Your usual post creation logic
        return Response(status=status.HTTP_201_CREATED)


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


@login_required
def get_joined_approved_topics(request):
    user = request.user
    # Get all topics the user is a member of and approved
    memberships = Membership.objects.filter(user=user, status=Membership.APPROVED)
    topics = [membership.topic for membership in memberships]

    topic_data = [
        {
            'topicTitle': topic.topicTitle,
            'topicDescription': topic.topicDescription,
            'status': topic.status,
        }
        for topic in topics
    ]

    return JsonResponse({'topics': topic_data})