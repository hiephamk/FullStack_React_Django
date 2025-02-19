from django.urls import path
from . import views
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    path("publiczone/", views.PublicZoneView.as_view(), name="publiczone"),
    path('publiczone/<int:pk>/', views.PublicZoneDetailView.as_view(), name="publiczone-detail"),
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)