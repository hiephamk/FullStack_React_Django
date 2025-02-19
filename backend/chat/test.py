import os
import django
django.setup()
from models import Chat

new_chat = Chat.objects.create(is_group=True, group_name="Test Group")
new_chat.members.add(1, 2)  # Adding members
print(new_chat.group_name)
