from django.contrib import admin
from .models import Post, Comment
class PostAdmin(admin.ModelAdmin):
    list_display = ('content',)
    search_fields = ('content',)
admin.site.register(Post)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('text',)
    search_fields = ('text',)
admin.site.register(Comment)
# Register your models here.
