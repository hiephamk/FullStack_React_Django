from importlib.resources import contents
from .models import Publiczone

from django.contrib import admin

class PublicZoneAdmin(admin.ModelAdmin):
    list_display = ("contents")
    search_fields = ("contents")
    admin.site.register(Publiczone)

