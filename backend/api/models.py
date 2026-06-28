from django.db import models
from django.utils import timezone
from django.utils.text import slugify

class ClubDetail(models.Model):
    president_name = models.CharField(max_length=100)
    president_photo = models.ImageField(upload_to='club/', blank=True, null=True)
    president_message = models.TextField()
    secretary_name = models.CharField(max_length=100)
    secretary_photo = models.ImageField(upload_to='club/', blank=True, null=True)
    secretary_message = models.TextField()
    phone = models.CharField(max_length=20)
    email = models.EmailField()
    address = models.TextField()
    map_embed_url = models.TextField(blank=True, null=True, help_text="Google Maps Embed URL iframe src value only")

    def __str__(self):
        return "Royal Sports Club Details"

    class Meta:
        verbose_name = "Club Detail"
        verbose_name_plural = "Club Details"

class Sport(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True, blank=True)
    description = models.TextField()
    schedule = models.TextField(help_text="Days and timings, e.g., Mon-Fri: 6:00 AM - 9:00 AM")
    image = models.ImageField(upload_to='sports/')
    order = models.IntegerField(default=0)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['order']

class Coach(models.Model):
    name = models.CharField(max_length=100)
    specialty = models.CharField(max_length=100, help_text="e.g. Head Tennis Coach")
    bio = models.TextField()
    image = models.ImageField(upload_to='coaches/')
    experience_years = models.IntegerField()

    def __str__(self):
        return f"{self.name} - {self.specialty}"

    class Meta:
        verbose_name_plural = "Coaches"

class NewsUpdate(models.Model):
    CATEGORY_CHOICES = [
        ('news', 'News & Announcement'),
        ('tournament', 'Tournament Details'),
        ('update', 'General Club Update'),
    ]
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, blank=True)
    content = models.TextField()
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='news')
    date_posted = models.DateField(default=timezone.now)
    image = models.ImageField(upload_to='news/', blank=True, null=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['-date_posted']

class MembershipPlan(models.Model):
    name = models.CharField(max_length=100)
    price = models.CharField(max_length=50, help_text="e.g. ₹1,500 / Month")
    duration = models.CharField(max_length=50, help_text="e.g. Monthly, Quarterly, Annually")
    features = models.TextField(help_text="Enter features separated by newlines")

    def get_features_list(self):
        return [f.strip() for f in self.features.split('\n') if f.strip()]

    def __str__(self):
        return f"{self.name} ({self.price})"

class Inquiry(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    sport = models.CharField(max_length=100)
    message = models.TextField(blank=True)
    date_submitted = models.DateTimeField(auto_now_add=True)
    resolved = models.BooleanField(default=False)

    def __str__(self):
        return f"Inquiry from {self.name} for {self.sport}"

    class Meta:
        verbose_name_plural = "Inquiries"

class GalleryImage(models.Model):
    title = models.CharField(max_length=100, blank=True)
    image = models.ImageField(upload_to='gallery/')
    upload_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title or f"Gallery Image {self.id}"

