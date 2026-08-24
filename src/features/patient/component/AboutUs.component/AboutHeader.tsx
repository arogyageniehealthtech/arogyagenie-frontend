import React from 'react';

export const AboutHeader: React.FC = () => {
  return (
    <div className="text-center max-w-3xl mx-auto mb-12">
      <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">
        Redefining <span className="text-indigo-600">Healthcare</span> for You
      </h1>
      <p className="text-slate-500 text-lg">
        ArogyaGenie bridges the gap between advanced artificial intelligence and compassionate human care, putting your health back in your hands.
      </p>
    </div>
  );
};