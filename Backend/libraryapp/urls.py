from django.urls import path,include
from rest_framework.routers import DefaultRouter
from .import views
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)


router = DefaultRouter()
router.register(r'users',views.UserViewSet)
router.register(r'books',views.BookViewSet)
router.register(r'borrow-records',views.BorrowRecordViewSet)
router.register(r'categories',views.CategoryViewSet)

urlpatterns = [
    path('',include(router.urls)),
    path('api-auth/',include('rest_framework.urls',namespace='rest_framework')),
     path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]