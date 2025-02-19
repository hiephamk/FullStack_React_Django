
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path("admin/", admin.site.urls),
    path('api/v1/auth/', include('djoser.urls')),
    path('api/v1/auth/', include('djoser.urls.jwt')),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/', include('community.urls')),
    path('api/', include('account.urls')),
    path('api/', include('chat.urls')),
    path('api/', include('mychannel.urls')),
    path('api/', include('publiczone.urls')),
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)