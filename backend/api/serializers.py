from rest_framework import serializers
from .models import ClubDetail, Sport, Coach, NewsUpdate, MembershipPlan, Inquiry, GalleryImage

class ClubDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClubDetail
        fields = '__all__'

class SportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sport
        fields = '__all__'

class CoachSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coach
        fields = '__all__'

class NewsUpdateSerializer(serializers.ModelSerializer):
    category_display = serializers.CharField(source='get_category_display', read_only=True)

    class Meta:
        model = NewsUpdate
        fields = '__all__'

class MembershipPlanSerializer(serializers.ModelSerializer):
    features_list = serializers.SerializerMethodField()

    class Meta:
        model = MembershipPlan
        fields = ['id', 'name', 'price', 'duration', 'features', 'features_list']

    def get_features_list(self, obj):
        return obj.get_features_list()

class InquirySerializer(serializers.ModelSerializer):
    class Meta:
        model = Inquiry
        fields = '__all__'

class GalleryImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = GalleryImage
        fields = '__all__'
