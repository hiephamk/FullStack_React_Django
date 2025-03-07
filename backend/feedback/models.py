from pickle import FALSE

from django.conf import settings
from django.db import models


# Create your models here.
class Feedback(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    airquality = models.CharField(max_length=200)
    suggestion = models.TextField()
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    def __str__(self):
        return f'{self.user.get_full_name}: {self.airquality}'

