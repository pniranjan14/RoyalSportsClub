'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { KeyRound, User, Lock, AlertCircle } from 'lucide-react';

export default function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Redirect if already logged in
    const token = api.getToken();
    if (token) {
      router.push('/admin/dashboard');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const success = await api.login(username, password);
    setLoading(false);

    if (success) {
      router.push('/admin/dashboard');
    } else {
      setError('Invalid username or password. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col justify-center items-center px-6 py-12 relative overflow-hidden font-poppins">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#D50C3A]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md z-10">
        {/* Logo and Brand Header */}
        <div className="flex flex-col items-center mb-8">
          <img 
            src="/images/logo.png" 
            alt="Royal Sports Club Logo" 
            className="h-20 w-auto object-contain mb-4 drop-shadow-[0_4px_12px_rgba(213,12,58,0.2)]"
          />
          <h1 className="text-2xl font-extrabold text-white uppercase tracking-wider font-montserrat">
            RSC Admin Portal
          </h1>
          <p className="text-xs text-gray-500 font-medium tracking-wide mt-1">
            Sign in to manage Royal Sports Club content
          </p>
        </div>

        {/* Glassmorphic Login Card */}
        <div className="bg-gray-900/40 backdrop-blur-lg border border-gray-800/80 rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Username Input */}
            <div className="space-y-2 flex flex-col text-left">
              <label className="text-[10px] uppercase tracking-wider text-gray-400 font-bold flex items-center gap-1.5">
                <User size={12} className="text-[#D50C3A]" />
                Username
              </label>
              <div className="relative">
                <input 
                  type="text" 
                  required
                  placeholder="Enter admin username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-gray-950/80 border border-gray-800 focus:border-[#D50C3A] focus:ring-1 focus:ring-[#D50C3A] text-white placeholder-gray-600 rounded-xl px-4 py-3.5 text-sm font-medium transition-all outline-none" 
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2 flex flex-col text-left">
              <label className="text-[10px] uppercase tracking-wider text-gray-400 font-bold flex items-center gap-1.5">
                <Lock size={12} className="text-[#D50C3A]" />
                Password
              </label>
              <div className="relative">
                <input 
                  type="password" 
                  required
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-950/80 border border-gray-800 focus:border-[#D50C3A] focus:ring-1 focus:ring-[#D50C3A] text-white placeholder-gray-600 rounded-xl px-4 py-3.5 text-sm font-medium transition-all outline-none" 
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2.5 bg-[#D50C3A]/10 border border-[#D50C3A]/30 text-[#D50C3A] p-4 rounded-xl text-xs font-semibold leading-relaxed">
                <AlertCircle size={16} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#D50C3A] hover:bg-[#b00b30] disabled:opacity-50 disabled:pointer-events-none text-white font-extrabold rounded-xl shadow-lg uppercase tracking-widest text-xs flex items-center justify-center space-x-2 transition-all duration-300 hover:scale-[1.01] cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <KeyRound size={14} />
                  <span>Secure Log In</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Back Link */}
        <div className="text-center mt-6">
          <button 
            onClick={() => router.push('/')}
            className="text-xs text-gray-600 hover:text-white transition-colors"
          >
            ← Back to Public Website
          </button>
        </div>

      </div>
    </div>
  );
}
