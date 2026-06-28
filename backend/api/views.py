from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import ClubDetail, Sport, Coach, NewsUpdate, MembershipPlan, Inquiry, GalleryImage
from .serializers import (
    ClubDetailSerializer, SportSerializer, CoachSerializer,
    NewsUpdateSerializer, MembershipPlanSerializer, InquirySerializer,
    GalleryImageSerializer
)

class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_staff

class ClubDetailViewSet(viewsets.ModelViewSet):
    queryset = ClubDetail.objects.all()
    serializer_class = ClubDetailSerializer
    permission_classes = [IsAdminOrReadOnly]

    # Helper endpoint to get the active detail directly without looking up an ID
    @action(detail=False, methods=['get'])
    def active(self, request):
        detail = ClubDetail.objects.first()
        if detail:
            serializer = self.get_serializer(detail)
            return Response(serializer.data)
        return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)

class SportViewSet(viewsets.ModelViewSet):
    queryset = Sport.objects.all()
    serializer_class = SportSerializer
    permission_classes = [IsAdminOrReadOnly]
    lookup_field = 'slug'

class CoachViewSet(viewsets.ModelViewSet):
    queryset = Coach.objects.all()
    serializer_class = CoachSerializer
    permission_classes = [IsAdminOrReadOnly]

class NewsUpdateViewSet(viewsets.ModelViewSet):
    queryset = NewsUpdate.objects.all()
    serializer_class = NewsUpdateSerializer
    permission_classes = [IsAdminOrReadOnly]
    lookup_field = 'slug'

    def get_queryset(self):
        queryset = NewsUpdate.objects.all()
        category = self.request.query_params.get('category', None)
        if category is not None:
            queryset = queryset.filter(category=category)
        return queryset

class MembershipPlanViewSet(viewsets.ModelViewSet):
    queryset = MembershipPlan.objects.all()
    serializer_class = MembershipPlanSerializer
    permission_classes = [IsAdminOrReadOnly]

class GalleryImageViewSet(viewsets.ModelViewSet):
    queryset = GalleryImage.objects.all()
    serializer_class = GalleryImageSerializer
    permission_classes = [IsAdminOrReadOnly]

class InquiryViewSet(viewsets.ModelViewSet):
    queryset = Inquiry.objects.all()
    serializer_class = InquirySerializer

    def get_permissions(self):
        if self.action == 'create':
            permission_classes = [permissions.AllowAny]
        else:
            permission_classes = [permissions.IsAdminUser]
        return [permission() for permission in permission_classes]
