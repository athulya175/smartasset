from django.db import models
from asset.models import Asset

class Ticket(models.Model):
    asset = models.ForeignKey(Asset, on_delete=models.CASCADE)
    issue = models.TextField()
    status = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.issue