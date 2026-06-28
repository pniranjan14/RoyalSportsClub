export const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
export const API_URL = `${API_BASE}/api`;

export interface ClubDetail {
  id: number;
  president_name: string;
  president_photo: string | null;
  president_message: string;
  secretary_name: string;
  secretary_photo: string | null;
  secretary_message: string;
  phone: string;
  email: string;
  address: string;
  map_embed_url: string | null;
}

export interface Sport {
  id: number;
  name: string;
  slug: string;
  description: string;
  schedule: string;
  image: string;
  order: number;
}

export interface Coach {
  id: number;
  name: string;
  specialty: string;
  bio: string;
  image: string;
  experience_years: number;
}

export interface NewsUpdate {
  id: number;
  title: string;
  slug: string;
  content: string;
  category: 'news' | 'tournament' | 'update';
  category_display: string;
  date_posted: string;
  image: string | null;
}

export interface MembershipPlan {
  id: number;
  name: string;
  price: string;
  duration: string;
  features: string;
  features_list: string[];
}

export interface GalleryImage {
  id: number;
  title: string;
  image: string;
  upload_date: string;
}

export interface InquiryInput {
  name: string;
  email: string;
  phone: string;
  sport: string;
  message: string;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API error: ${response.status} - ${errorText}`);
  }
  return response.json() as Promise<T>;
}

const getFetchOptions = (): RequestInit => {
  if (process.env.NODE_ENV === 'development') {
    return { cache: 'no-store' };
  }
  return { next: { revalidate: 60 } };
};

export const api = {
  getClubDetails: async (): Promise<ClubDetail | null> => {
    try {
      const res = await fetch(`${API_URL}/club-details/active/`, {
        ...getFetchOptions()
      });
      return await handleResponse<ClubDetail>(res);
    } catch (error) {
      console.error('Failed to fetch club details:', error);
      return null;
    }
  },

  getSports: async (): Promise<Sport[]> => {
    try {
      const res = await fetch(`${API_URL}/sports/`, {
        ...getFetchOptions()
      });
      return await handleResponse<Sport[]>(res);
    } catch (error) {
      console.error('Failed to fetch sports:', error);
      return [];
    }
  },

  getSportBySlug: async (slug: string): Promise<Sport | null> => {
    try {
      const res = await fetch(`${API_URL}/sports/${slug}/`, {
        ...getFetchOptions()
      });
      return await handleResponse<Sport>(res);
    } catch (error) {
      console.error(`Failed to fetch sport ${slug}:`, error);
      return null;
    }
  },

  getCoaches: async (): Promise<Coach[]> => {
    try {
      const res = await fetch(`${API_URL}/coaches/`, {
        ...getFetchOptions()
      });
      return await handleResponse<Coach[]>(res);
    } catch (error) {
      console.error('Failed to fetch coaches:', error);
      return [];
    }
  },

  getNews: async (category?: string): Promise<NewsUpdate[]> => {
    try {
      const url = category ? `${API_URL}/news/?category=${category}` : `${API_URL}/news/`;
      const res = await fetch(url, {
        ...getFetchOptions()
      });
      return await handleResponse<NewsUpdate[]>(res);
    } catch (error) {
      console.error('Failed to fetch news updates:', error);
      return [];
    }
  },

  getNewsBySlug: async (slug: string): Promise<NewsUpdate | null> => {
    try {
      const res = await fetch(`${API_URL}/news/${slug}/`, {
        ...getFetchOptions()
      });
      return await handleResponse<NewsUpdate>(res);
    } catch (error) {
      console.error(`Failed to fetch news post ${slug}:`, error);
      return null;
    }
  },

  getPlans: async (): Promise<MembershipPlan[]> => {
    try {
      const res = await fetch(`${API_URL}/plans/`, {
        ...getFetchOptions()
      });
      return await handleResponse<MembershipPlan[]>(res);
    } catch (error) {
      console.error('Failed to fetch membership plans:', error);
      return [];
    }
  },

  getGallery: async (): Promise<GalleryImage[]> => {
    try {
      const res = await fetch(`${API_URL}/gallery/`, {
        ...getFetchOptions()
      });
      return await handleResponse<GalleryImage[]>(res);
    } catch (error) {
      console.error('Failed to fetch gallery images:', error);
      return [];
    }
  },

  submitInquiry: async (inquiry: InquiryInput): Promise<boolean> => {
    try {
      const res = await fetch(`${API_URL}/inquiries/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inquiry),
      });
      return res.ok;
    } catch (error) {
      console.error('Failed to submit inquiry:', error);
      return false;
    }
  },

  // --- Admin API Section ---
  getToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('rsc_admin_token');
    }
    return null;
  },

  setToken: (token: string | null): void => {
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('rsc_admin_token', token);
      } else {
        localStorage.removeItem('rsc_admin_token');
      }
    }
  },

  login: async (username: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      if (res.ok) {
        const data = await res.json() as { token: string };
        api.setToken(data.token);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  },

  logout: (): void => {
    api.setToken(null);
  },

  // Inquiries CRUD (Admin view)
  getInquiries: async (): Promise<any[]> => {
    try {
      const res = await fetch(`${API_URL}/inquiries/`, {
        headers: getAuthHeaders(),
      });
      return await handleResponse<any[]>(res);
    } catch (error) {
      console.error('Failed to fetch inquiries:', error);
      return [];
    }
  },

  resolveInquiry: async (id: number, resolved: boolean): Promise<boolean> => {
    try {
      const res = await fetch(`${API_URL}/inquiries/${id}/`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ resolved }),
      });
      return res.ok;
    } catch (error) {
      console.error(`Failed to resolve inquiry ${id}:`, error);
      return false;
    }
  },

  deleteInquiry: async (id: number): Promise<boolean> => {
    try {
      const res = await fetch(`${API_URL}/inquiries/${id}/`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      return res.ok;
    } catch (error) {
      console.error(`Failed to delete inquiry ${id}:`, error);
      return false;
    }
  },

  // News CRUD
  createNews: async (formData: FormData): Promise<boolean> => {
    try {
      const res = await fetch(`${API_URL}/news/`, {
        method: 'POST',
        headers: getAuthHeaders(true),
        body: formData,
      });
      return res.ok;
    } catch (error) {
      console.error('Failed to create news:', error);
      return false;
    }
  },

  updateNews: async (slug: string, formData: FormData): Promise<boolean> => {
    try {
      const res = await fetch(`${API_URL}/news/${slug}/`, {
        method: 'PUT',
        headers: getAuthHeaders(true),
        body: formData,
      });
      return res.ok;
    } catch (error) {
      console.error(`Failed to update news ${slug}:`, error);
      return false;
    }
  },

  deleteNews: async (slug: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_URL}/news/${slug}/`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      return res.ok;
    } catch (error) {
      console.error(`Failed to delete news ${slug}:`, error);
      return false;
    }
  },

  // Coaches CRUD
  createCoach: async (formData: FormData): Promise<boolean> => {
    try {
      const res = await fetch(`${API_URL}/coaches/`, {
        method: 'POST',
        headers: getAuthHeaders(true),
        body: formData,
      });
      return res.ok;
    } catch (error) {
      console.error('Failed to create coach:', error);
      return false;
    }
  },

  updateCoach: async (id: number, formData: FormData): Promise<boolean> => {
    try {
      const res = await fetch(`${API_URL}/coaches/${id}/`, {
        method: 'PUT',
        headers: getAuthHeaders(true),
        body: formData,
      });
      return res.ok;
    } catch (error) {
      console.error(`Failed to update coach ${id}:`, error);
      return false;
    }
  },

  deleteCoach: async (id: number): Promise<boolean> => {
    try {
      const res = await fetch(`${API_URL}/coaches/${id}/`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      return res.ok;
    } catch (error) {
      console.error(`Failed to delete coach ${id}:`, error);
      return false;
    }
  },

  // Club Details CRUD
  updateClubDetails: async (id: number, formData: FormData): Promise<boolean> => {
    try {
      const res = await fetch(`${API_URL}/club-details/${id}/`, {
        method: 'PUT',
        headers: getAuthHeaders(true),
        body: formData,
      });
      return res.ok;
    } catch (error) {
      console.error(`Failed to update club details ${id}:`, error);
      return false;
    }
  },

  // Gallery CRUD
  createGalleryImage: async (formData: FormData): Promise<boolean> => {
    try {
      const res = await fetch(`${API_URL}/gallery/`, {
        method: 'POST',
        headers: getAuthHeaders(true),
        body: formData,
      });
      return res.ok;
    } catch (error) {
      console.error('Failed to upload gallery image:', error);
      return false;
    }
  },

  deleteGalleryImage: async (id: number): Promise<boolean> => {
    try {
      const res = await fetch(`${API_URL}/gallery/${id}/`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      return res.ok;
    } catch (error) {
      console.error(`Failed to delete gallery image ${id}:`, error);
      return false;
    }
  }
};

const getAuthHeaders = (isMultipart = false): Record<string, string> => {
  const headers: Record<string, string> = {};
  if (!isMultipart) {
    headers['Content-Type'] = 'application/json';
  }
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('rsc_admin_token');
    if (token) {
      headers['Authorization'] = `Token ${token}`;
    }
  }
  return headers;
};
