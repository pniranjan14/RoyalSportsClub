'use client';

import { Phone, Mail, MapPin, Facebook, Instagram, Youtube, Twitter } from 'lucide-react';

interface FooterProps {
  address?: string;
  phone?: string;
  email?: string;
  mapEmbedUrl?: string;
}

export default function Footer({
  address = 'Room No. 8/22, Salkara Buildings, Temple Road, Ettumanoor P.O., Kottayam District, Kerala, PIN 686631',
  phone = '+91 94473 02176',
  email = 'gprasanthsupriya@gmail.com',
  mapEmbedUrl = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3933.153928131336!2d76.56453911145328!3d9.667954914948833!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b062b8fa20eeef3%3A0xbccf063a8a3a0e42!2sEttumanoor%2C%20Kerala%20686631!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin'
}: FooterProps) {

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-gray-950 border-t border-gray-900 pt-16 pb-8 text-gray-400">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
        {/* Column 1: About & Info */}
        <div className="space-y-6 font-poppins">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <img 
              src="/images/logo.png" 
              alt="Royal Sports Club Logo" 
              className="h-10 md:h-11 w-auto object-contain transition-transform duration-300 hover:scale-105"
            />
            <div>
              <span className="font-extrabold text-lg tracking-wider block text-white font-montserrat">ROYAL</span>
              <span className="text-[10px] text-[#D50C3A] font-extrabold uppercase tracking-widest block -mt-1">SPORTS CLUB</span>
            </div>
          </div>
          <p className="text-xs leading-relaxed text-gray-450 text-justify">
            Royal Sports Club is Ettumanoor's premier sports organization, affiliated with Kottayam District Badminton Association, dedicated to promoting badminton, football, and athletic talent.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="w-9 h-9 bg-gray-900 rounded-full flex items-center justify-center hover:bg-[#D50C3A] hover:text-white transition-all" aria-label="Facebook">
              <Facebook size={16} />
            </a>
            <a href="#" className="w-9 h-9 bg-gray-900 rounded-full flex items-center justify-center hover:bg-[#D50C3A] hover:text-white transition-all" aria-label="Instagram">
              <Instagram size={16} />
            </a>
            <a href="#" className="w-9 h-9 bg-gray-900 rounded-full flex items-center justify-center hover:bg-[#D50C3A] hover:text-white transition-all" aria-label="Twitter">
              <Twitter size={16} />
            </a>
            <a href="#" className="w-9 h-9 bg-gray-900 rounded-full flex items-center justify-center hover:bg-[#D50C3A] hover:text-white transition-all" aria-label="Youtube">
              <Youtube size={16} />
            </a>
          </div>
        </div>

        {/* Column 2: Contact Details & Quick Links */}
        <div className="grid grid-cols-2 gap-6 font-poppins">
          <div>
            <h3 className="text-white font-bold text-xs uppercase tracking-wider mb-4 border-l-2 border-[#D50C3A] pl-3">Links</h3>
            <ul className="space-y-3 text-xs">
              <li><button onClick={() => scrollToSection('home')} className="hover:text-[#D50C3A] transition-colors">Home</button></li>
              <li><button onClick={() => scrollToSection('about')} className="hover:text-[#D50C3A] transition-colors">About Us</button></li>
              <li><button onClick={() => scrollToSection('sports')} className="hover:text-[#D50C3A] transition-colors">Facilities</button></li>
              <li><button onClick={() => scrollToSection('news')} className="hover:text-[#D50C3A] transition-colors">News & Events</button></li>
              <li><button onClick={() => scrollToSection('membership')} className="hover:text-[#D50C3A] transition-colors">Memberships</button></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-bold text-xs uppercase tracking-wider mb-4 border-l-2 border-[#D50C3A] pl-3">Contact</h3>
            <ul className="space-y-4 text-xs">
              <li className="flex items-start space-x-2.5 text-justify">
                <MapPin size={16} className="text-[#D50C3A] shrink-0 mt-0.5" />
                <span className="leading-tight">{address}</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Phone size={16} className="text-[#D50C3A] shrink-0" />
                <span>{phone}</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Mail size={16} className="text-[#D50C3A] shrink-0" />
                <span className="break-all">{email}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Column 3: Live Map */}
        <div className="space-y-4 font-poppins">
          <h3 className="text-white font-bold text-xs uppercase tracking-wider border-l-2 border-[#D50C3A] pl-3">Find Us</h3>
          <div className="w-full h-44 rounded-lg overflow-hidden border border-gray-800 shadow-md">
            <iframe
              src={mapEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Google Map Location"
            ></iframe>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-8 border-t border-gray-900 flex flex-col md:flex-row items-center justify-between text-xs space-y-4 md:space-y-0">
        <p>© {new Date().getFullYear()} Royal Sports Club. All rights reserved.</p>
        <div className="flex space-x-6">
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Sitemap</a>
        </div>
      </div>
    </footer>
  );
}
