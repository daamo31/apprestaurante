
import os
from django.core.wsgi import get_wsgi_application
import threading
from .chatbot import start_chatbot

# Establecer la configuración predeterminada de Django para el proyecto 'restaurante'
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "restaurante.settings")

# Obtener la aplicación WSGI para el proyecto
application = get_wsgi_application()

# Iniciar el chatbot en un hilo separado
threading.Thread(target=start_chatbot).start()