'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Calendar, Phone, Mail, Award, CheckCircle, ChevronRight,
  TrendingUp, Users, Target, Activity, Send, RefreshCw, X, ChevronLeft
} from 'lucide-react';
import { api, API_BASE, Sport, Coach, NewsUpdate, MembershipPlan, GalleryImage, ClubDetail } from '@/lib/api';
import FadeUp from './animations/FadeUp';
import StaggerContainer from './animations/StaggerContainer';

gsap.registerPlugin(ScrollTrigger);

interface HomePageClientProps {
  initialSports: Sport[];
  initialCoaches: Coach[];
  initialNews: NewsUpdate[];
  initialPlans: MembershipPlan[];
  initialGallery: GalleryImage[];
  initialClubDetails: ClubDetail | null;
}

// Rich default mock data for fallback
const MOCK_SPORTS: Sport[] = [
  { id: 1, name: 'Shuttle Badminton Coaching', slug: 'shuttle-badminton-coaching', description: 'Our primary focus. We offer certified professional badminton coaching for children and youth under Kottayam District Badminton Association guidelines. Ideal for developing tactical badminton skills.', schedule: 'Mon-Sat: 6:00 AM - 9:00 AM, 4:00 PM - 8:00 PM', image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&q=80&w=800', order: 1 },
  { id: 2, name: 'Football turf & Training', slug: 'football-turf-training', description: 'Progressive soccer drills, technical training, and matches on our high-quality turf area for kids and youth.', schedule: 'Wed, Fri, Sat: 4:30 PM - 6:30 PM', image: 'https://images.unsplash.com/photo-1508083460982-28b3207400d2?auto=format&fit=crop&q=80&w=800', order: 2 },
  { id: 3, name: 'Cricket Academy Nets', slug: 'cricket-academy-nets', description: 'Cricket bowling and batting practices with professional equipment and dedicated coaching staff.', schedule: 'Tue, Thu: 4:00 PM - 6:30 PM', image: 'https://images.unsplash.com/photo-1607734834519-d8576ae60ea6?auto=format&fit=crop&q=80&w=800', order: 3 },
  { id: 4, name: 'Tennis Coaching Programs', slug: 'tennis-coaching-programs', description: 'Professional lessons for tennis enthusiasts, focused on technical shots, stamina building, and match coordination.', schedule: 'Mon, Wed, Fri: 6:30 AM - 8:30 AM', image: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&q=80&w=800', order: 4 }
];

const MOCK_COACHES: Coach[] = [
  { id: 1, name: 'G. Prasanth', specialty: 'Head Badminton Coach & Secretary', bio: 'Certified badminton trainer with years of coaching experience. Serves as KDBSA committee member and develops national-grade shuttle players.', image: '/images/prasanth.jpg', experience_years: 12 },
  { id: 2, name: 'Raju K. D.', specialty: 'Sports Director & Treasurer', bio: 'Expert in youth physical conditioning, managing club facilities, and coordinating local tournaments.', image: '/images/raju.jpg', experience_years: 10 }
];

const MOCK_NEWS: NewsUpdate[] = [
  { id: 1, title: 'Kottayam District Shuttle Badminton Selection trials', slug: 'selection-trials', content: 'RSC Ettumanoor is hosting the selection trials for juniors and sub-juniors. Winners will represent Kottayam in State Championships. Registrations are free. Join us and showcase your badminton talent!', category: 'tournament', category_display: 'Tournament Details', date_posted: '2026-06-05', image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=800' },
  { id: 2, title: 'RSC Ettumanoor Summer Camp 2026', slug: 'summer-camp', content: 'Announcing our intensive summer badminton training camp. Focus areas: serve correction, footwork speed, defensive drops, and cardiovascular stamina. Specialized coaching groups for all age divisions.', category: 'news', category_display: 'News & Announcement', date_posted: '2026-06-01', image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&q=80&w=800' }
];

const MOCK_PLANS: MembershipPlan[] = [
  { id: 1, name: 'Standard Monthly Pass', price: 'Inquire at Reception', duration: 'Month', features: 'Access to Shuttle Badminton court\nProfessional coaching availability\nParticipation in district leagues\nStandard physical fitness drills', features_list: ['Access to Shuttle Badminton court', 'Professional coaching availability', 'Participation in district leagues', 'Standard physical fitness drills'] },
  { id: 2, name: 'Elite Shuttle Program', price: 'Inquire at Reception', duration: 'Month', features: 'Daily dedicated court timings\nIndividualized stroke correction analysis\nTournament preparation clinics\nAffiliated KDBSA match entries\nDirect mentorship from G. Prasanth', features_list: ['Daily dedicated court timings', 'Individualized stroke correction analysis', 'Tournament preparation clinics', 'Affiliated KDBSA match entries', 'Direct mentorship from G. Prasanth'] },
  { id: 3, name: 'Family Sports Plan', price: 'Inquire at Reception', duration: 'Year', features: 'Access for up to 4 family members\nFlexible coaching slots\nIncludes badminton and turf football access\nInvites to club annual championships', features_list: ['Access for up to 4 family members', 'Flexible coaching slots', 'Includes badminton and turf football access', 'Invites to club annual championships'] }
];

const MOCK_GALLERY: GalleryImage[] = [
  { id: 1, title: 'KDBSA Affiliated Matches', image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&q=80&w=800', upload_date: '2026-05-15' },
  { id: 2, title: 'Shuttle Practice Sessions', image: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&q=80&w=800', upload_date: '2026-05-20' },
  { id: 3, title: 'Ettumanoor Badminton Camp', image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&q=80&w=800', upload_date: '2026-05-25' },
  { id: 4, title: 'Executive Committee Board', image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=800', upload_date: '2026-06-01' }
];

const MOCK_CLUB_DETAILS: ClubDetail = {
  id: 1,
  president_name: 'Abey Abraham',
  president_photo: '/images/president.jpg',
  president_message: 'Welcome to Royal Sports Club, Ettumanoor. Established in October 2010, our primary mission has always been to foster a vibrant sporting culture in Kottayam. By offering professional training and quality sports facilities, we provide a platform for aspiring athletes to reach national and international levels of success.',
  secretary_name: 'G. Prasanth',
  secretary_photo: '/images/prasanth.jpg',
  secretary_message: 'Sports build discipline, teamwork, and healthy physical habits. At RSC, we work to cultivate shuttle badminton, football, and athletic talent. Through our association with the Kottayam District Badminton Association (KDBSA), we guide students towards excellence.',
  phone: '+91 94473 02176',
  email: 'gprasanthsupriya@gmail.com',
  address: 'Room No. 8/22, Salkara Buildings, Temple Road, Ettumanoor P.O., Kottayam District, Kerala, PIN 686631',
  map_embed_url: null
};


export default function HomePageClient({
  initialSports,
  initialCoaches,
  initialNews,
  initialPlans,
  initialGallery,
  initialClubDetails
}: HomePageClientProps) {
  // Use DB data if available, else fall back to gorgeous mocks
  const sports = initialSports.length > 0 ? initialSports : MOCK_SPORTS;
  const coaches = initialCoaches.length > 0 ? initialCoaches : MOCK_COACHES;
  const news = initialNews.length > 0 ? initialNews : MOCK_NEWS;
  const plans = initialPlans.length > 0 ? initialPlans : MOCK_PLANS;
  const gallery = initialGallery.length > 0 ? initialGallery : MOCK_GALLERY;
  const clubDetails = initialClubDetails || MOCK_CLUB_DETAILS;

  // Helper to resolve absolute URLs for assets and bypass 1x1 seeded placeholders
  const getFullImageUrl = (path: string | null): string => {
    if (!path) return '';
    if (path.startsWith('http') || path.startsWith('/images/')) return path;
    if (path.startsWith('/')) return `${API_BASE}${path}`;
    return `${API_BASE}/${path}`;
  };

  const getSportImage = (sport: Sport): string => {
    if (!sport.image || sport.image.includes('placeholder') || sport.image.includes('gif')) {
      const mock = MOCK_SPORTS.find(s => s.slug === sport.slug || s.name.toLowerCase() === sport.name.toLowerCase());
      return (mock && mock.image) ? mock.image : 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&q=80&w=800';
    }
    return getFullImageUrl(sport.image);
  };

  const getCoachImage = (coach: Coach): string => {
    if (!coach.image || coach.image.includes('placeholder') || coach.image.includes('coach_')) {
      const mock = MOCK_COACHES.find(c => c.name === coach.name);
      return (mock && mock.image) ? mock.image : 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400';
    }
    return getFullImageUrl(coach.image);
  };

  const getNewsImage = (item: NewsUpdate): string => {
    if (!item.image || item.image.includes('placeholder') || item.image.includes('news/') || item.image.includes('gif')) {
      const mock = MOCK_NEWS.find(n => n.slug === item.slug);
      return (mock && mock.image) ? mock.image : 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=800';
    }
    return getFullImageUrl(item.image);
  };

  const getGalleryImage = (img: GalleryImage): string => {
    if (!img.image || img.image.includes('placeholder') || img.image.includes('gallery/') || img.image.includes('gif')) {
      const mock = MOCK_GALLERY.find(g => g.title === img.title);
      return (mock && mock.image) ? mock.image : 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&q=80&w=800';
    }
    return getFullImageUrl(img.image);
  };

  // Refs for GSAP scroll animations
  const heroRef = useRef<HTMLDivElement>(null);
  const heroBgRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  // States
  const [selectedSport, setSelectedSport] = useState<Sport | null>(null);
  const [newsFilter, setNewsFilter] = useState<string>('all');
  const [inquiryForm, setInquiryForm] = useState({
    name: '',
    email: '',
    phone: '',
    sport: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  // GSAP scroll trigger for parallax hero background
  useEffect(() => {
    if (heroBgRef.current && heroRef.current) {
      gsap.to(heroBgRef.current, {
        yPercent: 30,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      });
    }

    // GSAP clean counters for statistics
    if (statsRef.current) {
      const statsElements = statsRef.current.querySelectorAll('.stat-counter');
      statsElements.forEach((el) => {
        const targetValue = parseInt(el.getAttribute('data-target') || '0', 10);
        gsap.fromTo(el, 
          { textContent: '0' },
          {
            textContent: targetValue.toString(),
            duration: 2,
            snap: { textContent: 1 },
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              toggleActions: 'play none none none'
            }
          }
        );
      });
    }
  }, []);

  // Form submission handler
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryForm.name || !inquiryForm.email || !inquiryForm.phone || !inquiryForm.sport) {
      setFormStatus('error');
      return;
    }

    setFormStatus('loading');
    const success = await api.submitInquiry(inquiryForm);
    if (success) {
      setFormStatus('success');
      setInquiryForm({ name: '', email: '', phone: '', sport: '', message: '' });
      setTimeout(() => setFormStatus('idle'), 5000);
    } else {
      setFormStatus('error');
      setTimeout(() => setFormStatus('idle'), 4000);
    }
  };

  const handleChoosePlan = (planName: string) => {
    setInquiryForm(prev => ({
      ...prev,
      message: `Hi, I am interested in joining the "${planName}" membership plan.`
    }));
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Filtered news items
  const filteredNews = newsFilter === 'all' 
    ? news 
    : news.filter(item => item.category === newsFilter);

  return (
    <div id="home" className="relative font-poppins bg-white text-gray-800">
      
      {/* 1. HERO SECTION (Parallax fullscreen banner styled like rsckochi.com) */}
      <section ref={heroRef} className="relative min-h-[95vh] w-full flex flex-col justify-center">
        {/* Background container with overflow-hidden to prevent parallax leak */}
        <div className="absolute inset-0 overflow-hidden z-0">
          {/* Parallax Background matching rsckochi.com */}
          <div 
            ref={heroBgRef}
            className="absolute inset-0 brightness-35"
          >
            <img 
              alt="Hero Background Desktop" 
              src="/images/Hero-Image.webp" 
              className="hidden md:block w-full h-full object-cover object-center" 
            />
            <img 
              alt="Hero Background Mobile" 
              src="/images/Hero-Section-mobile.webp" 
              className="block md:hidden w-full h-full object-cover object-center" 
            />
          </div>
          {/* Dark Linear/Radial Overlay */}
          <div className="absolute inset-0 z-10 hero-overlay" />
        </div>

        {/* Hero Content Grid (matching rsckochi.com layout) */}
        <div className="relative z-20 mx-auto px-4 lg:px-[120px] py-32 w-full">
          <div className="flex flex-col md:flex-row items-center md:items-start justify-between">
            <div className="w-full md:w-2/3 lg:w-1/2 xl:w-3/4 mt-3 text-white sm:pr-10 md:pr-[14rem] lg:pr-24 xl:pr-24 2xl:pr-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="mb-4"
              >
                <span className="px-4 py-1.5 bg-[#D50C3A]/20 border border-[#D50C3A]/30 text-white font-extrabold rounded-full text-xs uppercase tracking-widest">
                  ROYAL SPORTS CLUB ETTUMANOOR
                </span>
              </motion.div>
              <FadeUp>
                <h1 className="text-[2.4rem] md:text-[2rem] lg:text-[2.1rem] xl:text-[2.7rem] font-bold leading-[1] xl:leading-[1.2] uppercase font-montserrat text-white">
                  Shape your fitness with <br />
                  <span className="text-[#D50C3A]">Royal Sports Club</span>, Ettumanoor
                </h1>
              </FadeUp>
              <p className="mt-5 text-lg md:text-xs xl:text-xl text-[#FAFAFA] sm:pr-10 md:pr-[8rem] lg:pr-20 xl:pr-20 2xl:pr-16">
                Join Kottayam's premier sports academy with expert guidance under the Kottayam District Badminton Association.
              </p>
            </div>

            {/* Sportsman Cutout (matching rsckochi.com) */}
            <div className="relative mt-8 md:mt-0 flex justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="relative"
              >
                <img 
                  alt="Sportsman" 
                  loading="lazy" 
                  width="400" 
                  height="492" 
                  className="object-contain relative z-10 w-[280px] sm:w-[340px] md:w-[280px] lg:w-[360px] xl:w-[420px] h-auto drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)]" 
                  src="/images/sportsman-home.webp" 
                />
              </motion.div>
            </div>
          </div>
        </div>

        {/* Overlapping Facilities Banner (matching rsckochi.com) */}
        <div className="absolute bottom-8 left-0 right-0 z-30 max-w-7xl mx-auto px-6 md:px-12">
          <div className="bg-gray-950/90 backdrop-blur-md border border-gray-800 p-6 rounded-2xl shadow-2xl">
            <h5 className="text-xs text-gray-400 font-extrabold uppercase tracking-widest mb-4">Our Facilities</h5>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {sports.map((sport) => (
                <button
                  key={sport.id}
                  onClick={() => setSelectedSport(sport)}
                  className="flex items-center gap-3 bg-[#D50C3A] hover:bg-[#b00b30] text-white px-4 py-3 rounded-lg shadow-md transition-all duration-300 font-semibold text-xs uppercase tracking-wider text-left hover:scale-[1.02]"
                >
                  <Activity size={16} className="shrink-0" />
                  <span className="truncate">{sport.name.split(' ')[0]}</span>
                </button>
              ))}
              <button
                onClick={() => document.getElementById('sports')?.scrollIntoView({ behavior: 'smooth' })}
                className="flex items-center gap-3 bg-[#D50C3A] hover:bg-[#b00b30] text-white px-4 py-3 rounded-lg shadow-md transition-all duration-300 font-semibold text-xs uppercase tracking-wider hover:scale-[1.02]"
              >
                <ChevronRight size={16} className="shrink-0" />
                <span>View All</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. ABOUT US & LEGACY SECTION (matching rsckochi.com layout) */}
      <section id="about" className="bg-[#ffffff] py-[70px] border-b border-gray-100">
        <div className="px-4 md:px-8 lg:px-[80px] xl:px-[230px] grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: Image with Crimson Overlay */}
          <div className="lg:col-span-6 order-2 lg:order-1 relative flex justify-center">
            <div className="relative w-full max-w-[450px]">
              <img 
                src="/images/aboutus-home.webp" 
                alt="RSC Ettumanoor Facilities" 
                className="w-full h-auto rounded-[5px] object-cover shadow-lg" 
              />
              <div className="absolute bottom-0 left-0 bg-[#D50C3A] w-[90%] sm:w-[80%] md:w-[70%] p-6 sm:p-8 rounded-bl-[5px] max-w-full shadow-xl">
                <p className="text-white text-[1rem] font-normal leading-[1.7rem] mb-4 sm:mb-8">
                  Royal Sports Club, Ettumanoor (RSC) is one of Kottayam's most prominent sports and cultural institutions.
                </p>
                <button 
                  onClick={() => document.getElementById('sports')?.scrollIntoView({ behavior: 'smooth' })}
                  className="flex gap-2 items-center text-white text-[.9rem] font-semibold hover:translate-x-1 transition-transform"
                >
                  <span>Learn More</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Right: Legacy Description */}
          <div className="lg:col-span-6 order-1 lg:order-2 space-y-6">
            <div className="inline-flex items-center gap-2 bg-[#F2F2F2] rounded-[100px] px-3 py-1 border border-[#D50C3A]">
              <div className="w-3.5 h-3.5 bg-[#D50C3A] rounded-full"></div>
              <span className="text-gray-900 text-[.9rem] font-semibold leading-[1.7rem] uppercase">About Us</span>
            </div>

            <FadeUp>
              <h2 className="justify-start text-[#272727] text-[2.5rem] xl:text-[3.4rem] font-bold leading-[1] xl:leading-[4rem] my-auto uppercase font-montserrat">
                More Than Just a Sports Centre, <br />
                <span className="text-[#D50C3A]">It’s a Legacy</span>
              </h2>
            </FadeUp>

            <div className="text-[.9rem] text-justify text-gray-650 space-y-4">
              <p>
                <strong>Established in October 2010 and registered in 2015, the Royal Sports Club (RSC) in Ettumanoor</strong> has grown into a highly active sports training academy. Spread over Kottayam district, we aim to provide a comprehensive "launch-pad" for kids and youth to excel.
              </p>
              <p>
                RSC is affiliated with the <strong>Kottayam District Badminton (Shuttle) Association (KDBSA)</strong>, guiding players under official district curriculum standards.
              </p>
              <p>
                Our core vision centers on <strong>"Sports for Health, Discipline & Competition"</strong>. We maintain a balanced ecosystem offering recreational games for members alongside high-performance academies led by experienced certified coaches.
              </p>
            </div>

            {/* Statistics Row (matching rsckochi.com) */}
            <div className="mt-6 grid grid-cols-3 gap-8">
              <div className="border-t-2 border-[#D50C3A] pt-2">
                <h4 className="text-[2rem] font-bold text-gray-900 font-montserrat">2010</h4>
                <h6 className="text-[#272727] text-[0.9rem] font-semibold leading-[1.5rem] uppercase">Founded In</h6>
              </div>
              <div className="border-t-2 border-[#D50C3A] pt-2">
                <h4 className="text-[2rem] font-bold text-gray-900 font-montserrat">15+</h4>
                <h6 className="text-[#272727] text-[0.9rem] font-semibold leading-[1.5rem] uppercase">Years Service</h6>
              </div>
              <div className="border-t-2 border-[#D50C3A] pt-2">
                <h4 className="text-[2rem] font-bold text-gray-900 font-montserrat">4+</h4>
                <h6 className="text-[#272727] text-[0.9rem] font-semibold leading-[1.5rem] uppercase">Disciplines</h6>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. WHY CHOOSE US SECTION (matching rsckochi.com grey background + crimson hover cards) */}
      <section className="bg-[#FAFAFA] py-16 md:py-20 lg:py-24 px-4 md:px-8 lg:px-[80px] xl:px-[230px]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-[#F2F2F2] rounded-full px-3 py-1 mb-3 border border-[#D50C3A]">
              <span className="w-4 h-4 bg-[#D50C3A] rounded-full"></span>
              <span className="text-gray-900 text-sm font-semibold">Why Choose Us</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight uppercase font-montserrat">
              Why Athletes Choose RSC?
            </h2>
            <div className="w-full border-b-2 border-[#E5003A] mb-4"></div>
            <p className="text-gray-600 text-base md:text-[.9rem] leading-relaxed mb-6">
              Discover what makes Royal Sports Club, Ettumanoor the top destination for sports training and shuttle badminton in Kottayam.
            </p>
            
            <div className="relative rounded-xl overflow-hidden">
              <img 
                src="/images/why-choose-us-card.webp" 
                alt="Athlete at RSC" 
                className="w-full h-auto object-cover" 
              />
              <div className="absolute bottom-4 left-4 flex items-center gap-3 text-white p-3 bg-black/40 backdrop-blur-sm rounded-lg">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-300 flex items-center justify-center text-[10px] text-gray-800 font-bold">U1</div>
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-400 flex items-center justify-center text-[10px] text-gray-800 font-bold">U2</div>
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-[#D50C3A] flex items-center justify-center text-[10px] text-white font-bold">+</div>
                </div>
                <div>
                  <p className="text-lg font-bold leading-tight">1,200+</p>
                  <p className="text-sm">Active Members</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white text-gray-900 rounded-xl p-6 flex flex-col justify-between text-center items-center shadow-xl transition-all duration-300 group hover:bg-[#D50C3A] hover:text-white hover:-translate-y-1">
              <div className="w-16 h-16 bg-[#D50C3A] text-white rounded-lg flex items-center justify-center mb-3 transition-all duration-300 group-hover:bg-white group-hover:text-[#D50C3A]">
                <Users size={28} />
              </div>
              <h3 className="font-semibold text-xl my-6 mb-6">Certified Trainers</h3>
            </div>

            <div className="bg-white text-gray-900 rounded-xl p-6 flex flex-col justify-between text-center items-center shadow-xl transition-all duration-300 group hover:bg-[#D50C3A] hover:text-white hover:-translate-y-1">
              <div className="w-16 h-16 bg-[#D50C3A] text-white rounded-lg flex items-center justify-center mb-3 transition-all duration-300 group-hover:bg-white group-hover:text-[#D50C3A]">
                <Target size={28} />
              </div>
              <h3 className="font-semibold text-xl my-6 mb-6">Modern Sports Infrastructure</h3>
            </div>

            <div className="bg-white text-gray-900 rounded-xl p-6 flex flex-col justify-between text-center items-center shadow-xl transition-all duration-300 group hover:bg-[#D50C3A] hover:text-white hover:-translate-y-1">
              <div className="w-16 h-16 bg-[#D50C3A] text-white rounded-lg flex items-center justify-center mb-3 transition-all duration-300 group-hover:bg-white group-hover:text-[#D50C3A]">
                <Calendar size={28} />
              </div>
              <h3 className="font-semibold text-xl my-6 mb-6">Year-Round Coaching Camps</h3>
            </div>

            <div className="bg-white text-gray-900 rounded-xl p-6 flex flex-col justify-between text-center items-center shadow-xl transition-all duration-300 group hover:bg-[#D50C3A] hover:text-white hover:-translate-y-1">
              <div className="w-16 h-16 bg-[#D50C3A] text-white rounded-lg flex items-center justify-center mb-3 transition-all duration-300 group-hover:bg-white group-hover:text-[#D50C3A]">
                <Activity size={28} />
              </div>
              <h3 className="font-semibold text-xl my-6 mb-6">Easy Facility Access</h3>
            </div>
          </div>
        </div>
      </section>

      {/* 4. EXPLORE RSC - FACILITIES GRID (matching rsckochi.com layout and glass cards) */}
      <section id="sports" className="flex justify-center bg-white py-16">
        <div className="w-full px-4 md:px-8 lg:px-[80px] xl:px-[230px]">
          <div className="mb-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-[#F2F2F2] rounded-full px-3 py-1 mb-3 border border-[#D50C3A]">
                  <span className="w-4 h-4 bg-[#D50C3A] rounded-full"></span>
                  <span className="text-gray-900 text-sm font-semibold">Facilities</span>
                </div>
                <FadeUp>
                  <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight uppercase font-montserrat">Explore RSC</h2>
                </FadeUp>
              </div>
              <button 
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="mt-6 md:mt-0 flex items-center gap-3 bg-[#E5003A] hover:bg-[#c40032] text-white px-3 py-3 rounded-full font-semibold transition"
              >
                <span>Inquire for Admission</span>
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-black border border-black text-white">
                  <ChevronRight size={18} />
                </div>
              </button>
            </div>
            <div className="w-full border-b-2 border-[#E5003A] mt-4"></div>
          </div>

          {/* Facilities Grid */}
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {sports.map((sport) => (
              <div 
                key={sport.id}
                onClick={() => setSelectedSport(sport)}
                className="relative rounded-2xl overflow-hidden group shadow-md hover:shadow-xl transition-all duration-300 aspect-[3/4] cursor-pointer"
              >
                <img 
                  src={getSportImage(sport)} 
                  alt={sport.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                {/* Bottom Glass Card Overlay (matching rsckochi.com layout) */}
                <div className="absolute bottom-4 left-4 right-4 rounded-xl backdrop-blur-lg bg-white/25 flex items-center gap-2 justify-between px-4 py-3 transition-all duration-300 group-hover:bg-white/35">
                  <h3 className="text-white text-lg md:text-[.9rem] font-semibold leading-snug drop-shadow-sm font-montserrat">
                    {sport.name}
                  </h3>
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-black hover:bg-black/80 transition">
                    <ChevronRight size={18} className="text-white" />
                  </div>
                </div>
              </div>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* 4.5 TEAM MEMBERS (COACHES) SECTION */}
      <section id="coaches" className="py-24 bg-white border-t border-gray-100">
        <div className="px-4 md:px-8 lg:px-[80px] xl:px-[230px]">
          <div className="mb-12 text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-[#F2F2F2] rounded-full px-3 py-1 mb-3 border border-[#D50C3A]">
              <span className="w-4 h-4 bg-[#D50C3A] rounded-full"></span>
              <span className="text-gray-900 text-sm font-semibold">Our Team</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight uppercase font-montserrat">
              Professional Coaches
            </h2>
            <div className="w-full border-b-2 border-[#E5003A] mt-4"></div>
          </div>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            {coaches.map((coach) => (
              <div 
                key={coach.id}
                className="bg-gray-50 border border-gray-150 rounded-2xl overflow-hidden shadow-sm flex flex-col md:flex-row h-full hover:shadow-md transition-all duration-300"
              >
                <div className="md:w-1/3 h-64 md:h-full relative shrink-0">
                  <img 
                    src={getCoachImage(coach)} 
                    alt={coach.name} 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div className="p-6 md:p-8 flex flex-col justify-between flex-1">
                  <div>
                    <span className="text-[10px] font-bold text-[#D50C3A] uppercase tracking-widest bg-[#D50C3A]/10 px-2 py-1 rounded">
                      {coach.experience_years}+ Years Experience
                    </span>
                    <h3 className="text-xl font-bold text-gray-900 mt-3 font-montserrat">{coach.name}</h3>
                    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mt-1">{coach.specialty}</p>
                    <p className="text-xs text-gray-550 leading-relaxed mt-4 text-justify">{coach.bio}</p>
                  </div>
                </div>
              </div>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* 5. NEWS & TOURNAMENTS (Alternative filter blocks) */}
      <section id="news" className="py-24 bg-gray-50 border-t border-b border-gray-150 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 space-y-3">
            <span className="text-xs uppercase font-extrabold tracking-widest text-[#D50C3A]">Latest Announcements</span>
            <FadeUp>
              <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 uppercase font-montserrat">News & Events</h2>
            </FadeUp>
            <div className="w-16 h-1 bg-[#D50C3A] mx-auto rounded-full" />
          </div>

          {/* Categories filters */}
          <div className="flex justify-center space-x-3 mb-12 overflow-x-auto pb-2">
            <button 
              onClick={() => setNewsFilter('all')}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-full border transition-all ${
                newsFilter === 'all' 
                  ? 'bg-[#D50C3A] border-[#D50C3A] text-white' 
                  : 'bg-white border-gray-200 text-gray-500 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              All Updates
            </button>
            <button 
              onClick={() => setNewsFilter('tournament')}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-full border transition-all ${
                newsFilter === 'tournament' 
                  ? 'bg-[#D50C3A] border-[#D50C3A] text-white' 
                  : 'bg-white border-gray-200 text-gray-500 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              Tournaments
            </button>
            <button 
              onClick={() => setNewsFilter('news')}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-full border transition-all ${
                newsFilter === 'news' 
                  ? 'bg-[#D50C3A] border-[#D50C3A] text-white' 
                  : 'bg-white border-gray-200 text-gray-500 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              Announcements
            </button>
          </div>

          {/* News Grid */}
          <AnimatePresence mode="popLayout">
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredNews.map((item) => (
                <article
                  key={item.id}
                  className="bg-white border border-gray-150 rounded-2xl overflow-hidden shadow-sm flex flex-col h-full hover:shadow-md hover:border-gray-300 transition-all duration-300"
                >
                  {item.image && (
                    <div className="h-48 overflow-hidden relative">
                      <img src={getNewsImage(item)} alt={item.title} className="w-full h-full object-cover" />
                      <span className="absolute top-4 left-4 px-3 py-1 bg-[#D50C3A] text-white font-extrabold text-[10px] uppercase tracking-widest rounded-md">
                        {item.category_display || item.category}
                      </span>
                    </div>
                  )}
                  <div className="p-6 flex flex-col flex-1 space-y-3">
                    <div className="text-xs text-gray-400 font-semibold">{item.date_posted}</div>
                    <h3 className="text-lg font-bold text-gray-900 leading-snug line-clamp-2">{item.title}</h3>
                    <p className="text-xs text-gray-550 leading-relaxed line-clamp-4 flex-1">
                      {item.content}
                    </p>
                  </div>
                </article>
              ))}
            </StaggerContainer>
          </AnimatePresence>
        </div>
      </section>

      {/* 6. MEMBERSHIPS SECTION (crimson accents) */}
      <section id="membership" className="py-24 max-w-7xl mx-auto px-6 md:px-12 bg-white">
        <div className="text-center mb-16 space-y-3">
          <span className="text-xs uppercase font-extrabold tracking-widest text-[#D50C3A]">Club Joining Plans</span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 uppercase font-montserrat">Membership Tiers</h2>
          <div className="w-16 h-1 bg-[#D50C3A] mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => {
            const isPopular = index === 1;
            return (
              <motion.div
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 30 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                key={plan.id}
                className={`relative bg-white rounded-2xl p-8 border shadow-sm flex flex-col justify-between h-full transition-transform duration-300 hover:-translate-y-1.5 ${
                  isPopular 
                    ? 'border-[#D50C3A]/50 shadow-md ring-1 ring-[#D50C3A]/30' 
                    : 'border-gray-200'
                }`}
              >
                {isPopular && (
                  <span className="absolute -top-3 right-8 px-4 py-1 bg-[#D50C3A] text-white font-extrabold text-[10px] uppercase tracking-widest rounded-full shadow-md">
                    Most Popular
                  </span>
                )}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="flex items-baseline mb-6 border-b border-gray-100 pb-6">
                    <span className="text-3xl font-extrabold text-gray-900">{plan.price}</span>
                    <span className="text-xs text-gray-400 ml-1">/ {plan.duration}</span>
                  </div>
                  <ul className="space-y-3.5 mb-8">
                    {plan.features_list.map((feature, i) => (
                      <li key={i} className="flex items-start space-x-3 text-xs text-gray-600">
                        <CheckCircle size={16} className="text-[#D50C3A] shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  onClick={() => handleChoosePlan(plan.name)}
                  className={`w-full py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${
                    isPopular 
                      ? 'bg-[#D50C3A] hover:bg-[#b00b30] text-white' 
                      : 'bg-gray-100 hover:bg-gray-200 border border-gray-250 text-gray-700'
                  }`}
                >
                  Select Plan
                </button>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 6.5 TESTIMONIALS SECTION */}
      <section id="testimonials" className="py-24 bg-gray-50 border-t border-b border-gray-150 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-3">
            <span className="text-xs uppercase font-extrabold tracking-widest text-[#D50C3A]">Member Stories</span>
            <FadeUp>
              <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 uppercase font-montserrat">Testimonials</h2>
            </FadeUp>
            <div className="w-16 h-1 bg-[#D50C3A] mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white border border-gray-150 p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between h-full">
              <p className="text-xs text-gray-550 italic leading-relaxed text-justify">
                "The shuttle badminton coaching at RSC Ettumanoor is top-tier. My son has shown massive improvement in his technique and fitness in just six months under G. Prasanth's guidance."
              </p>
              <div className="mt-6 border-t border-gray-100 pt-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#D50C3A]/10 flex items-center justify-center text-[#D50C3A] font-bold text-sm">
                  MS
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900">Manoj Shah</h4>
                  <p className="text-[10px] text-gray-400">Parent of Junior Player</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-150 p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between h-full">
              <p className="text-xs text-gray-550 italic leading-relaxed text-justify">
                "I joined the Elite Shuttle Program. The court conditions are excellent, and the tournament correction clinics have helped me correct my footwork and smash accuracy."
              </p>
              <div className="mt-6 border-t border-gray-100 pt-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#D50C3A]/10 flex items-center justify-center text-[#D50C3A] font-bold text-sm">
                  AK
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900">Ananthu Krishnan</h4>
                  <p className="text-[10px] text-gray-400">Club Member</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-150 p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between h-full">
              <p className="text-xs text-gray-550 italic leading-relaxed text-justify">
                "RSC Ettumanoor is a fantastic sports hub. The turf football matches are competitive and the facilities are very well maintained. A great place to play and stay active."
              </p>
              <div className="mt-6 border-t border-gray-100 pt-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#D50C3A]/10 flex items-center justify-center text-[#D50C3A] font-bold text-sm">
                  JR
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900">Jithin Raj</h4>
                  <p className="text-[10px] text-gray-400">Turf Football Player</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. MANAGEMENT MESSAGES SECTION (matching rsckochi.com side-by-side layout with logo bg) */}
      <section 
        className="relative rounded-2xl overflow-hidden bg-contain bg-center bg-no-repeat px-6 pb-12 lg:pb-32 pt-12 border-t border-b border-gray-100"
        style={{ backgroundImage: `url('/images/white-logo-bg.webp')` }}
      >
        <div className="relative max-w-5xl mx-auto grid md:grid-cols-2 gap-32 items-start text-left z-10">
          
          {/* President Message Card */}
          <div className="flex flex-col items-left max-w-md mx-auto mb-6">
            <div className="w-[265px] h-[265px] rounded-full overflow-hidden border border-1 border-[#D50C3A] mb-12 flex items-center justify-center bg-gray-100 text-[#D50C3A] text-5xl font-extrabold shadow-md">
              {clubDetails.president_photo ? (
                <img src={getFullImageUrl(clubDetails.president_photo)} alt={clubDetails.president_name} className="w-full h-full object-cover" />
              ) : (
                clubDetails.president_name.split(' ').map(n => n[0]).join('')
              )}
            </div>
            
            <h2 className="text-3xl font-bold leading-tight mb-4 font-montserrat">President Message</h2>
            
            <div className="text-[.9rem] text-gray-700 mt-6 leading-relaxed whitespace-pre-line transition-all duration-300 text-justify italic">
              "{clubDetails.president_message}"
            </div>
            
            <div className="text-left mb-4 mt-16">
              <h3 className="text-2xl md:text-2xl font-bold text-gray-650 font-montserrat">{clubDetails.president_name}</h3>
              <p className="text-md text-[#D50C3A] font-semibold uppercase tracking-wider mt-1">
                Honorary President, Royal Sports Club
              </p>
            </div>
          </div>

          {/* Secretary Message Card */}
          <div className="flex flex-col items-left max-w-md mx-auto mb-6">
            <div className="w-[265px] h-[265px] rounded-full overflow-hidden border border-1 border-[#D50C3A] mb-12 flex items-center justify-center bg-gray-100 text-[#D50C3A] text-5xl font-extrabold shadow-md">
              {clubDetails.secretary_photo ? (
                <img src={getFullImageUrl(clubDetails.secretary_photo)} alt={clubDetails.secretary_name} className="w-full h-full object-cover" />
              ) : (
                clubDetails.secretary_name.split(' ').map(n => n[0]).join('')
              )}
            </div>
            
            <h2 className="text-3xl font-bold leading-tight mb-4 font-montserrat">Secretary Message</h2>
            
            <div className="text-[.9rem] text-gray-700 mt-6 leading-relaxed whitespace-pre-line transition-all duration-300 text-justify italic">
              "{clubDetails.secretary_message}"
            </div>
            
            <div className="text-left mb-4 mt-16">
              <h3 className="text-2xl md:text-2xl font-bold text-gray-650 font-montserrat">{clubDetails.secretary_name}</h3>
              <p className="text-md text-[#D50C3A] font-semibold uppercase tracking-wider mt-1">
                Honorary Secretary, Royal Sports Club
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 8. PHOTO GALLERY */}
      <section id="gallery" className="py-24 max-w-7xl mx-auto px-6 md:px-12 bg-white">
        <div className="text-center mb-16 space-y-3">
          <span className="text-xs uppercase font-extrabold tracking-widest text-[#D50C3A]">Visual Gallery</span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 uppercase font-montserrat">Club Gallery</h2>
          <div className="w-16 h-1 bg-[#D50C3A] mx-auto rounded-full" />
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {gallery.map((image, index) => (
            <motion.div
              whileInView={{ opacity: 1, scale: 0.98 }}
              initial={{ opacity: 0, scale: 0.9 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (index % 4) * 0.1 }}
              key={image.id}
              className="relative aspect-square rounded-xl overflow-hidden group shadow-sm cursor-pointer border border-gray-100"
            >
              <img src={getGalleryImage(image)} alt={image.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent opacity-0 group-hover:opacity-85 transition-opacity duration-300 flex items-end p-4" />
              <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <p className="text-[10px] font-bold text-[#D50C3A] uppercase tracking-wider">Royal Gallery</p>
                <h4 className="text-xs font-bold text-white truncate">{image.title}</h4>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 9. CONTACT & REGISTRATION FORM (crimson details) */}
      <section id="contact" className="py-24 bg-gray-50 border-t border-gray-200 relative">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-12 gap-12 relative z-10">
          
          {/* Left details */}
          <div className="md:col-span-5 space-y-8 flex flex-col justify-center text-left">
            <div className="space-y-3">
              <span className="text-xs uppercase font-extrabold tracking-widest text-[#D50C3A]">Enrollment Inquiry</span>
              <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 uppercase leading-tight font-montserrat">
                Start Your <br />
                Journey Today
              </h2>
              <div className="w-16 h-1 bg-[#D50C3A] rounded-full" />
            </div>
            
            <p className="text-sm text-gray-550 leading-relaxed max-w-sm text-justify">
              Submit your inquiry details and our team will get in touch with you within 24 hours to schedule a club tour and finalize registration slots.
            </p>

            <div className="space-y-5">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-[#D50C3A] border border-gray-200 shadow-sm">
                  <Phone size={18} />
                </div>
                <div>
                  <h4 className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Call Directly</h4>
                  <p className="text-sm text-gray-900 font-bold">{clubDetails.phone}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-[#D50C3A] border border-gray-200 shadow-sm">
                  <Mail size={18} />
                </div>
                <div>
                  <h4 className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Email Inquiry</h4>
                  <p className="text-sm text-gray-900 font-bold break-all">{clubDetails.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right form with clean background */}
          <div className="md:col-span-7">
            <motion.div 
              whileInView={{ opacity: 1, x: 0 }}
              initial={{ opacity: 0, x: 30 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white border border-gray-200 p-8 md:p-10 rounded-2xl shadow-lg text-left"
            >
              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2 flex flex-col">
                    <label className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Your Name</label>
                    <input 
                      type="text" 
                      placeholder="John Doe"
                      required
                      value={inquiryForm.name}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                      className="w-full glass-input px-4 py-3 text-sm rounded-lg text-gray-900 font-medium" 
                    />
                  </div>
                  <div className="space-y-2 flex flex-col">
                    <label className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Email Address</label>
                    <input 
                      type="email" 
                      placeholder="john@example.com"
                      required
                      value={inquiryForm.email}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                      className="w-full glass-input px-4 py-3 text-sm rounded-lg text-gray-900 font-medium" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2 flex flex-col">
                    <label className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Phone Number</label>
                    <input 
                      type="tel" 
                      placeholder="+91 94473 02176"
                      required
                      value={inquiryForm.phone}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                      className="w-full glass-input px-4 py-3 text-sm rounded-lg text-gray-900 font-medium" 
                    />
                  </div>
                  <div className="space-y-2 flex flex-col">
                    <label className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Program of Interest</label>
                    <select 
                      required
                      value={inquiryForm.sport}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, sport: e.target.value })}
                      className="w-full glass-input px-4 py-3 text-sm rounded-lg text-gray-700 font-medium appearance-none"
                    >
                      <option value="" disabled className="text-gray-500">Select Sports Academy</option>
                      {sports.map(s => (
                        <option key={s.id} value={s.name} className="text-gray-950 font-medium">{s.name}</option>
                      ))}
                      <option value="General Club Membership" className="text-gray-950 font-medium">General Club Membership</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2 flex flex-col">
                  <label className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Message or Notes</label>
                  <textarea 
                    rows={4} 
                    placeholder="Tell us about your skill level or specific goals..."
                    value={inquiryForm.message}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                    className="w-full glass-input px-4 py-3 text-sm rounded-lg text-gray-900 font-medium resize-none" 
                  />
                </div>

                <button
                  type="submit"
                  disabled={formStatus === 'loading'}
                  className="w-full py-4 bg-[#D50C3A] hover:bg-[#b00b30] disabled:opacity-50 disabled:pointer-events-none text-white font-extrabold rounded-lg shadow-md uppercase tracking-wider text-sm flex items-center justify-center space-x-2 transition-all duration-300 hover:scale-[1.01]"
                >
                  {formStatus === 'loading' ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : formStatus === 'success' ? (
                    <>
                      <CheckCircle size={16} />
                      <span>Inquiry Sent Successfully!</span>
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      <span>Submit Inquiry</span>
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 10. DETAILED SPORT DETAILS DIALOG MODAL */}
      <AnimatePresence>
        {selectedSport && (
          <div className="fixed inset-0 z-55 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedSport(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="relative w-full max-w-2xl bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-2xl z-10 flex flex-col text-left"
            >
              <button 
                onClick={() => setSelectedSport(null)}
                className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/85 transition-colors"
                aria-label="Close"
              >
                <X size={16} />
              </button>

              <div className="h-64 relative">
                <img src={getSportImage(selectedSport)} alt={selectedSport.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/30 to-transparent" />
                <div className="absolute bottom-6 left-8">
                  <h3 className="text-3xl font-extrabold text-white uppercase tracking-tight font-montserrat">{selectedSport.name}</h3>
                </div>
              </div>

              <div className="p-8 space-y-6">
                <div className="space-y-2">
                  <h4 className="text-xs uppercase font-extrabold tracking-wider text-[#D50C3A]">Program Overview</h4>
                  <p className="text-sm text-gray-655 leading-relaxed text-justify">
                    {selectedSport.description}
                  </p>
                </div>

                <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl flex items-center space-x-3">
                  <Calendar className="text-[#D50C3A]" size={20} />
                  <div>
                    <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Training Schedule</h5>
                    <p className="text-sm text-gray-900 font-bold">{selectedSport.schedule}</p>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => {
                      setInquiryForm({
                        ...inquiryForm,
                        sport: selectedSport.name,
                        message: `Hi, I am interested in enrolling in the "${selectedSport.name}" program.`
                      });
                      setSelectedSport(null);
                      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-6 py-3 bg-[#D50C3A] hover:bg-[#b00b30] text-white font-extrabold rounded-lg text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-md"
                  >
                    Inquire About Joining
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
