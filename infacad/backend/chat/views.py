import json

from django.contrib.auth import get_user_model
from rest_framework import generics, viewsets
from rest_framework.decorators import api_view
from rest_framework.generics import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication

from .models import Chat, Message
from .serializers import ChatSerializer,MessageSerializer
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q, Count
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import get_user_model

import logging
User = get_user_model()


logger = logging.getLogger(__name__)

class StartChatGroup(APIView):
    def post(self, request):
        try:
            members = request.data.get("members", [])
            group_name = request.data.get("group_name", "").strip()

            if not group_name:
                return JsonResponse({"error": "Group name cannot be empty."}, status=400)
            if len(members) < 1:
                return JsonResponse({"error": "A group must have at least 2 members."}, status=400)

            current_user_id = request.user.id
            if not request.user.is_authenticated:
                return JsonResponse({"error": "Unauthorized"}, status=401)

            # Ensure current user is included in the members list if not already
            if current_user_id not in members:
                members.append(current_user_id)

            # Find existing chat by matching members, regardless of the number of members in the chat
            existing_chat = Chat.objects.filter(
                is_active=True,
                group_name=group_name
            ).annotate(member_count=Count("members")).filter(
                member_count=len(members),
                members__id__in=members
            ).distinct()

            # Check if any existing chat has all the members in the provided list
            for chat in existing_chat:
                if set(chat.members.values_list('id', flat=True)) == set(members):
                    return JsonResponse({
                        "error": "Chat already exists.",
                        "chat_id": chat.id,
                        "is_active": chat.is_active,
                    }, status=400)

            # No existing chat found, create a new one
            new_chat = Chat.objects.create(
                is_active=True,
                group_name=group_name,
                is_group=True,
            )
            new_chat.members.set(members)
            new_chat.save()

            return JsonResponse({"id": new_chat.id})
        except Exception as e:
            logger.error(f"Error in StartChatGroup: {str(e)}", exc_info=True)
            return JsonResponse({"error": "Internal Server Error", "details": str(e)}, status=500)


class ChatViewSet(generics.ListCreateAPIView):
    serializer_class = ChatSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Chat.objects.filter(
            Q(sender=user) | Q(receiver=user) | Q(members=user)
        ).distinct().order_by('timestamp')

    def perform_create(self, serializer):
        if serializer.validated_data.get("is_group", False):
            serializer.save()
        else:
            serializer.save(sender=self.request.user)

    def create(self, request, *args, **kwargs):
        if not request.data.get("is_group", False):  # If not group chat
            receiver_id = request.data.get('receiver')
            if not receiver_id:
                return Response({"error": "Receiver is required."}, status=status.HTTP_400_BAD_REQUEST)

            try:
                receiver = get_user_model().objects.get(id=receiver_id)
            except get_user_model().DoesNotExist:
                return Response({"error": "Receiver does not exist."}, status=status.HTTP_404_NOT_FOUND)

            if receiver_id == request.user.id:
                return Response({"error": "You cannot send a message to yourself."}, status=status.HTTP_400_BAD_REQUEST)

            existing_chat = Chat.objects.annotate(member_count=Count('members')).filter(
                members=request.user
            ).filter(
                members=receiver
            ).filter(
                member_count=2
            ).first()

            # Uncomment if duplicate chats aren't allowed
            if existing_chat:
                return Response({"message": "Chat already exists."}, status=status.HTTP_400_BAD_REQUEST)

        return super().create(request, *args, **kwargs)

# class ChatViewSet(generics.ListCreateAPIView):
#     serializer_class = ChatSerializer
#     permission_classes = [IsAuthenticated]
#
#     def get_queryset(self):
#         user = self.request.user
#         return Chat.objects.filter(
#             Q(sender=user) | Q(receiver=user)
#         ).order_by('timestamp')
#
#     def perform_create(self, serializer):
#         serializer.save(sender=self.request.user)
#
#     def create(self, request, *args, **kwargs):
#         receiver_id = request.data.get('receiver')
#         if not receiver_id:
#             return Response({"error": "Receiver is required."}, status=status.HTTP_400_BAD_REQUEST)
#
#         try:
#             receiver = get_user_model().objects.get(id=receiver_id)
#         except get_user_model().DoesNotExist:
#             return Response({"error": "Receiver does not exist."}, status=status.HTTP_404_NOT_FOUND)
#
#         if receiver_id == request.user.id:
#             return Response({"error": "You cannot send a message to yourself."}, status=status.HTTP_400_BAD_REQUEST)
#
#         # Check if a chat already exists between the users
#         existing_chat = Chat.objects.filter(
#             Q(sender=request.user, receiver=receiver) | Q(sender=receiver, receiver=request.user)
#         ).first()
#
#         # if existing_chat:
#         #     return Response({"message": "Chat already exists."}, status=status.HTTP_400_BAD_REQUEST)
#
#         # If no chat exists, proceed to create a new one
#         return super().create(request, *args, **kwargs)

