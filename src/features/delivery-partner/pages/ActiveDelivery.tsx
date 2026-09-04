import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Navigation, IndianRupee, Loader2, 
  Package, Clock, AlertCircle, ArrowRight,
  MapPin, CheckCircle2, ChevronRight, KeyRound
} from 'lucide-react';
import toast from 'react-hot-toast';

import { deliveryApi } from '../api/deliveryApi';
import { setActiveDelivery, updateActiveStatus, clearActiveDelivery } from '@/store/slices/deliverySlice';
import type{ DeliveryRequest, DeliveryStatus } from '../types/delivery';

// Expanded Mock Data
const mockRequests: DeliveryRequest[] = [
  { id: 'req-1', orderId: 'DLV-10245', status: 'PENDING', pharmacy: { name: 'Apollo Pharmacy', location: { address: '58 Canal Circular Rd', lat: 22.5, lng: 88.3 }, phone: '9876543210' }, destination: { area: 'Salt Lake, Sector 5', location: { address: '', lat: 22.58, lng: 88.43 } }, distance: 6.4, estimatedTime: 25, earnings: 85, orderValue: 1240, itemCount: 3, priority: 'HIGH', createdAt: new Date().toISOString() },
  { id: 'req-2', orderId: 'DLV-10246', status: 'PENDING', pharmacy: { name: 'Wellness Meds', location: { address: 'Park Street', lat: 22.5, lng: 88.3 }, phone: '9876543210' }, destination: { area: 'Ballygunge', location: { address: '', lat: 22.58, lng: 88.43 } }, distance: 2.1, estimatedTime: 12, earnings: 45, orderValue: 450, itemCount: 1, priority: 'NORMAL', createdAt: new Date().toISOString() },
  { id: 'req-3', orderId: 'DLV-10247', status: 'PENDING', pharmacy: { name: 'Frank Ross', location: { address: 'New Town Action Area I', lat: 22.5, lng: 88.3 }, phone: '9876543210' }, destination: { area: 'Rajarhat', location: { address: '', lat: 22.58, lng: 88.43 } }, distance: 8.5, estimatedTime: 35, earnings: 110, orderValue: 2100, itemCount: 5, priority: 'NORMAL', createdAt: new Date().toISOString() },
  { id: 'req-4', orderId: 'DLV-10248', status: 'PENDING', pharmacy: { name: 'Sanjivani Pharmacy', location: { address: 'Dum Dum Station', lat: 22.5, lng: 88.3 }, phone: '9876543210' }, destination: { area: 'Lake Town', location: { address: '', lat: 22.58, lng: 88.43 } }, distance: 4.3, estimatedTime: 18, earnings: 60, orderValue: 850, itemCount: 2, priority: 'HIGH', createdAt: new Date().toISOString() },
];

