import React from "react";

export const HospitalDetailsSkeleton: React.FC = () => {
  return (
    <div className="max-w-xl md:max-w-4xl mx-auto pb-24 animate-pulse bg-[#F8FAFC] min-h-screen">
      <div className="w-full h-56 bg-gray-200 rounded-b-3xl"></div>
      <div className="p-5 space-y-4">
        <div className="h-7 bg-gray-200 rounded w-2/3"></div>
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        
        <div className="grid grid-cols-4 gap-2 my-5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 rounded-xl"></div>
          ))}
        </div>

        <div className="space-y-3">
          <div className="h-5 bg-gray-200 rounded w-1/4"></div>
          <div className="h-12 bg-gray-200 rounded-xl"></div>
          <div className="h-12 bg-gray-200 rounded-xl"></div>
        </div>

        <div className="space-y-3">
          <div className="h-5 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-4 gap-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};