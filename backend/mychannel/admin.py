from django.contrib import admin
from .models import Channel, ChannelPost, ChannelTopic, ChannelComment, Notification, Membership

admin.site.register(Channel)
admin.site.register(ChannelTopic)
admin.site.register(ChannelPost)
admin.site.register(ChannelComment)
admin.site.register(Notification)
admin.site.register(Membership)
