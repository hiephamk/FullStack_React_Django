from django.conf import settings
from django.conf.urls.static import static
from django.urls import path
from . import views
from .views import AccountViewSet, UserProfileView

urlpatterns = [
    path('account/', views.AccountViewSet.as_view(), name = 'account-list'),
    path('account/<int:pk>/', views.AccountDetailView.as_view(), name = 'account-detail'),
    path('profile/<str:lookup_field>/<str:lookup_value>/', UserProfileView.as_view(), name='user-profile'),

]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
