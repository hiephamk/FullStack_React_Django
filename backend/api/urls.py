
from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()
router.register(r'news', NewsViewSet, basename='news')
urlpatterns = router.urls
