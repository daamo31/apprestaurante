from django.db import models
from django.contrib.auth.models import AbstractUser

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

class Dish(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    price = models.DecimalField(max_digits=6, decimal_places=2)
    image = models.FileField(upload_to='dishes/', null=True, blank=True)  # Añadir campo de archivo

    def __str__(self):
        return self.name

class Reservation(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=15)
    date = models.DateField()
    time = models.TimeField()
    guests = models.IntegerField()
    table_id = models.IntegerField(null=True, blank=True)  # Añadir campo para la mesa


    def __str__(self):
        return f'Reservation for {self.name} on {self.date} at {self.time}'

class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    dishes = models.ManyToManyField(Dish)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Order {self.id} by {self.user.username}'
    

class Table(models.Model):
    seats = models.IntegerField()

    def __str__(self):
        return f'Table {self.id} with {self.seats} seats'

class Customer(models.Model):  
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    phone = models.CharField(max_length=15)
    address = models.CharField(max_length=255)