import React from "react";

export const BedBookingSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse space-y-4 p-6 bg-white rounded-lg border border-gray-100">
      <div className="h-6 bg-gray-200 rounded w-1/3"></div>
      <div className="h-32 bg-gray-100 rounded"></div>
      <div className="h-10 bg-gray-200 rounded"></div>
    </div>
  );
};