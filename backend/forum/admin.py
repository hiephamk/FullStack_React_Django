# forum/admin.py
from django.contrib import admin
from .models import *

# Register models with the admin site
admin.site.register(Post)
admin.site.register(Comment)
