
import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const TrustBanner: React.FC = () => {
  return (
    <div className="bg-indigo-600 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden shadow-[0_12px_40px_-10px_rgba(79,70,229,0.4)]">
      {/* Decorative Background Circles */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2 opacity-50"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-700 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2 opacity-50"></div>
      
      <div className="relative z-10 flex flex-col items-center">
        <ShieldCheck className="w-16 h-16 text-indigo-200 mb-6" strokeWidth={1.5} />
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
          Your Data, Fully Protected
        </h2>
        <p className="text-indigo-100 max-w-2xl mx-auto mb-8 font-medium">
          We use bank-level encryption and strictly adhere to global healthcare data regulations. Your medical history and AI interactions remain 100% private and secure.
        </p>
      </div>
    </div>
  );
};