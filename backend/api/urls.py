from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ClubDetailViewSet, SportViewSet, CoachViewSet,
    NewsUpdateViewSet, MembershipPlanViewSet, InquiryViewSet,
    GalleryImageViewSet
)

router = DefaultRouter()
router.register(r'club-details', ClubDetailViewSet, basename='clubdetails')
router.register(r'sports', SportViewSet, basename='sports')
router.register(r'coaches', CoachViewSet, basename='coaches')
router.register(r'news', NewsUpdateViewSet, basename='news')
router.register(r'plans', MembershipPlanViewSet, basename='plans')
router.register(r'gallery', GalleryImageViewSet, basename='gallery')
router.register(r'inquiries', InquiryViewSet, basename='inquiries')

urlpatterns = [
    path('', include(router.urls)),
]
