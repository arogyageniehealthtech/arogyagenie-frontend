import React from 'react';
import { Link } from 'react-router'; 
import { 
  Phone, 
  Mail, 
  MapPin, 
  ArrowRight
} from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-slate-900 pt-16 pb-28 lg:pb-10 overflow-hidden font-sans border-t border-slate-800">
      
     
      <div className="absolute top-0 left-0 w-72 h-72 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl pointer-events-none translate-x-1/2 translate-y-1/2"></div>

      <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10">
        
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-12">
          
         
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              
              <img 
                src="/LOGO.png" 
                alt="ArogyaGenie Logo" 
                className="w-11 h-11 rounded-full bg-white p-0.5 shadow-lg shadow-indigo-600/30 object-contain"
              />
              <h2 className="text-2xl font-bold text-white tracking-wide">
                Arogya<span className="text-indigo-400">Genie</span>
              </h2>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mt-2">
              Your intelligent healthcare companion. Combining advanced AI with top-tier medical professionals to bring premium care to your fingertips.
            </p>
            
          
            <div className="flex items-center gap-4 mt-2">
              
             
              <a href="#" aria-label="Facebook" className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-indigo-600 hover:text-white transition-all duration-300 hover:-translate-y-1">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>

             
              <a href="#" aria-label="Twitter" className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-indigo-600 hover:text-white transition-all duration-300 hover:-translate-y-1">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
              </a>

             
              <a href="#" aria-label="Instagram" className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-indigo-600 hover:text-white transition-all duration-300 hover:-translate-y-1">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>

            </div>
          </div>

         
          <div>
            <h3 className="text-white font-bold text-lg mb-5">Quick Links</h3>
            <ul className="flex flex-col gap-3">
              {['Dashboard', 'AI Health Chat', 'Find a Doctor', 'My Appointments', 'Health Records'].map((item) => (
                <li key={item}>
                  <Link to="#" className="text-slate-400 text-sm font-medium hover:text-indigo-400 flex items-center gap-2 group transition-colors">
                    <ArrowRight size={14} className="text-slate-600 group-hover:text-indigo-400 transform group-hover:translate-x-1 transition-all" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        
          <div>
            <h3 className="text-white font-bold text-lg mb-5">Our Services</h3>
            <ul className="flex flex-col gap-3">
              {['General Consultation', 'Specialist Care', 'Pharmacy Delivery', 'Lab Tests & Diagnostics', 'Diet & Nutrition'].map((item) => (
                <li key={item}>
                  <Link to="#" className="text-slate-400 text-sm font-medium hover:text-indigo-400 flex items-center gap-2 group transition-colors">
                    <ArrowRight size={14} className="text-slate-600 group-hover:text-indigo-400 transform group-hover:translate-x-1 transition-all" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

         
          <div>
            <h3 className="text-white font-bold text-lg mb-5">Contact Us</h3>
            <ul className="flex flex-col gap-4">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-indigo-400 shrink-0 mt-0.5" />
                <span className="text-slate-400 text-sm leading-relaxed">
                  123 Health Avenue, Tech Park<br />
                  Kolkata, West Bengal 700001
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-indigo-400 shrink-0" />
                <a href="mailto:support@arogyagenie.com" className="text-slate-400 text-sm hover:text-white transition-colors">
                  support@arogyagenie.com
                </a>
              </li>
              
             
              <li className="mt-2 bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">24/7 Emergency</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                    <Phone size={18} className="text-red-500" />
                  </div>
                  <a href="tel:102" className="text-xl font-bold text-white hover:text-red-400 transition-colors">
                    102
                  </a>
                </div>
              </li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm text-center md:text-left">
            © {currentYear} ArogyaGenie. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm font-medium">
            <Link to="#" className="text-slate-500 hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="#" className="text-slate-500 hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};