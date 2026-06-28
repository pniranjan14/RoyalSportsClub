import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'rsc_backend.settings')
django.setup()

from api.models import ClubDetail, Sport, Coach, NewsUpdate, MembershipPlan, GalleryImage

def seed_database():
    print("Flushing existing database records...")
    ClubDetail.objects.all().delete()
    Sport.objects.all().delete()
    Coach.objects.all().delete()
    MembershipPlan.objects.all().delete()
    NewsUpdate.objects.all().delete()
    GalleryImage.objects.all().delete()

    print("Starting database seeding with real Royal Sports Club, Ettumanoor details...")

    # 1. Seed Club Detail
    ClubDetail.objects.create(
        president_name='Abey Abraham',
        president_message='Welcome to Royal Sports Club, Ettumanoor. Established in October 2010, our primary mission has always been to foster a vibrant sporting culture in Kottayam. By offering professional training and quality sports facilities, we provide a platform for aspiring athletes to reach national and international levels of success.',
        secretary_name='G. Prasanth',
        secretary_message='Sports build discipline, teamwork, and healthy physical habits. At RSC, we work to cultivate shuttle badminton, football, and athletic talent. Through our association with the Kottayam District Badminton Association (KDBSA), we guide students towards excellence.',
        phone='+91 94473 02176',
        email='gprasanthsupriya@gmail.com',
        address='Room No. 8/22, Salkara Buildings, Temple Road, Ettumanoor P.O., Kottayam District, Kerala, PIN 686631'
    )
    print("Seeded real Club Details.")

    # 2. Seed Sports
    sports_data = [
        { 'name': 'Shuttle Badminton Coaching', 'description': 'Our primary focus. We offer certified professional badminton coaching for children and youth under Kottayam District Badminton Association guidelines. Ideal for developing tactical badminton skills.', 'schedule': 'Mon-Sat: 6:00 AM - 9:00 AM, 4:00 PM - 8:00 PM', 'order': 1, 'image': 'sports/placeholder_badminton.jpg' },
        { 'name': 'Football turf & Training', 'description': 'Progressive soccer drills, technical training, and matches on our high-quality turf area for kids and youth.', 'schedule': 'Wed, Fri, Sat: 4:30 PM - 6:30 PM', 'order': 2, 'image': 'sports/placeholder_football.jpg' },
        { 'name': 'Cricket Academy Nets', 'description': 'Cricket bowling and batting practices with professional equipment and dedicated coaching staff.', 'schedule': 'Tue, Thu: 4:00 PM - 6:30 PM', 'order': 3, 'image': 'sports/placeholder_cricket.jpg' },
        { 'name': 'Tennis Coaching Programs', 'description': 'Professional lessons for tennis enthusiasts, focused on technical shots, stamina building, and match coordination.', 'schedule': 'Mon, Wed, Fri: 6:30 AM - 8:30 AM', 'order': 4, 'image': 'sports/placeholder_tennis.jpg' }
    ]
    
    # Ensure media directory exists
    os.makedirs('media/sports', exist_ok=True)
    
    for s in sports_data:
        placeholder_path = os.path.join('media', s['image'])
        if not os.path.exists(placeholder_path):
            with open(placeholder_path, 'wb') as f:
                f.write(b'GIF89a\x01\x00\x01\x00\x80\x00\x00\xff\xff\xff\x00\x00\x00!\xf9\x04\x01\x00\x00\x00\x00,\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02\x02D\x01\x00;')
        
        Sport.objects.create(
            name=s['name'],
            description=s['description'],
            schedule=s['schedule'],
            order=s['order'],
            image=s['image']
        )
    print("Seeded real Sports.")

    # 3. Seed Coaches
    coaches_data = [
        { 'name': 'G. Prasanth', 'specialty': 'Head Badminton Coach & Secretary', 'bio': 'Certified badminton trainer with years of coaching experience. Serves as KDBSA committee member and develops national-grade shuttle players.', 'experience_years': 12, 'image': 'coaches/coach_prasanth.jpg' },
        { 'name': 'Raju K. D.', 'specialty': 'Sports Director & Treasurer', 'bio': 'Expert in youth physical conditioning, managing club facilities, and coordinating local tournaments.', 'experience_years': 10, 'image': 'coaches/coach_raju.jpg' }
    ]
    
    os.makedirs('media/coaches', exist_ok=True)
    
    for c in coaches_data:
        placeholder_path = os.path.join('media', c['image'])
        if not os.path.exists(placeholder_path):
            with open(placeholder_path, 'wb') as f:
                f.write(b'GIF89a\x01\x00\x01\x00\x80\x00\x00\xff\xff\xff\x00\x00\x00!\xf9\x04\x01\x00\x00\x00\x00,\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02\x02D\x01\x00;')
        
        Coach.objects.create(
            name=c['name'],
            specialty=c['specialty'],
            bio=c['bio'],
            experience_years=c['experience_years'],
            image=c['image']
        )
    print("Seeded real Coaches.")

    # 4. Seed Membership Plans
    plans_data = [
        { 'name': 'Standard Monthly Pass', 'price': 'Inquire at Reception', 'duration': 'Month', 'features': 'Access to Shuttle Badminton court\nProfessional coaching availability\nParticipation in district leagues\nStandard physical fitness drills' },
        { 'name': 'Elite Shuttle Program', 'price': 'Inquire at Reception', 'duration': 'Month', 'features': 'Daily dedicated court timings\nIndividualized stroke correction analysis\nTournament preparation clinics\nAffiliated KDBSA match entries\nDirect mentorship from G. Prasanth' },
        { 'name': 'Family Sports Plan', 'price': 'Inquire at Reception', 'duration': 'Year', 'features': 'Access for up to 4 family members\nFlexible coaching slots\nIncludes badminton and turf football access\nInvites to club annual championships' }
    ]
    for p in plans_data:
        MembershipPlan.objects.create(
            name=p['name'],
            price=p['price'],
            duration=p['duration'],
            features=p['features']
        )
    print("Seeded real Membership Plans.")

    # 5. Seed News/Tournaments
    news_data = [
        { 'title': 'Kottayam District Shuttle Badminton Selection trials', 'content': 'RSC Ettumanoor is hosting the selection trials for juniors and sub-juniors. Winners will represent Kottayam in State Championships. Registrations are free. Join us and showcase your badminton talent!', 'category': 'tournament', 'image': 'news/selection_trials.jpg' },
        { 'title': 'RSC Ettumanoor Summer Camp 2026', 'content': 'Announcing our intensive summer badminton training camp. Focus areas: serve correction, footwork speed, defensive drops, and cardiovascular stamina. Specialized coaching groups for all age divisions.', 'category': 'news', 'image': 'news/summer_camp.jpg' }
    ]
    
    os.makedirs('media/news', exist_ok=True)
    
    for n in news_data:
        placeholder_path = os.path.join('media', n['image'])
        if not os.path.exists(placeholder_path):
            with open(placeholder_path, 'wb') as f:
                f.write(b'GIF89a\x01\x00\x01\x00\x80\x00\x00\xff\xff\xff\x00\x00\x00!\xf9\x04\x01\x00\x00\x00\x00,\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02\x02D\x01\x00;')
        
        NewsUpdate.objects.create(
            title=n['title'],
            content=n['content'],
            category=n['category'],
            image=n['image']
        )
    print("Seeded real News/Tournaments Updates.")

    # 6. Seed Gallery
    gallery_data = [
        { 'title': 'KDBSA Affiliated Matches', 'image': 'gallery/gal1.jpg' },
        { 'title': 'Shuttle Practice Sessions', 'image': 'gallery/gal2.jpg' },
        { 'title': 'Ettumanoor Badminton Camp', 'image': 'gallery/gal3.jpg' },
        { 'title': 'Executive Committee Board', 'image': 'gallery/gal4.jpg' }
    ]
    
    os.makedirs('media/gallery', exist_ok=True)
    
    for g in gallery_data:
        placeholder_path = os.path.join('media', g['image'])
        if not os.path.exists(placeholder_path):
            with open(placeholder_path, 'wb') as f:
                f.write(b'GIF89a\x01\x00\x01\x00\x80\x00\x00\xff\xff\xff\x00\x00\x00!\xf9\x04\x01\x00\x00\x00\x00,\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02\x02D\x01\x00;')
        
        GalleryImage.objects.create(
            title=g['title'],
            image=g['image']
        )
    print("Seeded real Gallery Images.")

    print("Database seeding completed successfully with real RSC Ettumanoor data!")

if __name__ == '__main__':
    seed_database()
