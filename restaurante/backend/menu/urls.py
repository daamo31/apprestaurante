from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, EmployeeViewSet, DishViewSet, ReservationViewSet, OrderViewSet, TableViewSet, TableListView, get_dishes
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'employees', EmployeeViewSet)
router.register(r'dishes', DishViewSet, basename='dish')
router.register(r'reservations', ReservationViewSet)
router.register(r'orders', OrderViewSet)
router.register(r'tables', TableViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('api/users/login/', TokenObtainPairView.as_view(), name='user_login'),

    path('tables/', TableListView.as_view(), name='table-list'),
    path('dishes/', get_dishes, name='get_dishes'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/', include(router.urls)),


]