from django.contrib import admin
from .models import Post, Comment, Circles, Circle_Notification

class PostAdmin(admin.ModelAdmin):
    list_display = ('content',)
    search_fields = ('content',)
    admin.site.register(Post)


class CommentAdmin(admin.ModelAdmin):
    list_display = ('text',)
    search_fields = ('text',)
    admin.site.register(Comment)


class CircleAdmin(admin.ModelAdmin):
    list_display = ('name', 'owner')
    filter_horizontal = ('members',)
    admin.site.register(Circles)
admin.site.register(Circle_Notification)