import  { useState } from 'react';
import { Store,   CheckCircle, Check, MapPin } from 'lucide-react';
import type { MedicineRequest } from '../types/pharmacy';

export default function PharmacyDashboardPage() {
  const [systemRequest, setSystemRequest] = useState<MedicineRequest | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const handleAcceptOrder = () => {
    if (systemRequest) {
      setSystemRequest({
        ...systemRequest,
        status: 'OFFERS_RECEIVED',
        offers: [{ pharmacyId: 'p2', pharmacyName: 'Apollo Pharmacy', distanceKm: 2.5 }]
      });
      setNotification("Offer sent successfully to patient!");
      setTimeout(() => setNotification(null), 3000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 px-4 py-6 font-sans">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Partner Pharmacy Dashboard</h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5 flex items-center gap-1.5">
            <Store className="w-4 h-4 text-purple-600" /> Apollo Pharmacy (Active Service Node)
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-200 text-xs font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Live & Listening
        </div>
      </div>

      {notification && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl font-bold text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 shrink-0" /> {notification}
        </div>
      )}

      <div className="space-y-4">
        <h3 className="font-black text-base text-slate-900">Incoming Broadcasts</h3>
        {!systemRequest || systemRequest.status !== 'OPEN' ? (
          <div className="bg-white border border-slate-200 border-dashed rounded-2xl p-12 text-center text-slate-400 text-xs font-medium">
            No incoming medicine broadcasts right now. Switch to Patient App to place a test order.
          </div>
        ) : (
          <div className="bg-white border-2 border-purple-500 shadow-md rounded-2xl p-6 space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h4 className="font-black text-base text-slate-900">Order ID: {systemRequest.id}</h4>
              <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-100 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> {systemRequest.distanceKm} km away
              </span>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Requested Medicines:</p>
              {systemRequest.medicines.map((m, idx) => (
                <div key={idx} className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl border text-xs">
                  <span className="font-bold text-slate-900">💊 {m.name} ({m.dosage})</span>
                  <span className="font-bold text-purple-700">Qty: {m.quantity}</span>
                </div>
              ))}
            </div>

            <button 
              onClick={handleAcceptOrder}
              className="w-full py-3 bg-[#5B21B6] hover:bg-[#4c1d95] text-white rounded-xl font-black text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              <Check className="w-4 h-4" /> Send Fulfillment Offer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}