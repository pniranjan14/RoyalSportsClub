'use client';

import { useState, useEffect } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';

interface HeaderProps {
  phone?: string;
  email?: string;
}

export default function Header({ phone = '+91 94473 02176', email = 'gprasanthsupriya@gmail.com' }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Check active section
      const sections = ['home', 'about', 'sports', 'news', 'membership', 'gallery', 'contact'];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120 && rect.bottom >= 120) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setIsOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-gray-950/95 backdrop-blur-md border-b border-gray-900 py-3 shadow-lg'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Brand Logo - Stylized similar to RSC Kochi */}
        <div 
          className="flex items-center space-x-3 cursor-pointer" 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <img 
            src="/images/logo.png" 
            alt="Royal Sports Club Logo" 
            className="h-11 md:h-12 w-auto object-contain transition-transform duration-300 hover:scale-105"
          />
          <div>
            <span className="font-extrabold text-lg tracking-wider block text-white font-montserrat">ROYAL</span>
            <span className="text-[10px] text-[#D50C3A] font-extrabold uppercase tracking-widest block -mt-1 font-poppins">SPORTS CLUB</span>
          </div>
        </div>

        {/* Navigation - Desktop (Dropdowns structured like rsckochi.com) */}
        <nav className="hidden lg:flex items-center space-x-8 font-poppins text-sm">
          <button 
            onClick={() => scrollToSection('home')} 
            className={`font-semibold uppercase tracking-wider transition-colors hover:text-[#D50C3A] ${
              activeSection === 'home' ? 'text-[#D50C3A]' : 'text-gray-300'
            }`}
          >
            Home
          </button>
          
          <button 
            onClick={() => scrollToSection('about')} 
            className={`font-semibold uppercase tracking-wider transition-colors hover:text-[#D50C3A] ${
              activeSection === 'about' ? 'text-[#D50C3A]' : 'text-gray-300'
            }`}
          >
            About Us
          </button>

          {/* Facilities Dropdown */}
          <div className="relative group py-2">
            <span className="flex items-center gap-1 cursor-pointer font-semibold uppercase tracking-wider text-gray-300 hover:text-[#D50C3A] transition-colors">
              Facilities <ChevronDown size={14} className="transition-transform group-hover:rotate-180" />
            </span>
            <ul className="absolute top-full left-0 mt-1 bg-gray-900 border border-gray-800 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 min-w-[200px] rounded-lg overflow-hidden py-1">
              <li>
                <button 
                  onClick={() => scrollToSection('sports')} 
                  className="w-full text-left px-4 py-2.5 text-xs font-semibold text-gray-300 hover:bg-[#D50C3A] hover:text-white transition-colors"
                >
                  Sports Academies
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('sports')} 
                  className="w-full text-left px-4 py-2.5 text-xs font-semibold text-gray-300 hover:bg-[#D50C3A] hover:text-white transition-colors"
                >
                  Badminton Training
                </button>
              </li>
            </ul>
          </div>

          {/* Memberships */}
          <button 
            onClick={() => scrollToSection('membership')} 
            className={`font-semibold uppercase tracking-wider transition-colors hover:text-[#D50C3A] ${
              activeSection === 'membership' ? 'text-[#D50C3A]' : 'text-gray-300'
            }`}
          >
            Memberships
          </button>

          {/* Insights / News */}
          <button 
            onClick={() => scrollToSection('news')} 
            className={`font-semibold uppercase tracking-wider transition-colors hover:text-[#D50C3A] ${
              activeSection === 'news' ? 'text-[#D50C3A]' : 'text-gray-300'
            }`}
          >
            News & Events
          </button>

          {/* Gallery */}
          <button 
            onClick={() => scrollToSection('gallery')} 
            className={`font-semibold uppercase tracking-wider transition-colors hover:text-[#D50C3A] ${
              activeSection === 'gallery' ? 'text-[#D50C3A]' : 'text-gray-300'
            }`}
          >
            Gallery
          </button>

          <button 
            onClick={() => scrollToSection('contact')} 
            className={`font-semibold uppercase tracking-wider transition-colors hover:text-[#D50C3A] ${
              activeSection === 'contact' ? 'text-[#D50C3A]' : 'text-gray-300'
            }`}
          >
            Contact
          </button>
        </nav>

        {/* Join button */}
        <div className="hidden lg:flex items-center">
          <button
            onClick={() => scrollToSection('contact')}
            className="px-6 py-2.5 bg-[#D50C3A] hover:bg-[#b00b30] text-white font-extrabold rounded-full shadow-md transition-all duration-300 uppercase tracking-widest text-xs hover:scale-105"
          >
            Apply Now
          </button>
        </div>

        {/* Mobile menu trigger */}
        <div className="lg:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-gray-350 hover:text-white p-2" aria-label="Toggle menu">
            {isOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`lg:hidden fixed inset-0 top-[60px] bg-gray-950/98 backdrop-blur-lg z-45 transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col p-8 space-y-6">
          <button onClick={() => scrollToSection('home')} className="text-left text-lg font-bold text-gray-200 hover:text-[#D50C3A] uppercase tracking-wider border-b border-gray-900 pb-2">Home</button>
          <button onClick={() => scrollToSection('about')} className="text-left text-lg font-bold text-gray-200 hover:text-[#D50C3A] uppercase tracking-wider border-b border-gray-900 pb-2">About Us</button>
          <button onClick={() => scrollToSection('sports')} className="text-left text-lg font-bold text-gray-200 hover:text-[#D50C3A] uppercase tracking-wider border-b border-gray-900 pb-2">Sports Facilities</button>
          <button onClick={() => scrollToSection('membership')} className="text-left text-lg font-bold text-gray-200 hover:text-[#D50C3A] uppercase tracking-wider border-b border-gray-900 pb-2">Memberships</button>
          <button onClick={() => scrollToSection('news')} className="text-left text-lg font-bold text-gray-200 hover:text-[#D50C3A] uppercase tracking-wider border-b border-gray-900 pb-2">News & Tournaments</button>
          <button onClick={() => scrollToSection('gallery')} className="text-left text-lg font-bold text-gray-200 hover:text-[#D50C3A] uppercase tracking-wider border-b border-gray-900 pb-2">Gallery</button>
          <button onClick={() => scrollToSection('contact')} className="text-left text-lg font-bold text-gray-200 hover:text-[#D50C3A] uppercase tracking-wider border-b border-gray-900 pb-2">Contact</button>
          
          <button
            onClick={() => scrollToSection('contact')}
            className="w-full py-3.5 mt-4 bg-[#D50C3A] text-white font-extrabold rounded-full text-center uppercase tracking-widest shadow-md"
          >
            Apply Now
          </button>
        </div>
      </div>
    </header>
  );
}
