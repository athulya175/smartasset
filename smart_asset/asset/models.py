from django.db import models
from django.conf import settings
from django.contrib.auth.models import User
User = settings.AUTH_USER_MODEL

class Asset(models.Model):
    name = models.CharField(max_length=200)
    serial_number = models.CharField(max_length=100, blank=True, null=True)
    asset_type = models.CharField(max_length=100)
    purchase_date = models.DateField()

    status = models.CharField(
        max_length=20,
        choices=[
            ('available', 'Available'),
            ('assigned', 'Assigned'),
        ],
        default='available'
    )

    def __str__(self):
        return self.name


class Assignment(models.Model):
    asset = models.ForeignKey(Asset, on_delete=models.CASCADE)
    employee = models.ForeignKey(User, on_delete=models.CASCADE)
    assigned_date = models.DateField(auto_now_add=True)
    date_returned = models.DateField(null=True, blank=True)

    def __str__(self):
        return f"{self.asset} -> {self.employee}"

class InventoryItem(models.Model):
    name = models.CharField(max_length=200)
    quantity = models.IntegerField()
    threshold = models.IntegerField()

    def __str__(self):
        return self.name
class Ticket(models.Model):
    asset = models.ForeignKey(
        Asset,
        on_delete=models.CASCADE,
        related_name="tickets"
    )

    issue = models.TextField()

    status = models.CharField(
        max_length=50,
        default="Open"
    )

    technician = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )
    def __str__(self):
        return f"{self.asset.name} - {self.issue[:20]}"