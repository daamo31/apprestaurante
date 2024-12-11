from rest_framework import serializers
from .models import User, Employee, Dish, Reservation, Order, Table, Customer

# Serializador para el modelo User
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'password']
        extra_kwargs = {'password': {'write_only': True}}  # La contraseña solo se puede escribir, no leer

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)  # Crear un nuevo usuario con los datos validados
        return user

# Serializador para el modelo Employee
class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = ['id', 'username', 'password']
        extra_kwargs = {'password': {'write_only': True}}  # La contraseña solo se puede escribir, no leer

    def create(self, validated_data):
        employee = Employee.objects.create_user(**validated_data)  # Crear un nuevo empleado con los datos validados
        return employee

# Serializador para el modelo Dish
class DishSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dish
        fields = '__all__'  # Incluir todos los campos del modelo Dish

# Serializador para el modelo Reservation
class ReservationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reservation
        fields = '__all__'  # Incluir todos los campos del modelo Reservation

# Serializador para el modelo Order
class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = '__all__'  # Incluir todos los campos del modelo Order

# Serializador para el modelo Table
class TableSerializer(serializers.ModelSerializer):
    class Meta:
        model = Table
        fields = '__all__'  # Incluir todos los campos del modelo Table

# Serializador para el modelo Customer
class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = '__all__'  # Incluir todos los campos del modelo Customer