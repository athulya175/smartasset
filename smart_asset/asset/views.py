from django.contrib.auth import get_user_model
from datetime import date

from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.filters import SearchFilter
from rest_framework.decorators import action
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import Asset, InventoryItem, Assignment, Ticket
from .serializers import (
    InventorySerializer,
    UserSerializer,
    AssignmentSerializer,
    AssetSerializer,
    TicketSerializer,
    CustomTokenSerializer
)
from .decorators import IsAdminRole

User = get_user_model()
class AssetViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Asset.objects.all()
    serializer_class = AssetSerializer
    filter_backends = [SearchFilter]
    search_fields = ['name']
    def get_permissions(self):              # add this method
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdminRole()]          # only admin
        return [IsAuthenticated()]          # both roles
    @action(detail=False, methods=['get'])
    def all(self, request):
        assets = Asset.objects.all()
        serializer = self.get_serializer(assets, many=True)
        return Response(serializer.data)


class TicketViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer
    def get_permissions(self):
        if self.action in ['destroy']:
            return [IsAdminRole()]          # only admin can delete
        return [IsAuthenticated()]          # both can view/create
class AssignmentViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Assignment.objects.all()
    serializer_class = AssignmentSerializer
    def get_permissions(self):
        if self.action in ['create', 'destroy']:
            return [IsAdminRole()]          # only admin can assign/delete
        return [IsAuthenticated()]  
    def perform_create(self, serializer):
        assignment = serializer.save()

        assignment.asset.status = "assigned"
        assignment.asset.save()




class InventoryViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = InventoryItem.objects.all()
    serializer_class = InventorySerializer
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdminRole()]          # only admin
        return [IsAuthenticated()]  
class UserViewSet(viewsets.ReadOnlyModelViewSet):  
    permission_classes = [IsAdminRole] 
    queryset = User.objects.all()
    serializer_class = UserSerializer

class DashboardViewSet(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        data = {
            "total_assets": Asset.objects.count(),
            "total_inventory": InventoryItem.objects.count(),
            "assigned_assets": Asset.objects.filter(status__iexact="assigned").count(),
            "open_tickets": Ticket.objects.filter(status__iexact="open").count(),
        }
        return Response(data)
class CustomLoginView(TokenObtainPairView):
    serializer_class = CustomTokenSerializer
