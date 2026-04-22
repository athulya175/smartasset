from django.core.management.base import BaseCommand
from users.models import User

class Command(BaseCommand):
    def handle(self, *args, **kwargs):
        users = [
            ('admin1', 'Admin@123', 'admin'),
            ('admin2', 'Admin@456', 'admin'),
            ('user1', 'User@123', 'user'),
            ('user2', 'User@456', 'user'),
        ]
        for username, password, role in users:
            if not User.objects.filter(username=username).exists():
                u = User.objects.create_user(username=username, password=password)
                u.role = role
                u.save()
                self.stdout.write(f'Created {username}')