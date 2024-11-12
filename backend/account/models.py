from django.db import models
from django.conf import settings

class Account(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    profile_img = models.ImageField(upload_to='profiles/', blank=True, null=True)
    def __str__(self):
        return f"{self.profile_img}"