class MessageViewSet(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    queryset = Message.objects.all()

    def get_queryset(self):
        # Override to filter based on chat_id
        chat_id = self.kwargs.get('pk')  # 'pk' maps to chatId
        return Message.objects.filter(chat_id=chat_id).order_by('timestamp')

    def get(self, request, *args, **kwargs):
        messages = self.get_queryset()
        serializer = self.get_serializer(messages, many=True)
        return Response(serializer.data)
    def perform_create(self, serializer):
        serializer.save(sender=self.request.user)

class MessageIdViewSet(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]
    queryset = Message.objects.all()

@csrf_exempt
def search_items(request):
    query = request.GET.get('q', '').strip()  # Ensure the query is stripped of extra spaces
    if not query:
        return JsonResponse({'items': []})  # Return early if no query

    # Filter users based on first name
    users = User.objects.filter(first_name__icontains=query).distinct()

    # Prepare the data to return
    data = [
        {
            'id': user.id,
            'name': f"{user.first_name} {user.last_name}"
        }
        for user in users
    ]

    return JsonResponse({'items': data})


# @api_view(['POST'])
# def start_chat(request):
#     receiver_id = request.data.get('receiver')
#     if not receiver_id:
#         return Response({"error": "Receiver is required."}, status=status.HTTP_400_BAD_REQUEST)
#
#     try:
#         receiver = get_user_model().objects.get(id=receiver_id)
#     except get_user_model().DoesNotExist:
#         return Response({"error": "Receiver does not exist."}, status=status.HTTP_404_NOT_FOUND)
#
#     if receiver_id == request.user.id:
#         return Response({"error": "You cannot send a message to yourself."}, status=status.HTTP_400_BAD_REQUEST)
#
#     # Check if a chat already exists between the users
#     chat, created = Chat.objects.get_or_create(
#         sender=request.user, receiver=receiver
#     )
#
#     # Add the new message to the chat
#     message = Message.objects.create(
#         chat=chat,
#         sender=request.user,
#         content=request.data.get("content", ""),
#     )
#
#     return Response({
#         "id": message.id,
#         "sender": {
#             "id": message.sender.id,
#             "first_name": message.sender.first_name,
#             "last_name": message.sender.last_name,
#         },
#         "content": message.content,
#         "timestamp": message.timestamp,
#     }, status=status.HTTP_201_CREATED)

@api_view(['GET'])
def get_messages(request):
    sender_id = request.GET.get('sender')
    receiver_id = request.GET.get('receiver')

    if sender_id and receiver_id:
        messages = Message.objects.filter(
            chat__sender_id__in=[sender_id, receiver_id],
            chat__receiver_id__in=[sender_id, receiver_id]
        ).order_by('timestamp')

        data = [
            {
                'id': message.id,
                'sender': {
                    'id': message.sender.id,
                    'first_name': message.sender.first_name,
                    'last_name': message.sender.last_name,
                },
                'content': message.content,
                'timestamp': message.timestamp.isoformat(),
            }
            for message in messages
        ]
        return JsonResponse({'messages': data})
    return JsonResponse({'error': 'Invalid parameters'}, status=400)

# @api_view(['POST'])
# def start_chat_group(request):
#     members_ids = request.data.get('members')
#     content = request.data.get('content', '')
#
#     if not members_ids or not isinstance(members_ids, list):
#         return Response({"error": "Participants must be a list of user IDs."}, status=status.HTTP_400_BAD_REQUEST)
#
#     try:
#         members = get_user_model().objects.filter(id__in=members_ids)
#     except get_user_model().DoesNotExist:
#         return Response({"error": "Some members do not exist."}, status=status.HTTP_404_NOT_FOUND)
#
#     if len(members) != len(members_ids):
#         return Response({"error": "One or more members do not exist."}, status=status.HTTP_404_NOT_FOUND)
#
#     # Prevent the user from creating a group with only themselves
#     if len(members) == 1 and request.user.id in members_ids:
#         return Response({"error": "Cannot create a chat with only yourself."}, status=status.HTTP_400_BAD_REQUEST)
#
#     # Create a unique chat with these members
#     chat, created = Chat.objects.get_or_create()
#     chat.participants.set(participants)
#     chat.save()
#
#     # Optionally create a message
#     if content:
#         message = Message.objects.create(
#             chat=chat,
#             sender=request.user,
#             content=content,
#         )
#         return Response({
#             "chat_id": chat.id,
#             "message": {
#                 "id": message.id,
#                 "sender": {
#                     "id": message.sender.id,
#                     "first_name": message.sender.first_name,
#                     "last_name": message.sender.last_name,
#                 },
#                 "content": message.content,
#                 "timestamp": message.timestamp,
#             },
#         }, status=status.HTTP_201_CREATED)
#
#     return Response({
#         "chat_id": chat.id,
#         "participants": [{"id": p.id, "name": p.get_full_name()} for p in participants],
#     }, status=status.HTTP_201_CREATED)


@api_view(['POST'])
def create_chat(request):
    """
    Create a new chat or group chat.
    """
    participants = request.data.get('participants', [])
    if not participants:
        return Response({"error": "Participants are required."}, status=status.HTTP_400_BAD_REQUEST)

    # Validate participants
    users = User.objects.filter(id__in=participants)
    if users.count() != len(participants):
        return Response({"error": "Some participants are invalid."}, status=status.HTTP_400_BAD_REQUEST)

    chat = Chat.objects.create()
    chat.participants.set(users)
    chat.save()

    serializer = ChatSerializer(chat)
    return Response(serializer.data, status=status.HTTP_201_CREATED)

@api_view(['GET'])
def get_messages_group(request):
    chat_id = request.GET.get('chat')

    if not chat_id:
        return JsonResponse({'error': 'Chat ID is required'}, status=400)

    messages = Message.objects.filter(chat_id=chat_id).order_by('timestamp')
    data = [
        {
            'id': message.id,
            'sender': {
                'id': message.sender.id,
                'first_name': message.sender.first_name,
                'last_name': message.sender.last_name,
            },
            'content': message.content,
            'timestamp': message.timestamp.isoformat(),
        }
        for message in messages
    ]
    return JsonResponse({'messages': data})

# @api_view(['POST'])
# def start_chat_group(request):
#     if not request.user.is_authenticated:
#         return Response({"detail": "Authentication credentials were not provided."}, status=status.HTTP_401_UNAUTHORIZED)
#
#     sender = request.user
#     members = request.data.get('members', [])
#     group_name = request.data.get('group_name', "Group Chat")
#
#     # Ensure at least one member (other than the sender) is provided
#     if not members or len(members) < 1:
#         return Response({"detail": "At least one member is required."}, status=status.HTTP_400_BAD_REQUEST)
#     #check duplicate chat:
#     existing_chats = Chat.objects.annotate(member_count=Count('members')).filter(
#         member_count=len(members),
#         members__id__in=members,
#         is_group=True
#     ).distinct()
#
#     for chat in existing_chats:
#         chat_member_ids = set(chat.members.values_list('id', flat=True))
#         if chat_member_ids == set(members):
#             return JsonResponse(
#                 {"error": "A group chat with the same members already exists.", "chat_id": chat.id},
#                 status=400
#             )
#     # Create the new chat
#     chat = Chat.objects.create(sender=sender, group_name=group_name, is_group=True)
#     chat.members.add(sender)  # Add sender to the group chat
#     chat.members.add(*members)  # Add other members
#
#     # Serialize the chat object to return the details
#     serializer = ChatSerializer(chat)
#     return Response(serializer.data, status=status.HTTP_201_CREATED)

@api_view(['POST'])
def start_chat_group(request):
    data = json.loads(request.body)
    member_ids = data.get("members", [])
    group_name = data.get("group_name", "")

    # Ensure there are at least two members
    if not member_ids or len(member_ids) < 1:
        return JsonResponse({"error": "A group chat must have at least two members."}, status=400)

    # Check if a chat with the exact same members already exists
    existing_chats = Chat.objects.annotate(member_count=Count('members')).filter(
        member_count=len(member_ids),
        members__id__in=member_ids,
        is_group=True
    ).distinct()

    for chat in existing_chats:
        chat_member_ids = set(chat.members.values_list('id', flat=True))
        if chat_member_ids == set(member_ids):
            if not chat.group_name:  # Update group_name if missing
                chat.group_name = group_name
                chat.save()
            return JsonResponse(
                {"error": "A group chat with the same members already exists.", "chat_id": chat.id},
                status=400
            )

    # Create new group chat
    if not existing_chats:
        new_chat = Chat.objects.create(is_group=True, group_name=group_name)
        new_chat.members.add(*member_ids)
        return JsonResponse({"id": new_chat.id, "group_name": new_chat.group_name}, status=201)

@api_view(['POST'])
def send_message(request, chat_id):
    chat = Chat.objects.filter(id=chat_id).first()

    if not chat:
        return Response({"detail": "Chat not found."}, status=status.HTTP_404_NOT_FOUND)

    # Check if user is part of the chat
    if request.user not in chat.members.all():
        return Response({"detail": "You are not a member of this chat."}, status=status.HTTP_403_FORBIDDEN)

    content = request.data.get('content')

    if not content:
        return Response({"detail": "Message content is required."}, status=status.HTTP_400_BAD_REQUEST)

    # Create the message
    message = Message.objects.create(
        chat=chat,
        sender=request.user,
        content=content
    )

    # Serialize the message and return
    serializer = MessageSerializer(message)
    return Response(serializer.data, status=status.HTTP_201_CREATED)


