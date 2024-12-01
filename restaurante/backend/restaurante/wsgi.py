"""
WSGI config for restaurante project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application
import threading
from .chatbot import start_chatbot

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "restaurante.settings")

application = get_wsgi_application()


threading.Thread(target=start_chatbot).start()
