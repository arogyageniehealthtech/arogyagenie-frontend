import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  Navigation, Loader2, Clock, AlertCircle, 
  MapPin, CheckCircle2, ChevronRight, KeyRound, Check 
} from 'lucide-react';
import toast from 'react-hot-toast';
import { 
  setActiveDelivery, 
  updateActiveStatus, 
  clearActiveDelivery, 
  type DeliveryStatus 
} from '@/store/slices/deliverySlice';
import { deliveryApi } from '../api/deliveryApi';

const MOCK_REQS = [
  { id: '1', orderId: 'DLV-10245', pharmacy: { name: 'Apollo Pharmacy', address: '58 Canal Circular Rd, Kolkata' }, destination: { area: 'Salt Lake, Sector 5' }, distance: 6.4, estimatedTime: 25, earnings: 85, priority: 'HIGH' },
  { id: '2', orderId: 'DLV-10246', pharmacy: { name: 'Wellness Meds', address: 'Park Street, Kolkata' }, destination: { area: 'Ballygunge' }, distance: 2.1, estimatedTime: 12, earnings: 45, priority: 'NORMAL' },
];

const FLOW: Partial<Record<DeliveryStatus, DeliveryStatus>> = {
  ACCEPTED: 'GOING_TO_PICKUP',
  GOING_TO_PICKUP: 'ARRIVED_AT_PICKUP',
  ARRIVED_AT_PICKUP: 'PICKED_UP',
  PICKED_UP: 'OUT_FOR_DELIVERY',
  OUT_FOR_DELIVERY: 'ARRIVED_AT_DESTINATION',
  ARRIVED_AT_DESTINATION: 'DELIVERED',
};

const STEPS: DeliveryStatus[] = [
  'ACCEPTED',
  'GOING_TO_PICKUP',
  'ARRIVED_AT_PICKUP',
  'PICKED_UP',
  'OUT_FOR_DELIVERY',
  'ARRIVED_AT_DESTINATION',
];

const NODES = ['Accepted', 'To Store', 'At Store', 'Picked', 'Transit', 'Dropoff'];

const STATUS_INFO: Record<string, { title: string; desc: string; btn: string }> = {
  ACCEPTED: { title: 'Order Accepted', desc: 'Ready to start navigation to the pharmacy?', btn: 'Start Navigation' },
  GOING_TO_PICKUP: { title: 'Heading to Pharmacy', desc: 'Proceed to the pickup location.', btn: 'Arrived at Pharmacy' },
  ARRIVED_AT_PICKUP: { title: 'At Pharmacy', desc: 'Collect package from counter.', btn: 'Confirm Pickup' },
  PICKED_UP: { title: 'Medicine Picked Up', desc: 'Package secured. Head to patient.', btn: 'Start Delivery' },
  OUT_FOR_DELIVERY: { title: 'Out for Delivery', desc: 'Heading to customer destination.', btn: 'Arrived at Destination' },
  ARRIVED_AT_DESTINATION: { title: 'At Destination', desc: 'Verify OTP from customer to finish.', btn: 'Verify & Complete' },
  DELIVERED: { title: 'Delivered', desc: 'Order completed.', btn: 'Order Completed' },
};

