from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, EmployeeViewSet, DishViewSet, ReservationViewSet, OrderViewSet, TableViewSet, TableListView, get_dishes
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView

# Crear un enrutador y registrar las vistas de conjunto de vistas
router = DefaultRouter()
router.register(r'users', UserViewSet)  # Registrar la vista de conjunto de vistas para usuarios
router.register(r'employees', EmployeeViewSet)  # Registrar la vista de conjunto de vistas para empleados
router.register(r'dishes', DishViewSet, basename='dish')  # Registrar la vista de conjunto de vistas para platos
router.register(r'reservations', ReservationViewSet)  # Registrar la vista de conjunto de vistas para reservas
router.register(r'orders', OrderViewSet)  # Registrar la vista de conjunto de vistas para pedidos
router.register(r'tables', TableViewSet)  # Registrar la vista de conjunto de vistas para mesas

# Definir las URL de la aplicación
urlpatterns = [
    path('', include(router.urls)),  # Incluir las rutas del enrutador
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),  # Ruta para obtener el token JWT
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),  # Ruta para refrescar el token JWT
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),  # Ruta para verificar el token JWT
    path('api/users/login/', TokenObtainPairView.as_view(), name='user_login'),  # Ruta para el inicio de sesión de usuarios

    path('tables/', TableListView.as_view(), name='table-list'),  # Ruta para la lista de mesas
    path('dishes/', get_dishes, name='get_dishes'),  # Ruta para obtener los platos
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),  # Ruta para obtener el token JWT
    path('api/', include(router.urls)),  # Incluir las rutas del enrutador
]