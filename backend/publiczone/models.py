from django.conf import settings
from django.db import models

class Publiczone(models.Model):
    areas = models.CharField(max_length=255, blank=True, null=True, default="Global")
    nations = models.CharField(max_length=255, blank=True, null=True, default="Global")
    languages = models.CharField(max_length=255, default="English")
    topics = models.CharField(max_length=255, default="General")
    content = models.TextField()
    media = models.FileField(upload_to="posts/", null=True, blank=True)
    content_owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="content_owner")
    display_name = models.CharField(max_length=255, blank=True, null=True, default="Anonymous")
    isDisplayName = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.topics} of {self.content}"

    @property
    def owner_profile_img(self):
        account = getattr(self.content_owner, 'account', None)
        if account and account.profile_img:
            return account.profile_img.url  # Return the URL of the profile image
        return "Anonymous"
