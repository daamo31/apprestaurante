from rest_framework import viewsets, permissions, generics, status
from .models import User, Employee, Dish, Reservation, Order, Table, Customer
from .serializers import UserSerializer, EmployeeSerializer, DishSerializer, ReservationSerializer, OrderSerializer, TableSerializer, CustomerSerializer
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.http import JsonResponse, HttpResponse
from sqlalchemy import create_engine, MetaData, Table as SQLATable, select
from rest_framework.parsers import MultiPartParser, FormParser
from django.shortcuts import render, redirect
from .forms import DishForm

# Conectar a la base de datos SQLite
DATABASE_URI = 'sqlite:///db.sqlite3'  
engine = create_engine(DATABASE_URI)
metadata = MetaData()
metadata.reflect(bind=engine)

# Función para obtener los platos desde la base de datos
def get_dishes(request):
    productos_table = SQLATable('menu_dish', metadata, autoload_with=engine)
    conn = engine.connect()
    select_stmt = select(productos_table.c.name, productos_table.c.description, productos_table.c.price)
    result = conn.execute(select_stmt)
    dishes = [dict(row) for row in result]
    conn.close()
    return JsonResponse(dishes, safe=False)

# Vista de conjunto de vistas para el modelo User
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

    @action(detail=False, methods=['post'])
    def login(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = User.objects.filter(username=username).first()
        if user and user.check_password(password):
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            })
        return Response({'error': 'Invalid credentials'}, status=400)

# Vista de conjunto de vistas para el modelo Employee
class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
    permission_classes = [permissions.AllowAny]

    @action(detail=False, methods=['post'])
    def login(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        employee = Employee.objects.filter(username=username).first()
        if employee and employee.check_password(password):
            refresh = RefreshToken.for_user(employee)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            })
        return Response({'error': 'Invalid credentials'}, status=400)

# Vista de conjunto de vistas para el modelo Dish
class DishViewSet(viewsets.ModelViewSet):
    queryset = Dish.objects.all()
    serializer_class = DishSerializer
    parser_classes = (MultiPartParser, FormParser)

    @action(detail=False, methods=['post'])
    def upload_dish(self, request):
        form = DishForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            return Response({'status': 'success'}, status=status.HTTP_201_CREATED)
        else:
            return Response(form.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def success(self, request):
        return HttpResponse('Successfully uploaded')

# Vista de conjunto de vistas para el modelo Reservation
class ReservationViewSet(viewsets.ModelViewSet):
    queryset = Reservation.objects.all()
    serializer_class = ReservationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        print(request.data)  # Verifica los datos recibidos
        return super().create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        reservation = self.get_object()
        print("Datos recibidos para actualizar:", request.data)  # Agrega información de depuración
        serializer = self.get_serializer(reservation, data=request.data, partial=True)
        if serializer.is_valid():
            self.perform_update(serializer)
            return Response(serializer.data)
        else:
            print("Errores de validación:", serializer.errors)  # Agrega información de depuración
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        reservation = self.get_object()
        reservation.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

# Vista de conjunto de vistas para el modelo Order
class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        print(request.data)  # Verifica los datos recibidos
        return super().create(request, *args, **kwargs)

# Vista de conjunto de vistas para el modelo Table
class TableViewSet(viewsets.ModelViewSet):
    queryset = Table.objects.all()
    serializer_class = TableSerializer

# Vista de conjunto de vistas para el modelo Customer
class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer

# Vista de lista para el modelo Table
class TableListView(generics.ListAPIView):
    queryset = Table.objects.all()
    serializer_class = TableSerializer