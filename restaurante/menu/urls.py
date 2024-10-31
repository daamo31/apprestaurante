from django.urls import path, include
from rest_framework.routers import DefaultRouter
from menu.views import UserViewSet, EmployeeViewSet, DishViewSet, ReservationViewSet, OrderViewSet
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'employees', EmployeeViewSet)
router.register(r'dishes', DishViewSet)
router.register(r'reservations', ReservationViewSet)
router.register(r'orders', OrderViewSet)  # Añadir ruta para OrderViewSet

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]