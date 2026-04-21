from rest_framework import serializers
from .models import Asset, Ticket, Assignment
from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import InventoryItem
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
User = get_user_model()


# 🔹 Asset Serializer
class AssetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Asset
        fields = '__all__'


# 🔹 Ticket Serializer
class TicketSerializer(serializers.ModelSerializer):
    asset = serializers.PrimaryKeyRelatedField(queryset=Asset.objects.all())
    technician = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        required=False,
        allow_null=True
    )

    asset_name = serializers.CharField(source="asset.name", read_only=True)
    technician_name = serializers.CharField(source="technician.username", read_only=True)

    class Meta:
        model = Ticket
        fields = '__all__'

# 🔹 Assignment Serializer 
class AssignmentSerializer(serializers.ModelSerializer):
    asset_name = serializers.CharField(source='asset.name', read_only=True)
    employee_name = serializers.CharField(source='employee.username', read_only=True)

    class Meta:
        model = Assignment
        fields = '__all__'


class InventorySerializer(serializers.ModelSerializer):
    class Meta:
        model = InventoryItem
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']

class CustomTokenSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        data['role'] = self.user.role          # adds role to response
        data['username'] = self.user.username  # adds username to response
        data['id'] = self.user.id              # adds id to response
        return data