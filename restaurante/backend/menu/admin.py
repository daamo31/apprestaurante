from django.contrib import admin
from .models import Dish,Reservation,Employee

admin.site.register(Dish)
admin.site.register(Reservation)
admin.site.register(Employee)