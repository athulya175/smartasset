from django.contrib import admin
from .models import Asset, InventoryItem, Assignment

admin.site.register(Asset)
admin.site.register(InventoryItem)
admin.site.register(Assignment)