export default function DeliveryRequests() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isOnline, activeDeliveryId } = useSelector((s: any) => s.delivery || {});
  const [acceptingId, setAcceptingId] = useState<string | null>(null);

  useEffect(() => {
    if (!isOnline) return;
    const interval = setInterval(() => {
      deliveryApi.updateLocation(22.5726, 88.3639).catch(() => {});
    }, 30000);
    return () => clearInterval(interval);
  }, [isOnline]);

  const { data: requests = MOCK_REQS, isLoading } = useQuery({
    queryKey: ['nearby-deliveries'],
    queryFn: async () => {
      const res = await deliveryApi.getNearbyRequests(22.5726, 88.3639, 10);
      return res.data?.length ? res.data : MOCK_REQS;
    },
    enabled: isOnline,
    refetchInterval: 15000,
  });

  const handleAccept = async (id: string) => {
    if (activeDeliveryId) return toast.error('Active delivery exists!');
    setAcceptingId(id);
    try {
      await deliveryApi.claimRequest(id);
    } catch {
      // Mock fallback
    } finally {
      dispatch(setActiveDelivery({ id, status: 'ACCEPTED' as DeliveryStatus }));
      toast.success('Order Accepted!');
      setAcceptingId(null);
    }
  };

  if (!isOnline) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] p-4 text-center">
        <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mb-3">
          <Navigation className="w-7 h-7 text-blue-600" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">You are offline</h2>
        <button 
          onClick={() => navigate('/delivery/dashboard')} 
          className="mt-3 px-5 py-2 bg-[#1E3A8A] hover:bg-[#172554] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  if (activeDeliveryId) {
    return <ActiveTracker delivery={requests.find((r: any) => r.id === activeDeliveryId) || MOCK_REQS[0]} />;
  }

  return (
    <div className="p-3 sm:p-6 max-w-6xl mx-auto space-y-4 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">Nearby Requests</h1>
          <p className="text-slate-500 text-xs sm:text-sm">{requests.length} orders available</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Live Radar
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200/80 divide-y divide-slate-100 overflow-hidden bg-white shadow-xs">
        {isLoading ? (
          <Loader2 className="w-8 h-8 animate-spin text-blue-700 mx-auto my-12" />
        ) : requests.length === 0 ? (
          <p className="text-center p-12 text-slate-400 text-xs font-bold">No requests available right now.</p>
        ) : (
          requests.map((req: any) => (
            <div key={req.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-blue-900 bg-blue-50 px-2 py-0.5 rounded-md">{req.orderId}</span>
                  {req.priority === 'HIGH' && (
                    <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> Urgent
                    </span>
                  )}
                </div>
                <div className="text-xs space-y-1">
                  <p className="font-bold text-slate-900 truncate">From: <span className="text-slate-600 font-medium">{req.pharmacy?.name}</span></p>
                  <p className="font-bold text-slate-900 truncate">To: <span className="text-slate-600 font-medium">{req.destination?.area}</span></p>
                </div>
              </div>

              <div className="flex items-center gap-6 text-xs shrink-0 border-y md:border-y-0 py-2 md:py-0 border-slate-100">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Payout</span>
                  <span className="font-black text-emerald-600 text-sm">₹{req.earnings || 50}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Distance</span>
                  <span className="font-bold text-slate-800">{req.distance || 3.2} km</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Est. Time</span>
                  <span className="font-bold text-slate-800">{req.estimatedTime || 15} min</span>
                </div>
              </div>

              <button 
                onClick={() => handleAccept(req.id)}
                disabled={Boolean(acceptingId)}
                className="w-full md:w-auto px-5 py-2.5 bg-[#1E3A8A] hover:bg-[#172554] text-white text-xs font-bold rounded-xl transition-all disabled:opacity-50 flex items-center justify-center min-w-24 shadow-sm cursor-pointer"
              >
                {acceptingId === req.id ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Accept Order'}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function ActiveTracker({ delivery }: any) {
  const dispatch = useDispatch();
  const activeStatus = useSelector((s: any) => (s.delivery?.activeDeliveryStatus as DeliveryStatus) || 'ACCEPTED');
  const [otp, setOtp] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const currentIdx = STEPS.indexOf(activeStatus);
  const ui = STATUS_INFO[activeStatus] || STATUS_INFO.ACCEPTED;
  const isAtDestination = activeStatus === 'ARRIVED_AT_DESTINATION';

  const handleNext = async () => {
    setIsUpdating(true);
    try {
      if (activeStatus === 'ARRIVED_AT_PICKUP') {
        await deliveryApi.confirmPickup(delivery.id, '1234');
      }
      if (isAtDestination) {
        if (otp.length > 0 && otp.length !== 4) {
          setIsUpdating(false);
          return toast.error('Enter a 4-digit PIN');
        }
        await deliveryApi.confirmDelivery(delivery.id, otp.trim() || '1234');
      }
    } catch {
      // Mock fallback
    }

    const next: DeliveryStatus = FLOW[activeStatus] || 'DELIVERED';
    dispatch(updateActiveStatus(next));
    setIsUpdating(false);

    if (next === 'DELIVERED') {
      toast.success('Delivery Completed! 🎉');
      setTimeout(() => dispatch(clearActiveDelivery()), 2000);
    }
  };

  return (
    <div className="max-w-6xl mx-auto min-h-[calc(100dvh-5rem)] md:h-[90vh] flex flex-col md:flex-row gap-3 sm:gap-4 p-3 sm:p-4 pb-16 md:pb-4">
      {/* 1. Map Container */}
      <div className="w-full h-48 sm:h-64 md:h-full md:flex-1 relative rounded-2xl overflow-hidden shadow-xs border border-slate-200 shrink-0">
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d117925.33439927763!2d88.26495085437812!3d22.535406374533036!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f882db4908f667%3A0x43e330e68f6c2cbc!2sKolkata%2C%20West%20Bengal!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
          className="absolute inset-0 w-full h-full border-0" 
          loading="lazy"
        />
        <div className="absolute top-2.5 left-2.5 bg-white/95 backdrop-blur px-2.5 py-1 rounded-lg font-bold text-[11px] sm:text-xs shadow-xs text-slate-800 flex items-center gap-1.5 z-10">
          <Clock className="w-3.5 h-3.5 text-blue-700" /> {delivery.estimatedTime || 15} min remaining
        </div>
      </div>

      {/* 2. Control Panel */}
      <div className="w-full md:w-96 bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm flex flex-col justify-between gap-3 sm:gap-4 shrink-0 md:shrink">
        <div className="space-y-3 sm:space-y-4">
          
          {/* Order Header */}
          <div>
            <div className="flex items-center justify-between mb-0.5">
              <h2 className="text-base sm:text-lg font-black text-slate-900 leading-tight">{ui.title}</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-900 border border-blue-100/80">
                {delivery.orderId}
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-500 font-medium">{ui.desc}</p>
          </div>

          {/* Stepper Nodes */}
          <div className="py-1">
            <div className="flex items-center justify-between relative">
              {NODES.map((label, i) => {
                const completed = currentIdx > i;
                const active = currentIdx === i;

                return (
                  <div key={label} className="flex-1 flex items-center last:flex-none">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[9px] sm:text-[10px] font-bold transition-all ${
                          completed
                            ? 'bg-[#1E3A8A] text-white'
                            : active
                            ? 'bg-[#1E3A8A] text-white ring-3 ring-blue-100 shadow-xs'
                            : 'bg-slate-100 text-slate-400 border border-slate-200'
                        }`}
                      >
                        {completed ? <Check className="w-3 h-3 stroke-[3]" /> : i + 1}
                      </div>
                      <span className={`text-[8px] sm:text-[9px] font-bold mt-1 text-center truncate max-w-[42px] sm:max-w-[48px] ${
                        active ? 'text-[#1E3A8A] font-black' : completed ? 'text-slate-600' : 'text-slate-400'
                      }`}>
                        {label}
                      </span>
                    </div>

                    {i < NODES.length - 1 && (
                      <div className="h-0.5 w-full bg-slate-200 mx-1 mb-3.5 sm:mb-4 relative overflow-hidden rounded-full">
                        <div
                          className={`h-full bg-[#1E3A8A] transition-all duration-300 ${
                            completed ? 'w-full' : 'w-0'
                          }`}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Verification / Address Information */}
          {isAtDestination ? (
            <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-3 sm:p-4 text-center space-y-1.5">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-emerald-100 text-emerald-700 rounded-lg flex items-center justify-center mx-auto">
                <KeyRound className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <p className="text-xs font-bold text-slate-800">Enter Customer PIN</p>
              <input 
                autoFocus
                type="text"
                inputMode="numeric"
                maxLength={4}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="••••"
                className="w-32 sm:w-36 text-center text-xl sm:text-2xl tracking-[0.3em] font-black bg-white border-2 border-emerald-300 rounded-xl py-1.5 sm:py-2 outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
              <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 block">{otp.length}/4 digits</span>
            </div>
          ) : activeStatus === 'DELIVERED' ? (
            <div className="text-center py-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-1" />
              <p className="font-bold text-slate-900 text-xs">Delivery Finished</p>
              <p className="text-xl font-black text-emerald-600">₹{delivery.earnings || 50}</p>
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-xs space-y-2.5">
              <div className="flex gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#1E3A8A] shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1 truncate">
                  <p className="font-bold text-slate-900 truncate">{delivery.pharmacy?.name}</p>
                  <p className="text-slate-500 text-[10px] sm:text-[11px] truncate">{delivery.pharmacy?.address}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1 truncate">
                  <p className="font-bold text-slate-900 truncate">Destination</p>
                  <p className="text-slate-500 text-[10px] sm:text-[11px] truncate">{delivery.destination?.area}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Button */}
        <button 
          onClick={handleNext}
          disabled={isUpdating || activeStatus === 'DELIVERED'}
          className="w-full py-3 bg-[#1E3A8A] hover:bg-[#172554] text-white rounded-xl font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 mt-1 cursor-pointer"
        >
          {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <>{ui.btn} <ChevronRight className="w-4 h-4" /></>}
        </button>
      </div>
    </div>
  );
}