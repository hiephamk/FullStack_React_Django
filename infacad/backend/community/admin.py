from django.contrib import admin
from .models import Post, Comment, Topic, SubTopic, Notification, Membership

class MembershipAdmin(admin.ModelAdmin):
    list_display = ('status')
    search_fields = ('status')
    admin.site.register(Membership)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('message',)
    search_fields = ('message')
    admin.site.register(Notification)
class TopicAdmin(admin.ModelAdmin):
    list_display = ('topicTitle',)
    search_fields = ('topicTitle',)
    admin.site.register(Topic)

class SubTopicAdmin(admin.ModelAdmin):
    list_display = ('subTopicTitle')
    search_fields = ('subTopicTitle')
    admin.site.register(SubTopic)

class PostAdmin(admin.ModelAdmin):
    list_display = ('content',)
    search_fields = ('content',)
    admin.site.register(Post)

class CommentAdmin(admin.ModelAdmin):
    list_display = ('text',)
    search_fields = ('text',)
    admin.site.register(Comment)
# Register your models here.