export default function DeliveryRequests() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const isOnline = useSelector((state: any) => state.delivery?.isOnline || false);
  const activeDeliveryId = useSelector((state: any) => state.delivery?.activeDeliveryId || null);

  const [isAccepting, setIsAccepting] = useState<string | null>(null);

  const { data: requests, isLoading } = useQuery({ 
    queryKey: ['deliveryRequests'], 
    queryFn: async () => mockRequests,
    enabled: isOnline 
  });

  const handleAccept = async (id: string) => {
    if (activeDeliveryId) return toast.error('You already have an active delivery!');
    
    setIsAccepting(id);
    try {
      await new Promise(r => setTimeout(r, 800)); 
      dispatch(setActiveDelivery({ id, status: 'ACCEPTED' }));
      toast.success('Delivery Accepted!');
    } catch (error) {
      toast.error('Failed to accept delivery.');
    } finally {
      setIsAccepting(null);
    }
  };

  if (!isOnline) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-80px)] p-4 text-center">
        <div className="w-16 h-16 bg-slate-200/50 rounded-full flex items-center justify-center mb-4">
          <Navigation className="w-8 h-8 text-slate-400" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">You are offline</h2>
        <p className="text-slate-500 text-sm mt-1 max-w-xs">Go online from your dashboard to start receiving new delivery requests.</p>
        <button onClick={() => navigate('/delivery/dashboard')} className="mt-6 px-6 py-2 bg-indigo-600 text-slate-50 hover:bg-indigo-700 transition-colors rounded-lg text-sm font-bold">Go to Dashboard</button>
      </div>
    );
  }

  if (activeDeliveryId) {
    const activeData = requests?.find(r => r.id === activeDeliveryId) || mockRequests[0];
    return <InPlaceActiveDelivery delivery={activeData} />;
  }

  return (
    <div className="p-4 sm:p-6 w-full max-w-6xl mx-auto space-y-6 pb-24">
      
      <div className="flex items-end justify-between px-1">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 leading-tight">Nearby Requests</h1>
          <p className="text-slate-500 text-sm mt-1 font-medium">{requests?.length || 0} orders available in your area</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-emerald-700 text-[10px] font-bold uppercase tracking-wider">Searching</span>
        </div>
      </div>

      <div className="flex flex-col">
        {isLoading ? (
          <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>
        ) : requests?.length === 0 ? (
          <div className="text-center p-12">
            <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 text-base font-medium">No delivery requests nearby right now.</p>
          </div>
        ) : (
          <AnimatePresence>
            {requests?.map((req) => (
              <DeliveryRequestRow 
                key={req.id} 
                request={req} 
                isAccepting={isAccepting === req.id}
                isDisabled={isAccepting !== null && isAccepting !== req.id}
                onAccept={() => handleAccept(req.id)} 
              />
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Clean Row Component
// ---------------------------------------------------------------------------
function DeliveryRequestRow({ request: req, isAccepting, isDisabled, onAccept }: any) {
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0 }}
      className="border-b border-slate-200/60 last:border-b-0 hover:bg-indigo-50/30 transition-colors p-4 sm:p-5 flex flex-col md:flex-row md:items-center gap-5 rounded-xl"
    >
      <div className="flex-1 flex flex-col gap-3 min-w-0">
        <div className="flex items-center gap-3">
          <span className="text-xs font-black text-slate-600 bg-slate-200/60 px-2 py-0.5 rounded uppercase tracking-wider">{req.orderId}</span>
          <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
            <Clock className="w-3 h-3" /> Just now
          </span>
          {req.priority === 'HIGH' && (
            <span className="px-1.5 py-0.5 bg-rose-500/10 text-rose-600 text-[10px] font-bold rounded flex items-center gap-1 uppercase tracking-wider ml-auto md:ml-0">
              <AlertCircle className="w-3 h-3" /> High
            </span>
          )}
        </div>

        <div className="flex items-start gap-3">
          <div className="flex flex-col items-center mt-1 shrink-0">
            <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
            <div className="w-0.5 h-5 bg-slate-300/80 my-0.5" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          </div>
          
          <div className="flex flex-col gap-2 min-w-0">
            <div className="flex flex-col">
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest leading-none mb-0.5">Pickup</span>
              <span className="font-bold text-slate-900 text-sm truncate">{req.pharmacy.name}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest leading-none mb-0.5">Dropoff</span>
              <span className="font-bold text-slate-900 text-sm truncate">{req.destination.area}</span>
            </div>
          </div>
        </div>
      </div>
        
      <div className="flex items-center gap-6 md:gap-8 md:px-8 py-2 md:py-0 w-full md:w-auto overflow-x-auto custom-scrollbar shrink-0">
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Pay</span>
          <span className="font-black text-xl text-emerald-600 leading-none flex items-center">
            <IndianRupee className="w-4 h-4 mr-0.5" />{req.earnings}
          </span>
        </div>
        <div className="w-px h-8 bg-slate-200/80 hidden sm:block" />
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Distance</span>
          <span className="font-bold text-sm text-slate-800 leading-none">{req.distance} km</span>
        </div>
        <div className="w-px h-8 bg-slate-200/80 hidden sm:block" />
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Est. Time</span>
          <span className="font-bold text-sm text-slate-800 leading-none">{req.estimatedTime} min</span>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 w-full md:w-auto shrink-0 mt-2 md:mt-0">
        <button 
          disabled={isDisabled}
          className="px-5 py-2.5 text-slate-500 hover:text-slate-700 bg-slate-200/40 hover:bg-slate-200/80 text-xs font-bold rounded-xl transition-colors disabled:opacity-50"
        >
          Decline
        </button>
        <button 
          onClick={onAccept}
          disabled={isDisabled}
          className="min-w-35 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-slate-50 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isAccepting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Accept Order'}
        </button>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// In-Place Active Delivery Tracker
// ---------------------------------------------------------------------------

const TIMELINE_STEPS = [
  { status: 'ACCEPTED', label: 'Order Accepted' },
  { status: 'GOING_TO_PICKUP', label: 'Heading to Pharmacy' },
  { status: 'ARRIVED_AT_PICKUP', label: 'Arrived at Pharmacy' },
  { status: 'PICKED_UP', label: 'Medicine Picked Up' },
  { status: 'OUT_FOR_DELIVERY', label: 'Out for Delivery' },
  { status: 'ARRIVED_AT_DESTINATION', label: 'Arrived at Destination' },
  { status: 'DELIVERED', label: 'Delivered Successfully' }
];

function InPlaceActiveDelivery({ delivery }: { delivery: DeliveryRequest }) {
  const dispatch = useDispatch();
  const activeStatus = useSelector((state: any) => state.delivery?.activeDeliveryStatus || 'ACCEPTED');

  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const currentStepIndex = TIMELINE_STEPS.findIndex(s => s.status === activeStatus);

  const handleNextAction = async () => {
    setIsUpdating(true);
    await new Promise(r => setTimeout(r, 600)); 

    let nextStatus: DeliveryStatus = 'ACCEPTED';
    
    switch(activeStatus) {
      case 'ACCEPTED': nextStatus = 'GOING_TO_PICKUP'; break;
      case 'GOING_TO_PICKUP': nextStatus = 'ARRIVED_AT_PICKUP'; break;
      case 'ARRIVED_AT_PICKUP': nextStatus = 'PICKED_UP'; break;
      case 'PICKED_UP': nextStatus = 'OUT_FOR_DELIVERY'; break;
      case 'OUT_FOR_DELIVERY': nextStatus = 'ARRIVED_AT_DESTINATION'; break;
      case 'ARRIVED_AT_DESTINATION': 
        if (otp.length === 4) {
          nextStatus = 'DELIVERED'; 
        } else {
          toast.error("Please enter a valid 4-digit OTP.");
          setIsUpdating(false);
          return;
        }
        break;
    }

    dispatch(updateActiveStatus(nextStatus));
    setIsUpdating(false);

    if (nextStatus === 'ARRIVED_AT_DESTINATION') {
      setShowOtp(true);
    }
    
    if (nextStatus === 'DELIVERED') {
      toast.success('Delivery Completed Successfully! 🎉');
      setTimeout(() => {
        dispatch(clearActiveDelivery());
      }, 3000);
    }
  };

  const getButtonText = () => {
    switch(activeStatus) {
      case 'ACCEPTED': return 'Start Navigation';
      case 'GOING_TO_PICKUP': return "I've Arrived at Pharmacy";
      case 'ARRIVED_AT_PICKUP': return 'Confirm Medicine Pickup';
      case 'PICKED_UP': return 'Start Delivery to Patient';
      case 'OUT_FOR_DELIVERY': return "I've Arrived at Destination";
      case 'ARRIVED_AT_DESTINATION': return 'Verify OTP & Complete';
      case 'DELIVERED': return 'Delivery Completed';
      default: return 'Processing...';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="p-4 sm:p-6 w-full max-w-5xl mx-auto space-y-6 pb-24"
    >
      <div className="flex items-center justify-between mb-2 px-1">
        <h1 className="text-2xl font-bold text-slate-900">Active Delivery</h1>
        <span className="text-xs font-black text-slate-600 bg-slate-200/60 px-3 py-1 rounded-full uppercase tracking-wider">
          {delivery.orderId}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="h-64 md:h-125 rounded-3xl bg-slate-200/50 border border-slate-200/50 relative overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />
          <div className="bg-slate-50/90 backdrop-blur-md px-5 py-3 rounded-xl font-bold text-sm text-slate-600 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-indigo-500" /> Live GPS Map View
          </div>
        </div>

        <div className="flex flex-col rounded-3xl p-4 sm:p-6 relative">
          <AnimatePresence mode="wait">
            {showOtp && activeStatus === 'ARRIVED_AT_DESTINATION' ? (
              <motion.div 
                key="otp-view" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="flex flex-col items-center justify-center h-full flex-1 py-8"
              >
                <div className="w-16 h-16 bg-indigo-500/10 rounded-full flex items-center justify-center text-indigo-600 mb-6">
                  <KeyRound className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">Enter Delivery PIN</h2>
                <p className="text-sm text-slate-500 mb-8 text-center max-w-xs">Ask the patient for the 4-digit PIN to confirm delivery.</p>
                <input 
                  autoFocus type="text" maxLength={4} value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                  className="w-full max-w-50 text-center text-4xl tracking-[0.5em] font-black text-slate-900 bg-slate-200/50 border border-slate-200/60 rounded-2xl py-4 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                />
              </motion.div>
            ) : activeStatus === 'DELIVERED' ? (
              <motion.div 
                key="success-view" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center h-full flex-1 py-12 text-center"
              >
                <div className="w-20 h-20 bg-emerald-500/10 text-emerald-600 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 mb-2">Delivered!</h2>
                <p className="text-slate-500 font-medium mb-8">You successfully completed the order.</p>
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-5 mb-2 w-full max-w-62.5">
                  <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider mb-1">You Earned</p>
                  <p className="text-4xl font-black text-emerald-600">₹{delivery.earnings}</p>
                </div>
              </motion.div>
            ) : (
              <motion.div key="tracking-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 overflow-y-auto custom-scrollbar pr-2 pb-4">
                <div className="space-y-0 mt-4">
                  {TIMELINE_STEPS.map((step, idx) => {
                    const isPast = idx < currentStepIndex;
                    const isCurrent = idx === currentStepIndex;
                    return (
                      <div key={step.status} className="flex items-start gap-4">
                        <div className="flex flex-col items-center">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center z-10 transition-colors duration-300 ${isPast ? 'bg-emerald-500 text-slate-50' : isCurrent ? 'bg-indigo-600 text-slate-50' : 'bg-slate-200/50 border-2 border-slate-300/60 text-transparent'}`}>
                            {isPast ? <CheckCircle2 className="w-4 h-4" /> : <div className={`w-2.5 h-2.5 rounded-full ${isCurrent ? 'bg-slate-50' : 'bg-transparent'}`} />}
                          </div>
                          {idx < TIMELINE_STEPS.length - 1 && (
                            <div className={`w-0.5 h-12 my-1 ${isPast ? 'bg-emerald-400' : 'bg-slate-200'}`} />
                          )}
                        </div>
                        <div className={`pt-0.5 pb-6 ${isCurrent ? 'opacity-100' : isPast ? 'opacity-60' : 'opacity-40'}`}>
                          <p className={`text-sm font-bold ${isCurrent ? 'text-indigo-700' : 'text-slate-700'}`}>{step.label}</p>
                          {isCurrent && step.status === 'GOING_TO_PICKUP' && (
                            <p className="text-xs text-slate-500 mt-1 font-medium">{delivery.pharmacy.name}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-auto pt-6">
            <button 
              onClick={handleNextAction}
              disabled={isUpdating || activeStatus === 'DELIVERED'}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-slate-50 rounded-xl font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isUpdating ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <>
                  {getButtonText()} 
                  {activeStatus !== 'DELIVERED' && <ChevronRight className="w-5 h-5" />}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}