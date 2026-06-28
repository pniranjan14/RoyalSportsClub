'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api, ClubDetail, Sport, Coach, NewsUpdate, GalleryImage } from '@/lib/api';
import { 
  Users, Newspaper, Settings, Image as ImageIcon, MessageSquare, 
  LogOut, Plus, Trash2, Edit2, Check, RefreshCw, X, Shield, Upload 
} from 'lucide-react';

type Tab = 'overview' | 'news' | 'coaches' | 'club' | 'gallery' | 'inquiries';

export default function AdminDashboard() {
  const router = useRouter();
  const [tokenChecked, setTokenChecked] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  
  // Data States
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [news, setNews] = useState<NewsUpdate[]>([]);
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [clubDetails, setClubDetails] = useState<ClubDetail | null>(null);
  
  // Global States
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Modals / Form States
  const [activeModal, setActiveModal] = useState<'news' | 'coach' | 'gallery' | null>(null);
  const [editingItem, setEditingItem] = useState<any | null>(null);

  // Forms
  const [newsForm, setNewsForm] = useState({ title: '', content: '', category: 'news', date_posted: new Date().toISOString().split('T')[0] });
  const [newsImage, setNewsImage] = useState<File | null>(null);
  
  const [coachForm, setCoachForm] = useState({ name: '', specialty: '', bio: '', experience_years: 0 });
  const [coachImage, setCoachImage] = useState<File | null>(null);

  const [galleryTitle, setGalleryTitle] = useState('');
  const [galleryImage, setGalleryImage] = useState<File | null>(null);

  const [clubForm, setClubForm] = useState({
    president_name: '',
    president_message: '',
    secretary_name: '',
    secretary_message: '',
    phone: '',
    email: '',
    address: ''
  });
  const [presidentPhotoFile, setPresidentPhotoFile] = useState<File | null>(null);
  const [secretaryPhotoFile, setSecretaryPhotoFile] = useState<File | null>(null);

  // 1. Authentication Guard
  useEffect(() => {
    const token = api.getToken();
    if (!token) {
      router.push('/admin');
    } else {
      setTokenChecked(true);
      fetchData();
    }
  }, [router]);

  // 2. Fetch Data helper
  const fetchData = async () => {
    setLoading(true);
    try {
      const [inqData, newsData, coachesData, galleryData, clubData] = await Promise.all([
        api.getInquiries(),
        api.getNews(),
        api.getCoaches(),
        api.getGallery(),
        api.getClubDetails()
      ]);

      setInquiries(inqData);
      setNews(newsData);
      setCoaches(coachesData);
      setGallery(galleryData);
      setClubDetails(clubData);

      if (clubData) {
        setClubForm({
          president_name: clubData.president_name,
          president_message: clubData.president_message,
          secretary_name: clubData.secretary_name,
          secretary_message: clubData.secretary_message,
          phone: clubData.phone,
          email: clubData.email,
          address: clubData.address
        });
      }
    } catch (error) {
      console.error('Error fetching admin data:', error);
      showToast('Error loading server data. Check API connection.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    if (type === 'success') {
      setSuccessMessage(message);
      setTimeout(() => setSuccessMessage(''), 4000);
    } else {
      setErrorMessage(message);
      setTimeout(() => setErrorMessage(''), 4000);
    }
  };

  const handleLogout = () => {
    api.logout();
    router.push('/admin');
  };

  // --- API Action Handlers ---

  // News Actions
  const handleNewsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', newsForm.title);
      formData.append('content', newsForm.content);
      formData.append('category', newsForm.category);
      formData.append('date_posted', newsForm.date_posted);
      if (newsImage) {
        formData.append('image', newsImage);
      }

      let res;
      if (editingItem) {
        res = await api.updateNews(editingItem.slug, formData);
      } else {
        res = await api.createNews(formData);
      }

      if (res) {
        showToast(editingItem ? 'News updated successfully' : 'News published successfully', 'success');
        closeModal();
        fetchData();
      } else {
        showToast('Operation failed. Check inputs.', 'error');
      }
    } catch (error) {
      console.error(error);
      showToast('Server error occurred.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleNewsDelete = async (slug: string) => {
    if (!confirm('Are you sure you want to delete this news update?')) return;
    setActionLoading(true);
    const success = await api.deleteNews(slug);
    setActionLoading(false);
    if (success) {
      showToast('News update deleted successfully', 'success');
      fetchData();
    } else {
      showToast('Failed to delete news.', 'error');
    }
  };

  // Coach Actions
  const handleCoachSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', coachForm.name);
      formData.append('specialty', coachForm.specialty);
      formData.append('bio', coachForm.bio);
      formData.append('experience_years', String(coachForm.experience_years));
      if (coachImage) {
        formData.append('image', coachImage);
      }

      let res;
      if (editingItem) {
        res = await api.updateCoach(editingItem.id, formData);
      } else {
        res = await api.createCoach(formData);
      }

      if (res) {
        showToast(editingItem ? 'Coach profile updated' : 'Coach profile created', 'success');
        closeModal();
        fetchData();
      } else {
        showToast('Failed to save coach details.', 'error');
      }
    } catch (error) {
      console.error(error);
      showToast('Server error occurred.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCoachDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this coach?')) return;
    setActionLoading(true);
    const success = await api.deleteCoach(id);
    setActionLoading(false);
    if (success) {
      showToast('Coach deleted successfully', 'success');
      fetchData();
    } else {
      showToast('Failed to delete coach.', 'error');
    }
  };

  // Club Details Action
  const handleClubSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clubDetails) return;
    setActionLoading(true);
    try {
      const formData = new FormData();
      formData.append('president_name', clubForm.president_name);
      formData.append('president_message', clubForm.president_message);
      formData.append('secretary_name', clubForm.secretary_name);
      formData.append('secretary_message', clubForm.secretary_message);
      formData.append('phone', clubForm.phone);
      formData.append('email', clubForm.email);
      formData.append('address', clubForm.address);
      
      if (presidentPhotoFile) {
        formData.append('president_photo', presidentPhotoFile);
      }
      if (secretaryPhotoFile) {
        formData.append('secretary_photo', secretaryPhotoFile);
      }

      const success = await api.updateClubDetails(clubDetails.id, formData);
      if (success) {
        showToast('Club details updated successfully', 'success');
        setPresidentPhotoFile(null);
        setSecretaryPhotoFile(null);
        fetchData();
      } else {
        showToast('Failed to update details.', 'error');
      }
    } catch (error) {
      console.error(error);
      showToast('Server error occurred.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Gallery Actions
  const handleGallerySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!galleryImage) {
      showToast('Please select an image file first.', 'error');
      return;
    }
    setActionLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', galleryTitle);
      formData.append('image', galleryImage);

      const success = await api.createGalleryImage(formData);
      if (success) {
        showToast('Gallery image uploaded successfully', 'success');
        setGalleryTitle('');
        setGalleryImage(null);
        setActiveModal(null);
        fetchData();
      } else {
        showToast('Failed to upload image.', 'error');
      }
    } catch (error) {
      console.error(error);
      showToast('Server error occurred.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleGalleryDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this gallery image?')) return;
    setActionLoading(true);
    const success = await api.deleteGalleryImage(id);
    setActionLoading(false);
    if (success) {
      showToast('Gallery image deleted', 'success');
      fetchData();
    } else {
      showToast('Failed to delete image.', 'error');
    }
  };

  // Inquiries Actions
  const handleInquiryResolve = async (id: number, currentStatus: boolean) => {
    setActionLoading(true);
    const success = await api.resolveInquiry(id, !currentStatus);
    setActionLoading(false);
    if (success) {
      showToast('Inquiry status updated', 'success');
      fetchData();
    } else {
      showToast('Failed to update inquiry status.', 'error');
    }
  };

  const handleInquiryDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this inquiry submission?')) return;
    setActionLoading(true);
    const success = await api.deleteInquiry(id);
    setActionLoading(false);
    if (success) {
      showToast('Inquiry deleted successfully', 'success');
      fetchData();
    } else {
      showToast('Failed to delete inquiry.', 'error');
    }
  };

  // --- Modal Utilities ---
  const openNewsModal = (item: NewsUpdate | null = null) => {
    setEditingItem(item);
    if (item) {
      setNewsForm({
        title: item.title,
        content: item.content,
        category: item.category,
        date_posted: item.date_posted
      });
    } else {
      setNewsForm({
        title: '',
        content: '',
        category: 'news',
        date_posted: new Date().toISOString().split('T')[0]
      });
    }
    setNewsImage(null);
    setActiveModal('news');
  };

  const openCoachModal = (item: Coach | null = null) => {
    setEditingItem(item);
    if (item) {
      setCoachForm({
        name: item.name,
        specialty: item.specialty,
        bio: item.bio,
        experience_years: item.experience_years
      });
    } else {
      setCoachForm({
        name: '',
        specialty: '',
        bio: '',
        experience_years: 0
      });
    }
    setCoachImage(null);
    setActiveModal('coach');
  };

  const closeModal = () => {
    setActiveModal(null);
    setEditingItem(null);
  };

  if (!tokenChecked || loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col justify-center items-center text-white">
        <RefreshCw size={40} className="animate-spin text-[#D50C3A] mb-4" />
        <p className="text-sm tracking-wider uppercase font-semibold text-gray-400">Loading Dashboard Data...</p>
      </div>
    );
  }

  const pendingInquiries = inquiries.filter(i => !i.resolved).length;

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col text-gray-300 font-poppins relative">
      
      {/* Toast Alert Popups */}
      {successMessage && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2 bg-[#10B981] text-white px-5 py-3.5 rounded-xl shadow-2xl animate-fade-in text-sm font-semibold border border-[#059669]/30">
          <Check size={18} />
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2 bg-[#EF4444] text-white px-5 py-3.5 rounded-xl shadow-2xl animate-fade-in text-sm font-semibold border border-[#DC2626]/30">
          <X size={18} />
          {errorMessage}
        </div>
      )}

      {/* Top navbar */}
      <header className="bg-gray-900 border-b border-gray-800/80 px-6 py-4 flex items-center justify-between z-10">
        <div className="flex items-center space-x-3">
          <img src="/images/logo.png" alt="RSC" className="h-10 w-auto" />
          <div>
            <h1 className="text-sm font-bold text-white font-montserrat uppercase tracking-wider -mb-0.5">Royal Sports Club</h1>
            <span className="text-[10px] text-gray-500 font-extrabold uppercase tracking-widest flex items-center gap-1">
              <Shield size={10} className="text-[#D50C3A]" /> Control Dashboard
            </span>
          </div>
        </div>
        <button 
          onClick={handleLogout} 
          className="flex items-center gap-2 bg-gray-950 hover:bg-[#D50C3A] hover:text-white border border-gray-800 px-4 py-2 text-xs font-semibold rounded-lg transition duration-300 cursor-pointer"
        >
          <LogOut size={14} /> Log Out
        </button>
      </header>

      {/* Main panel layout */}
      <div className="flex flex-1 flex-col lg:flex-row">
        
        {/* Sidebar Nav */}
        <aside className="lg:w-64 bg-gray-900/40 border-b lg:border-b-0 lg:border-r border-gray-800/80 flex flex-col">
          <nav className="p-4 space-y-1.5 flex lg:flex-col overflow-x-auto lg:overflow-x-visible whitespace-nowrap lg:whitespace-normal">
            
            <button 
              onClick={() => setActiveTab('overview')} 
              className={`flex items-center gap-3 w-full px-4 py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition ${
                activeTab === 'overview' ? 'bg-[#D50C3A] text-white' : 'hover:bg-gray-900/80 text-gray-400 hover:text-white'
              }`}
            >
              <Shield size={16} /> Overview
            </button>
            <button 
              onClick={() => setActiveTab('inquiries')} 
              className={`flex items-center gap-3 w-full px-4 py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition relative ${
                activeTab === 'inquiries' ? 'bg-[#D50C3A] text-white' : 'hover:bg-gray-900/80 text-gray-400 hover:text-white'
              }`}
            >
              <MessageSquare size={16} /> Inquiries 
              {pendingInquiries > 0 && (
                <span className="bg-[#D50C3A] text-white text-[9px] font-bold px-2 py-0.5 rounded-full absolute right-4 border border-white/10 animate-pulse">
                  {pendingInquiries}
                </span>
              )}
            </button>
            <button 
              onClick={() => setActiveTab('news')} 
              className={`flex items-center gap-3 w-full px-4 py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition ${
                activeTab === 'news' ? 'bg-[#D50C3A] text-white' : 'hover:bg-gray-900/80 text-gray-400 hover:text-white'
              }`}
            >
              <Newspaper size={16} /> News & Events
            </button>
            <button 
              onClick={() => setActiveTab('coaches')} 
              className={`flex items-center gap-3 w-full px-4 py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition ${
                activeTab === 'coaches' ? 'bg-[#D50C3A] text-white' : 'hover:bg-gray-900/80 text-gray-400 hover:text-white'
              }`}
            >
              <Users size={16} /> Coaches
            </button>
            <button 
              onClick={() => setActiveTab('club')} 
              className={`flex items-center gap-3 w-full px-4 py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition ${
                activeTab === 'club' ? 'bg-[#D50C3A] text-white' : 'hover:bg-gray-900/80 text-gray-400 hover:text-white'
              }`}
            >
              <Settings size={16} /> Club Info
            </button>
            <button 
              onClick={() => setActiveTab('gallery')} 
              className={`flex items-center gap-3 w-full px-4 py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition ${
                activeTab === 'gallery' ? 'bg-[#D50C3A] text-white' : 'hover:bg-gray-900/80 text-gray-400 hover:text-white'
              }`}
            >
              <ImageIcon size={16} /> Gallery
            </button>
            
          </nav>
        </aside>

        {/* Dashboard Panels */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-8 text-left">
              <div>
                <h2 className="text-3xl font-extrabold text-white uppercase tracking-wider font-montserrat">Overview</h2>
                <p className="text-xs text-gray-500 mt-1">Live club summary and quick controls</p>
              </div>

              {/* Stat Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                
                <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-6 shadow-md flex items-center justify-between">
                  <div>
                    <h5 className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Pending Inquiries</h5>
                    <p className="text-3xl font-extrabold text-white mt-1 font-montserrat">{pendingInquiries}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-[#D50C3A]/10 text-[#D50C3A] flex items-center justify-center">
                    <MessageSquare size={22} />
                  </div>
                </div>

                <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-6 shadow-md flex items-center justify-between">
                  <div>
                    <h5 className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Published News</h5>
                    <p className="text-3xl font-extrabold text-white mt-1 font-montserrat">{news.length}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-[#D50C3A]/10 text-[#D50C3A] flex items-center justify-center">
                    <Newspaper size={22} />
                  </div>
                </div>

                <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-6 shadow-md flex items-center justify-between">
                  <div>
                    <h5 className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Certified Coaches</h5>
                    <p className="text-3xl font-extrabold text-white mt-1 font-montserrat">{coaches.length}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-[#D50C3A]/10 text-[#D50C3A] flex items-center justify-center">
                    <Users size={22} />
                  </div>
                </div>

                <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-6 shadow-md flex items-center justify-between">
                  <div>
                    <h5 className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Gallery Assets</h5>
                    <p className="text-3xl font-extrabold text-white mt-1 font-montserrat">{gallery.length}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-[#D50C3A]/10 text-[#D50C3A] flex items-center justify-center">
                    <ImageIcon size={22} />
                  </div>
                </div>

              </div>

              {/* Quick actions box */}
              <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-6 shadow-md">
                <h3 className="text-white font-extrabold text-xs uppercase tracking-wider mb-6 border-l-2 border-[#D50C3A] pl-3">
                  Quick Actions
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <button 
                    onClick={() => openNewsModal()}
                    className="flex flex-col items-center justify-center p-5 bg-gray-950/60 hover:bg-[#D50C3A] hover:text-white border border-gray-800 rounded-xl transition duration-300 gap-3 text-center cursor-pointer group"
                  >
                    <Newspaper size={24} className="text-[#D50C3A] group-hover:text-white" />
                    <span className="text-[11px] font-bold uppercase tracking-wider">Publish Update</span>
                  </button>
                  <button 
                    onClick={() => openCoachModal()}
                    className="flex flex-col items-center justify-center p-5 bg-gray-950/60 hover:bg-[#D50C3A] hover:text-white border border-gray-800 rounded-xl transition duration-300 gap-3 text-center cursor-pointer group"
                  >
                    <Users size={24} className="text-[#D50C3A] group-hover:text-white" />
                    <span className="text-[11px] font-bold uppercase tracking-wider">Add Coach</span>
                  </button>
                  <button 
                    onClick={() => setActiveModal('gallery')}
                    className="flex flex-col items-center justify-center p-5 bg-gray-950/60 hover:bg-[#D50C3A] hover:text-white border border-gray-800 rounded-xl transition duration-300 gap-3 text-center cursor-pointer group"
                  >
                    <ImageIcon size={24} className="text-[#D50C3A] group-hover:text-white" />
                    <span className="text-[11px] font-bold uppercase tracking-wider">Upload Image</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('inquiries')}
                    className="flex flex-col items-center justify-center p-5 bg-gray-950/60 hover:bg-[#D50C3A] hover:text-white border border-gray-800 rounded-xl transition duration-300 gap-3 text-center cursor-pointer group"
                  >
                    <MessageSquare size={24} className="text-[#D50C3A] group-hover:text-white" />
                    <span className="text-[11px] font-bold uppercase tracking-wider">View Messages</span>
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: INQUIRIES */}
          {activeTab === 'inquiries' && (
            <div className="space-y-6 text-left animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-extrabold text-white uppercase tracking-wider font-montserrat">Inquiries</h2>
                  <p className="text-xs text-gray-550 mt-1">Review contact form submissions</p>
                </div>
                <button 
                  onClick={fetchData} 
                  className="p-2 border border-gray-800 hover:border-white rounded-lg text-gray-400 hover:text-white transition cursor-pointer"
                  title="Reload Inquiries"
                >
                  <RefreshCw size={15} />
                </button>
              </div>

              {inquiries.length === 0 ? (
                <div className="bg-gray-900/40 border border-gray-800/80 rounded-2xl p-16 text-center text-gray-500 font-medium">
                  <MessageSquare size={40} className="mx-auto mb-4 text-gray-600" />
                  No inquiries received yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {inquiries.map((inq) => (
                    <div 
                      key={inq.id}
                      className={`bg-gray-900/40 border rounded-2xl p-6 flex flex-col md:flex-row justify-between gap-6 transition ${
                        inq.resolved ? 'border-gray-850 opacity-70' : 'border-gray-800'
                      }`}
                    >
                      <div className="space-y-3 flex-1">
                        <div className="flex items-center gap-3">
                          <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded ${
                            inq.resolved ? 'bg-gray-850 text-gray-500' : 'bg-[#D50C3A]/10 text-[#D50C3A]'
                          }`}>
                            {inq.sport}
                          </span>
                          <span className="text-xs text-gray-500">{new Date(inq.date_submitted).toLocaleString()}</span>
                        </div>
                        <h4 className="text-lg font-bold text-white font-montserrat">{inq.name}</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-semibold text-gray-450">
                          <p>Phone: <span className="text-gray-300 font-bold">{inq.phone}</span></p>
                          <p>Email: <span className="text-gray-300 font-bold">{inq.email}</span></p>
                        </div>
                        <p className="text-xs text-gray-300 bg-gray-950/60 p-4 rounded-xl border border-gray-850 mt-4 leading-relaxed italic">
                          "{inq.message || 'No additional notes provided.'}"
                        </p>
                      </div>

                      <div className="flex md:flex-col justify-end items-end gap-3 shrink-0">
                        <button 
                          onClick={() => handleInquiryResolve(inq.id, inq.resolved)}
                          disabled={actionLoading}
                          className={`w-full md:w-32 py-2.5 text-[10px] font-bold uppercase tracking-wider rounded-lg border flex items-center justify-center gap-1.5 transition cursor-pointer ${
                            inq.resolved 
                              ? 'bg-gray-950 hover:bg-[#D50C3A] border-gray-850 hover:border-transparent text-gray-500 hover:text-white' 
                              : 'bg-[#D50C3A] hover:bg-[#b00b30] border-transparent text-white'
                          }`}
                        >
                          <Check size={12} />
                          {inq.resolved ? 'Reopen' : 'Mark Resolved'}
                        </button>
                        <button 
                          onClick={() => handleInquiryDelete(inq.id)}
                          disabled={actionLoading}
                          className="w-full md:w-32 py-2.5 text-[10px] font-bold uppercase tracking-wider rounded-lg bg-gray-950 hover:bg-[#EF4444] border border-gray-850 hover:border-transparent text-gray-400 hover:text-white flex items-center justify-center gap-1.5 transition cursor-pointer"
                        >
                          <Trash2 size={12} />
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: NEWS & ANNOUNCEMENTS */}
          {activeTab === 'news' && (
            <div className="space-y-6 text-left animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-extrabold text-white uppercase tracking-wider font-montserrat">News & Announcements</h2>
                  <p className="text-xs text-gray-550 mt-1">Publish and edit updates shown on the homepage</p>
                </div>
                <button 
                  onClick={() => openNewsModal()}
                  className="flex items-center gap-2 bg-[#D50C3A] hover:bg-[#b00b30] text-white px-4 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition cursor-pointer shadow-md"
                >
                  <Plus size={14} /> Add Update
                </button>
              </div>

              {news.length === 0 ? (
                <div className="bg-gray-900/40 border border-gray-800/80 rounded-2xl p-16 text-center text-gray-500 font-medium">
                  <Newspaper size={40} className="mx-auto mb-4 text-gray-600" />
                  No news updates published yet. Click "Add Update" to begin.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {news.map((item) => (
                    <article 
                      key={item.id}
                      className="bg-gray-900/40 border border-gray-800 rounded-2xl overflow-hidden flex flex-col justify-between h-full shadow-md"
                    >
                      <div>
                        {item.image && (
                          <div className="h-40 overflow-hidden relative">
                            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                            <span className="absolute top-3 left-3 px-2 py-0.5 bg-[#D50C3A] text-white font-extrabold text-[9px] uppercase tracking-widest rounded-md">
                              {item.category_display || item.category}
                            </span>
                          </div>
                        )}
                        <div className="p-5 space-y-2">
                          <span className="text-[10px] text-gray-500 font-semibold">{item.date_posted}</span>
                          <h4 className="text-md font-bold text-white leading-snug line-clamp-2">{item.title}</h4>
                          <p className="text-xs text-gray-450 leading-relaxed line-clamp-4">{item.content}</p>
                        </div>
                      </div>

                      <div className="p-5 pt-0 border-t border-gray-850/40 flex gap-3 mt-4">
                        <button 
                          onClick={() => openNewsModal(item)}
                          className="flex-1 py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg bg-gray-950 hover:bg-white hover:text-black border border-gray-850 text-gray-400 flex items-center justify-center gap-1.5 transition cursor-pointer"
                        >
                          <Edit2 size={12} /> Edit
                        </button>
                        <button 
                          onClick={() => handleNewsDelete(item.slug)}
                          className="py-2 px-3 rounded-lg bg-gray-950 hover:bg-[#EF4444] border border-gray-850 hover:border-transparent text-gray-400 hover:text-white transition cursor-pointer"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: COACHES */}
          {activeTab === 'coaches' && (
            <div className="space-y-6 text-left animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-extrabold text-white uppercase tracking-wider font-montserrat">Coaches</h2>
                  <p className="text-xs text-gray-550 mt-1">Manage sports coaches and specialty listings</p>
                </div>
                <button 
                  onClick={() => openCoachModal()}
                  className="flex items-center gap-2 bg-[#D50C3A] hover:bg-[#b00b30] text-white px-4 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition cursor-pointer shadow-md"
                >
                  <Plus size={14} /> Add Coach
                </button>
              </div>

              {coaches.length === 0 ? (
                <div className="bg-gray-900/40 border border-gray-800/80 rounded-2xl p-16 text-center text-gray-500 font-medium">
                  <Users size={40} className="mx-auto mb-4 text-gray-600" />
                  No coach profiles registered. Click "Add Coach" to begin.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {coaches.map((coach) => (
                    <div 
                      key={coach.id}
                      className="bg-gray-900/40 border border-gray-800 rounded-2xl overflow-hidden flex flex-col md:flex-row h-full shadow-md"
                    >
                      <div className="md:w-1/3 h-48 md:h-full relative shrink-0">
                        <img 
                          src={coach.image} 
                          alt={coach.name} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div className="p-6 flex flex-col justify-between flex-1">
                        <div>
                          <span className="text-[9px] font-bold text-[#D50C3A] uppercase tracking-widest bg-[#D50C3A]/10 px-2 py-0.5 rounded">
                            {coach.experience_years}+ Years Experience
                          </span>
                          <h4 className="text-lg font-bold text-white mt-3 font-montserrat">{coach.name}</h4>
                          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-0.5">{coach.specialty}</p>
                          <p className="text-xs text-gray-400 mt-4 leading-relaxed line-clamp-3">{coach.bio}</p>
                        </div>

                        <div className="flex gap-3 mt-6 border-t border-gray-850/40 pt-4">
                          <button 
                            onClick={() => openCoachModal(coach)}
                            className="flex-1 py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg bg-gray-950 hover:bg-white hover:text-black border border-gray-850 text-gray-400 flex items-center justify-center gap-1.5 transition cursor-pointer"
                          >
                            <Edit2 size={12} /> Edit Profile
                          </button>
                          <button 
                            onClick={() => handleCoachDelete(coach.id)}
                            className="py-2 px-3 rounded-lg bg-gray-950 hover:bg-[#EF4444] border border-gray-850 hover:border-transparent text-gray-400 hover:text-white transition cursor-pointer"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: CLUB INFO */}
          {activeTab === 'club' && (
            <div className="space-y-6 text-left animate-fade-in">
              <div>
                <h2 className="text-3xl font-extrabold text-white uppercase tracking-wider font-montserrat">Club Information</h2>
                <p className="text-xs text-gray-550 mt-1">Manage contact info, statements, and management messages</p>
              </div>

              {!clubDetails ? (
                <div className="bg-gray-900/40 border border-gray-800/80 rounded-2xl p-16 text-center text-gray-500 font-medium">
                  Failed to fetch club database table.
                </div>
              ) : (
                <form onSubmit={handleClubSubmit} className="space-y-8">
                  
                  {/* Public Contact Details */}
                  <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-6 space-y-6 shadow-md">
                    <h3 className="text-white font-extrabold text-xs uppercase tracking-wider border-l-2 border-[#D50C3A] pl-3">
                      Contact Information
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2 flex flex-col">
                        <label className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Public Phone</label>
                        <input 
                          type="text" 
                          required
                          value={clubForm.phone}
                          onChange={(e) => setClubForm({ ...clubForm, phone: e.target.value })}
                          className="bg-gray-950 border border-gray-850 focus:border-[#D50C3A] focus:ring-1 focus:ring-[#D50C3A] text-white rounded-xl px-4 py-3 text-sm outline-none font-medium" 
                        />
                      </div>
                      <div className="space-y-2 flex flex-col">
                        <label className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Public Email</label>
                        <input 
                          type="email" 
                          required
                          value={clubForm.email}
                          onChange={(e) => setClubForm({ ...clubForm, email: e.target.value })}
                          className="bg-gray-950 border border-gray-850 focus:border-[#D50C3A] focus:ring-1 focus:ring-[#D50C3A] text-white rounded-xl px-4 py-3 text-sm outline-none font-medium" 
                        />
                      </div>
                    </div>
                    <div className="space-y-2 flex flex-col">
                      <label className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">HQ Office Address</label>
                      <textarea 
                        rows={2} 
                        required
                        value={clubForm.address}
                        onChange={(e) => setClubForm({ ...clubForm, address: e.target.value })}
                        className="bg-gray-950 border border-gray-850 focus:border-[#D50C3A] focus:ring-1 focus:ring-[#D50C3A] text-white rounded-xl px-4 py-3 text-sm outline-none font-medium resize-none" 
                      />
                    </div>
                  </div>

                  {/* Management Columns */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* President Card */}
                    <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-6 space-y-6 shadow-md">
                      <h3 className="text-white font-extrabold text-xs uppercase tracking-wider border-l-2 border-[#D50C3A] pl-3">
                        Honorary President
                      </h3>
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full overflow-hidden shrink-0 border border-gray-800 bg-gray-950">
                          <img 
                            src={presidentPhotoFile ? URL.createObjectURL(presidentPhotoFile) : clubDetails.president_photo || ''} 
                            alt="President" 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <div className="flex-1 space-y-2">
                          <label className="text-[10px] uppercase tracking-wider text-gray-500 font-bold block">Update Photo</label>
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={(e) => setPresidentPhotoFile(e.target.files?.[0] || null)}
                            className="text-xs text-gray-400 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-bold file:uppercase file:bg-gray-950 file:text-gray-300 file:cursor-pointer hover:file:bg-[#D50C3A] hover:file:text-white"
                          />
                        </div>
                      </div>
                      <div className="space-y-2 flex flex-col">
                        <label className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">President Name</label>
                        <input 
                          type="text" 
                          required
                          value={clubForm.president_name}
                          onChange={(e) => setClubForm({ ...clubForm, president_name: e.target.value })}
                          className="bg-gray-950 border border-gray-850 focus:border-[#D50C3A] focus:ring-1 focus:ring-[#D50C3A] text-white rounded-xl px-4 py-3 text-sm outline-none font-medium" 
                        />
                      </div>
                      <div className="space-y-2 flex flex-col">
                        <label className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">President Statement message</label>
                        <textarea 
                          rows={4} 
                          required
                          value={clubForm.president_message}
                          onChange={(e) => setClubForm({ ...clubForm, president_message: e.target.value })}
                          className="bg-gray-950 border border-gray-850 focus:border-[#D50C3A] focus:ring-1 focus:ring-[#D50C3A] text-white rounded-xl px-4 py-3 text-sm outline-none font-medium resize-none" 
                        />
                      </div>
                    </div>

                    {/* Secretary Card */}
                    <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-6 space-y-6 shadow-md">
                      <h3 className="text-white font-extrabold text-xs uppercase tracking-wider border-l-2 border-[#D50C3A] pl-3">
                        Honorary Secretary
                      </h3>
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full overflow-hidden shrink-0 border border-gray-800 bg-gray-950">
                          <img 
                            src={secretaryPhotoFile ? URL.createObjectURL(secretaryPhotoFile) : clubDetails.secretary_photo || ''} 
                            alt="Secretary" 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <div className="flex-1 space-y-2">
                          <label className="text-[10px] uppercase tracking-wider text-gray-500 font-bold block">Update Photo</label>
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={(e) => setSecretaryPhotoFile(e.target.files?.[0] || null)}
                            className="text-xs text-gray-400 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-bold file:uppercase file:bg-gray-950 file:text-gray-300 file:cursor-pointer hover:file:bg-[#D50C3A] hover:file:text-white"
                          />
                        </div>
                      </div>
                      <div className="space-y-2 flex flex-col">
                        <label className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Secretary Name</label>
                        <input 
                          type="text" 
                          required
                          value={clubForm.secretary_name}
                          onChange={(e) => setClubForm({ ...clubForm, secretary_name: e.target.value })}
                          className="bg-gray-950 border border-gray-850 focus:border-[#D50C3A] focus:ring-1 focus:ring-[#D50C3A] text-white rounded-xl px-4 py-3 text-sm outline-none font-medium" 
                        />
                      </div>
                      <div className="space-y-2 flex flex-col">
                        <label className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Secretary Statement message</label>
                        <textarea 
                          rows={4} 
                          required
                          value={clubForm.secretary_message}
                          onChange={(e) => setClubForm({ ...clubForm, secretary_message: e.target.value })}
                          className="bg-gray-950 border border-gray-850 focus:border-[#D50C3A] focus:ring-1 focus:ring-[#D50C3A] text-white rounded-xl px-4 py-3 text-sm outline-none font-medium resize-none" 
                        />
                      </div>
                    </div>

                  </div>

                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="px-8 py-4 bg-[#D50C3A] hover:bg-[#b00b30] text-white font-extrabold rounded-xl shadow-lg uppercase tracking-widest text-xs flex items-center justify-center space-x-2 transition hover:scale-[1.01] cursor-pointer"
                  >
                    {actionLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        <span>Updating Club Database...</span>
                      </>
                    ) : (
                      <>
                        <Check size={14} />
                        <span>Save All Club Changes</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* TAB 6: GALLERY */}
          {activeTab === 'gallery' && (
            <div className="space-y-6 text-left animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-extrabold text-white uppercase tracking-wider font-montserrat">Gallery Assets</h2>
                  <p className="text-xs text-gray-550 mt-1">Upload and delete images shown in the public gallery</p>
                </div>
                <button 
                  onClick={() => {
                    setGalleryTitle('');
                    setGalleryImage(null);
                    setActiveModal('gallery');
                  }}
                  className="flex items-center gap-2 bg-[#D50C3A] hover:bg-[#b00b30] text-white px-4 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition cursor-pointer shadow-md"
                >
                  <Plus size={14} /> Upload Image
                </button>
              </div>

              {gallery.length === 0 ? (
                <div className="bg-gray-900/40 border border-gray-800/80 rounded-2xl p-16 text-center text-gray-500 font-medium">
                  <ImageIcon size={40} className="mx-auto mb-4 text-gray-600" />
                  No gallery images uploaded. Click "Upload Image" to begin.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                  {gallery.map((image) => (
                    <div 
                      key={image.id}
                      className="relative aspect-square rounded-xl overflow-hidden group shadow-sm border border-gray-800 bg-gray-900/20"
                    >
                      <img src={image.image} alt={image.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-between p-4" />
                      <div className="absolute bottom-4 left-4 right-4 z-10 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                        <p className="text-[10px] text-gray-450 font-semibold truncate mb-2">{image.title || 'Untitled Image'}</p>
                        <button 
                          onClick={() => handleGalleryDelete(image.id)}
                          disabled={actionLoading}
                          className="w-full py-2 bg-[#EF4444] hover:bg-[#DC2626] text-white text-[9px] font-bold uppercase tracking-wider rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer shadow-lg"
                        >
                          <Trash2 size={12} /> Remove Image
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </main>
      </div>

      {/* --- MODAL FORM DIALOGS --- */}
      
      {/* 1. NEWS MODAL */}
      {activeModal === 'news' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 text-left">
          <div onClick={closeModal} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
          <div className="relative w-full max-w-xl bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-2xl z-10 flex flex-col">
            <button 
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-450 hover:text-white"
            >
              <X size={20} />
            </button>
            <div className="p-6 border-b border-gray-800">
              <h3 className="text-xl font-bold text-white font-montserrat uppercase tracking-wider">
                {editingItem ? 'Edit News Update' : 'Publish New Update'}
              </h3>
            </div>
            <form onSubmit={handleNewsSubmit} className="p-6 space-y-5">
              
              <div className="space-y-2 flex flex-col">
                <label className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">News Title</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Kottayam Badminton Tournament Results"
                  value={newsForm.title}
                  onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })}
                  className="bg-gray-950 border border-gray-850 focus:border-[#D50C3A] focus:ring-1 focus:ring-[#D50C3A] text-white rounded-xl px-4 py-3 text-sm outline-none font-medium" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 flex flex-col">
                  <label className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Category</label>
                  <select 
                    value={newsForm.category}
                    onChange={(e) => setNewsForm({ ...newsForm, category: e.target.value })}
                    className="bg-gray-950 border border-gray-850 focus:border-[#D50C3A] focus:ring-1 focus:ring-[#D50C3A] text-white rounded-xl px-4 py-3 text-sm outline-none font-medium appearance-none"
                  >
                    <option value="news">Announcement</option>
                    <option value="tournament">Tournament</option>
                    <option value="update">General Update</option>
                  </select>
                </div>
                <div className="space-y-2 flex flex-col">
                  <label className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Publish Date</label>
                  <input 
                    type="date" 
                    required
                    value={newsForm.date_posted}
                    onChange={(e) => setNewsForm({ ...newsForm, date_posted: e.target.value })}
                    className="bg-gray-950 border border-gray-850 focus:border-[#D50C3A] focus:ring-1 focus:ring-[#D50C3A] text-white rounded-xl px-4 py-3 text-sm outline-none font-medium" 
                  />
                </div>
              </div>

              <div className="space-y-2 flex flex-col">
                <label className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Content Text</label>
                <textarea 
                  rows={4} 
                  required
                  placeholder="Write the details here..."
                  value={newsForm.content}
                  onChange={(e) => setNewsForm({ ...newsForm, content: e.target.value })}
                  className="bg-gray-950 border border-gray-850 focus:border-[#D50C3A] focus:ring-1 focus:ring-[#D50C3A] text-white rounded-xl px-4 py-3 text-sm outline-none font-medium resize-none animate-none" 
                />
              </div>

              <div className="space-y-2 flex flex-col">
                <label className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Display Image (Optional)</label>
                {editingItem?.image && !newsImage && (
                  <p className="text-[10px] text-gray-500 font-semibold mb-1">Current: {editingItem.image.split('/').pop()}</p>
                )}
                <div className="border border-dashed border-gray-800 rounded-xl p-4 flex items-center gap-3 bg-gray-950/40">
                  <Upload size={20} className="text-gray-500" />
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => setNewsImage(e.target.files?.[0] || null)}
                    className="text-xs text-gray-400 file:mr-4 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-[9px] file:font-extrabold file:uppercase file:bg-gray-900 file:text-gray-300 file:cursor-pointer hover:file:bg-[#D50C3A] hover:file:text-white"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={closeModal}
                  className="px-5 py-2.5 bg-gray-950 hover:bg-gray-850 border border-gray-850 rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2.5 bg-[#D50C3A] hover:bg-[#b00b30] text-white text-xs font-bold uppercase tracking-wider rounded-lg flex items-center gap-1.5 cursor-pointer"
                >
                  {actionLoading ? 'Saving...' : 'Save & Publish'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* 2. COACH MODAL */}
      {activeModal === 'coach' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 text-left">
          <div onClick={closeModal} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
          <div className="relative w-full max-w-xl bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-2xl z-10 flex flex-col">
            <button 
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-450 hover:text-white"
            >
              <X size={20} />
            </button>
            <div className="p-6 border-b border-gray-800">
              <h3 className="text-xl font-bold text-white font-montserrat uppercase tracking-wider">
                {editingItem ? 'Edit Coach Profile' : 'Add New Coach Profile'}
              </h3>
            </div>
            <form onSubmit={handleCoachSubmit} className="p-6 space-y-5">
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 flex flex-col">
                  <label className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Coach Name</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. G. Prasanth"
                    value={coachForm.name}
                    onChange={(e) => setCoachForm({ ...coachForm, name: e.target.value })}
                    className="bg-gray-950 border border-gray-850 focus:border-[#D50C3A] focus:ring-1 focus:ring-[#D50C3A] text-white rounded-xl px-4 py-3 text-sm outline-none font-medium" 
                  />
                </div>
                <div className="space-y-2 flex flex-col">
                  <label className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Years of Experience</label>
                  <input 
                    type="number" 
                    required
                    min={0}
                    value={coachForm.experience_years}
                    onChange={(e) => setCoachForm({ ...coachForm, experience_years: parseInt(e.target.value) || 0 })}
                    className="bg-gray-950 border border-gray-850 focus:border-[#D50C3A] focus:ring-1 focus:ring-[#D50C3A] text-white rounded-xl px-4 py-3 text-sm outline-none font-medium" 
                  />
                </div>
              </div>

              <div className="space-y-2 flex flex-col">
                <label className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Specialty / Title</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Head Badminton Coach & Secretary"
                  value={coachForm.specialty}
                  onChange={(e) => setCoachForm({ ...coachForm, specialty: e.target.value })}
                  className="bg-gray-950 border border-gray-850 focus:border-[#D50C3A] focus:ring-1 focus:ring-[#D50C3A] text-white rounded-xl px-4 py-3 text-sm outline-none font-medium" 
                />
              </div>

              <div className="space-y-2 flex flex-col">
                <label className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Biography Profile</label>
                <textarea 
                  rows={4} 
                  required
                  placeholder="Write a brief bio about the coach..."
                  value={coachForm.bio}
                  onChange={(e) => setCoachForm({ ...coachForm, bio: e.target.value })}
                  className="bg-gray-950 border border-gray-850 focus:border-[#D50C3A] focus:ring-1 focus:ring-[#D50C3A] text-white rounded-xl px-4 py-3 text-sm outline-none font-medium resize-none" 
                />
              </div>

              <div className="space-y-2 flex flex-col">
                <label className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Coach Photo</label>
                {editingItem?.image && !coachImage && (
                  <p className="text-[10px] text-gray-500 font-semibold mb-1">Current: {editingItem.image.split('/').pop()}</p>
                )}
                <div className="border border-dashed border-gray-800 rounded-xl p-4 flex items-center gap-3 bg-gray-950/40">
                  <Upload size={20} className="text-gray-500" />
                  <input 
                    type="file" 
                    accept="image/*"
                    required={!editingItem}
                    onChange={(e) => setCoachImage(e.target.files?.[0] || null)}
                    className="text-xs text-gray-400 file:mr-4 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-[9px] file:font-extrabold file:uppercase file:bg-gray-900 file:text-gray-300 file:cursor-pointer hover:file:bg-[#D50C3A] hover:file:text-white"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={closeModal}
                  className="px-5 py-2.5 bg-gray-950 hover:bg-gray-850 border border-gray-850 rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2.5 bg-[#D50C3A] hover:bg-[#b00b30] text-white text-xs font-bold uppercase tracking-wider rounded-lg flex items-center gap-1.5 cursor-pointer"
                >
                  {actionLoading ? 'Saving...' : 'Save Profile'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* 3. GALLERY UPLOAD MODAL */}
      {activeModal === 'gallery' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 text-left">
          <div onClick={closeModal} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
          <div className="relative w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-2xl z-10 flex flex-col">
            <button 
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-450 hover:text-white"
            >
              <X size={20} />
            </button>
            <div className="p-6 border-b border-gray-800">
              <h3 className="text-xl font-bold text-white font-montserrat uppercase tracking-wider">
                Upload Gallery Image
              </h3>
            </div>
            <form onSubmit={handleGallerySubmit} className="p-6 space-y-5">
              
              <div className="space-y-2 flex flex-col">
                <label className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Image Title (Optional)</label>
                <input 
                  type="text" 
                  placeholder="e.g. Club Badminton Court A"
                  value={galleryTitle}
                  onChange={(e) => setGalleryTitle(e.target.value)}
                  className="bg-gray-950 border border-gray-850 focus:border-[#D50C3A] focus:ring-1 focus:ring-[#D50C3A] text-white rounded-xl px-4 py-3 text-sm outline-none font-medium" 
                />
              </div>

              <div className="space-y-2 flex flex-col">
                <label className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Select File</label>
                <div className="border border-dashed border-gray-800 rounded-xl p-6 flex flex-col items-center gap-3 bg-gray-950/40 text-center">
                  <Upload size={30} className="text-gray-500 mb-1" />
                  <input 
                    type="file" 
                    accept="image/*"
                    required
                    onChange={(e) => setGalleryImage(e.target.files?.[0] || null)}
                    className="text-xs text-gray-400 file:mr-4 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-[9px] file:font-extrabold file:uppercase file:bg-gray-900 file:text-gray-300 file:cursor-pointer hover:file:bg-[#D50C3A] hover:file:text-white"
                  />
                  <p className="text-[10px] text-gray-600 mt-2">WebP, PNG, or JPEG image files accepted.</p>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={closeModal}
                  className="px-5 py-2.5 bg-gray-950 hover:bg-gray-850 border border-gray-850 rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2.5 bg-[#D50C3A] hover:bg-[#b00b30] text-white text-xs font-bold uppercase tracking-wider rounded-lg flex items-center gap-1.5 cursor-pointer"
                >
                  {actionLoading ? 'Uploading...' : 'Upload Asset'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
