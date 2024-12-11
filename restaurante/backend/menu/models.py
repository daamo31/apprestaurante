from django.db import models
from django.contrib.auth.models import AbstractUser

# Modelo personalizado de usuario que extiende AbstractUser
class User(AbstractUser):
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='user_set_custom',
        blank=True,
        help_text='The groups this user belongs to.',
        verbose_name='groups',
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='user_set_custom',
        blank=True,
        help_text='Specific permissions for this user.',
        verbose_name='user permissions',
    )

# Modelo personalizado de empleado que extiende AbstractUser
class Employee(AbstractUser):
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='employee_set',
        blank=True,
        help_text='The groups this employee belongs to.',
        verbose_name='groups',
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='employee_set',
        blank=True,
        help_text='Specific permissions for this employee.',
        verbose_name='user permissions',
    )

# Modelo para los platos
class Dish(models.Model):
    name = models.CharField(max_length=100)  # Nombre del plato
    description = models.TextField()  # Descripción del plato
    price = models.DecimalField(max_digits=6, decimal_places=2)  # Precio del plato
    image = models.FileField(upload_to='dishes/', null=True, blank=True)  # Imagen del plato

    def __str__(self):
        return self.name

# Modelo para las reservas
class Reservation(models.Model):
    name = models.CharField(max_length=100)  # Nombre de la persona que reserva
    email = models.EmailField()  # Email de la persona que reserva
    phone = models.CharField(max_length=15)  # Teléfono de la persona que reserva
    date = models.DateField()  # Fecha de la reserva
    time = models.TimeField()  # Hora de la reserva
    guests = models.IntegerField()  # Número de comensales
    table = models.ForeignKey('Table', null=True, blank=True, on_delete=models.SET_NULL)  # Mesa reservada

    def __str__(self):
        return f'Reservation for {self.name} on {self.date} at {self.time}'

# Modelo para los pedidos
class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)  # Usuario que realiza el pedido
    dishes = models.ManyToManyField(Dish)  # Platos incluidos en el pedido
    created_at = models.DateTimeField(auto_now_add=True)  # Fecha y hora de creación del pedido

    def __str__(self):
        return f'Order {self.id} by {self.user.username}'

# Modelo para las mesas
class Table(models.Model):
    seats = models.IntegerField()  # Número de asientos en la mesa

    def __str__(self):
        return f'Table {self.id} with {self.seats} seats'

# Modelo para los clientes
class Customer(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)  # Usuario asociado al cliente
    phone = models.CharField(max_length=15)  # Teléfono del cliente
    address = models.CharField(max_length=255)  # Dirección del cliente

    def __str__(self):
        return self.user.username