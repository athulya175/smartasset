

from rest_framework.routers import DefaultRouter
from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    TicketViewSet, AssetViewSet, AssignmentViewSet,
    InventoryViewSet, UserViewSet, DashboardViewSet,
    CustomLoginView
)

router = DefaultRouter()
router.register(r'assets', AssetViewSet)
router.register(r'tickets', TicketViewSet)
router.register(r'assignments', AssignmentViewSet)
router.register(r'inventory', InventoryViewSet)
router.register(r'users', UserViewSet)

urlpatterns = [
    path('login/', CustomLoginView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('dashboard/', DashboardViewSet.as_view()),
] + router.urls