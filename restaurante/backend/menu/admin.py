from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Dish, Reservation, Employee

# Registrar los modelos Dish y Reservation en el sitio de administración
admin.site.register(Dish)
admin.site.register(Reservation)

# Definir una clase de administración personalizada para el modelo User
class UserAdmin(BaseUserAdmin):
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'email')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'password1', 'password2'),
        }),
    )
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_staff') # Campos que se mostrarán en la lista de usuarios
    search_fields = ('username', 'first_name', 'last_name', 'email') # Campos por los que se puede buscar
    ordering = ('username',) # Campo por el que se ordenarán los usuarios

# Registrar el modelo User con la clase de administración personalizada UserAdmin
admin.site.register(User, UserAdmin)

# Definir una clase de administración personalizada para el modelo Employee
class EmployeeAdmin(BaseUserAdmin):
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'email')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'password1', 'password2', 'position', 'department', 'hire_date'),
        }),
    )
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_staff') # Campos que se mostrarán en la lista de empleados
    search_fields = ('username', 'first_name', 'last_name', 'email', 'position', 'department') # Campos por los que se puede buscar
    ordering = ('username',) # Campo por el que se ordenarán los empleados

# Registrar el modelo Employee con la clase de administración personalizada EmployeeAdmin
admin.site.register(Employee, EmployeeAdmin)