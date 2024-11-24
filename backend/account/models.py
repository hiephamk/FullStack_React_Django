from django.db import models
from django.conf import settings
import uuid

class Account(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    profile_img = models.ImageField(upload_to='profiles/', blank=True,null=True)
    aboutMe = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)
    profile = models.CharField(max_length=36, blank=True, unique=True, editable=False)
    def __str__(self):
        return f"{self.user.get_full_name}"

    def save(self, *args, **kwargs):
        if not self.profile:
            while True:
                # Generate a UUID and check for uniqueness
                profile_candidate = str(uuid.uuid4())
                if not Account.objects.filter(profile=profile_candidate).exists():
                    self.profile = profile_candidate
                    break
        super().save(*args, **kwargs)

