from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

# Definir las URL de la aplicación
urlpatterns = [
    path('admin/', admin.site.urls),  # Ruta para el sitio de administración de Django
    path('api/', include('menu.urls')),  # Incluir las rutas de la aplicación 'menu' bajo el prefijo 'api/'
    path('api-auth/', include('rest_framework.urls')),  # Incluir las rutas de autenticación de Django REST framework
    path("", include("menu.urls")),  # Incluir las rutas de la aplicación 'menu' en la raíz
]

# Añadir rutas para servir archivos estáticos y de medios en modo de depuración
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)