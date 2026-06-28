from django.contrib import admin
from .models import ClubDetail, Sport, Coach, NewsUpdate, MembershipPlan, Inquiry, GalleryImage

@admin.register(ClubDetail)
class ClubDetailAdmin(admin.ModelAdmin):
    list_display = ('president_name', 'secretary_name', 'phone', 'email')
    
    # Restrict creation of more than one detail entry
    def has_add_permission(self, request):
        if self.model.objects.exists():
            return False
        return super().has_add_permission(request)

@admin.register(Sport)
class SportAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'schedule', 'order')
    prepopulated_fields = {'slug': ('name',)}
    list_editable = ('order',)
    search_fields = ('name',)

@admin.register(Coach)
class CoachAdmin(admin.ModelAdmin):
    list_display = ('name', 'specialty', 'experience_years')
    search_fields = ('name', 'specialty')

@admin.register(NewsUpdate)
class NewsUpdateAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'date_posted')
    list_filter = ('category', 'date_posted')
    prepopulated_fields = {'slug': ('title',)}
    search_fields = ('title', 'content')

@admin.register(MembershipPlan)
class MembershipPlanAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'duration')
    search_fields = ('name',)

@admin.register(Inquiry)
class InquiryAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'phone', 'sport', 'date_submitted', 'resolved')
    list_filter = ('resolved', 'sport', 'date_submitted')
    search_fields = ('name', 'email', 'phone', 'message')
    list_editable = ('resolved',)
    readonly_fields = ('date_submitted',)

@admin.register(GalleryImage)
class GalleryImageAdmin(admin.ModelAdmin):
    list_display = ('title', 'upload_date')
    readonly_fields = ('upload_date',)

