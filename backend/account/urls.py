from django.conf import settings
from django.conf.urls.static import static
from django.urls import path
from . import views
from .views import AccountViewSet

urlpatterns = [
    path('account/', views.AccountViewSet.as_view(), name = 'account-list'),
    path('account/<int:pk>/', views.AccountViewSet.as_view(), name = 'account-detail')

]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
