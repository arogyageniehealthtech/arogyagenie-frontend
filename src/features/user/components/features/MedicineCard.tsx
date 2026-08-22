import React from 'react';
import { Pill, Plus } from 'lucide-react';
import type{ Medicine } from '../../types/pharmacy';

export default function MedicineCard({ medicine, onAdd }: { medicine: Medicine; onAdd: () => void }) {
  return (
    <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600">
          <Pill className="w-6 h-6" />
        </div>
        <div>
          <h4 className="font-bold text-gray-900">{medicine.name}</h4>
          <p className="text-xs text-gray-500">{medicine.composition} • {medicine.packSize}</p>
          <p className="font-bold text-purple-700 mt-1">₹{medicine.price}</p>
        </div>
      </div>
      <button 
        onClick={onAdd}
        className="p-2 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg transition-colors"
      >
        <Plus className="w-5 h-5" />
      </button>
    </div>
  );
}