#!/usr/bin/env python
import os
import sys
import threading
from  restaurante.chatbot import start_chatbot

def main():
    """Run administrative tasks."""
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "restaurante.settings")
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)

if __name__ == "__main__":
    # Iniciar el chatbot en un hilo separado
    threading.Thread(target=start_chatbot).start()
    main()