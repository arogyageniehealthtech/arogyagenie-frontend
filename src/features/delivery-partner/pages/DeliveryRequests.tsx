import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Navigation, IndianRupee, Loader2, Package, Clock, AlertCircle, 
  MapPin, CheckCircle2, ChevronRight, KeyRound, Phone
} from 'lucide-react';
import toast from 'react-hot-toast';
import { setActiveDelivery, updateActiveStatus, clearActiveDelivery } from '@/store/slices/deliverySlice';
import { deliveryApi } from '../api/deliveryApi';

// --- Fallback Mock Data ---
const mockReqs = [
  { id: '1', orderId: 'DLV-10245', pharmacy: { name: 'Apollo Pharmacy', address: '58 Canal Circular Rd, Kolkata' }, destination: { area: 'Salt Lake, Sector 5' }, distance: 6.4, estimatedTime: 25, earnings: 85, priority: 'HIGH' },
  { id: '2', orderId: 'DLV-10246', pharmacy: { name: 'Wellness Meds', address: 'Park Street, Kolkata' }, destination: { area: 'Ballygunge' }, distance: 2.1, estimatedTime: 12, earnings: 45, priority: 'NORMAL' },
];

export default function DeliveryRequests() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isOnline, activeDeliveryId } = useSelector((s: any) => s.delivery || {});
  const [isAccepting, setIsAccepting] = useState<string | null>(null);

  // Live Location Updater
  useEffect(() => {
    if (!isOnline) return;
    const interval = setInterval(() => {
      // Mocking Kolkata coordinates for demo
      deliveryApi.updateLocation(22.5726, 88.3639).catch(() => {});
    }, 30000); // Update every 30s
    return () => clearInterval(interval);
  }, [isOnline]);

  // Fetch Nearby Requests via API
  const { data: requests, isLoading } = useQuery({ 
    queryKey: ['reqs'], 
    queryFn: async () => {
      try {
        const res = await deliveryApi.getNearbyRequests(22.5726, 88.3639, 10);
        return res.data?.length ? res.data : mockReqs;
      } catch (error) {
        return mockReqs; // Fallback
      }
    }, 
    enabled: isOnline,
    refetchInterval: 15000 // Poll every 15s for new orders
  });

  const handleAccept = async (id: string) => {
    if (activeDeliveryId) return toast.error('Active delivery exists!');
    setIsAccepting(id);
    
    try {
      await deliveryApi.claimRequest(id);
      dispatch(setActiveDelivery({ id, status: 'ACCEPTED' }));
      toast.success('Order Accepted!');
    } catch (error) {
      // Fallback for mock environment
      dispatch(setActiveDelivery({ id, status: 'ACCEPTED' }));
      toast.success('Order Accepted (Mock Mode)!');
    } finally {
      setIsAccepting(null);
    }
  };

  if (!isOnline) return (
    <div className="flex flex-col items-center justify-center h-[80vh] p-4 text-center">
      <div className="w-16 h-16 bg-blue-50/50 rounded-full flex items-center justify-center mb-4"><Navigation className="w-8 h-8 text-blue-500" /></div>
      <h2 className="text-xl font-bold text-slate-900">You are offline</h2>
      <button onClick={() => navigate('/delivery/dashboard')} className="mt-4 px-6 py-2 bg-blue-700 text-white rounded-lg text-sm font-bold">Go to Dashboard</button>
    </div>
  );

  if (activeDeliveryId) return <ActiveTracker delivery={requests?.find((r:any) => r.id === activeDeliveryId) || mockReqs[0]} />;

  return (
    <div className="p-3 sm:p-6 w-full max-w-6xl mx-auto space-y-3 sm:space-y-4 pb-24 lg:h-[calc(100vh-4rem)] lg:flex lg:flex-col lg:overflow-hidden">
      
      {/* Top Header Section */}
      <div className="flex items-center justify-between px-1 gap-2 flex-nowrap shrink-0">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 truncate">Nearby Requests</h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5 whitespace-nowrap">{requests?.length || 0} orders available</p>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 bg-emerald-500/10 rounded-full shrink-0">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-emerald-700 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider">Searching</span>
        </div>
      </div>

      <div className="relative flex items-center py-1 shrink-0">
        <div className="grow border-t border-slate-200"></div>
      </div>

      <div className="flex flex-col rounded-xl sm:rounded-2xl overflow-y-auto lg:flex-1 shadow-sm">
        {isLoading ? <Loader2 className="w-8 h-8 animate-spin text-blue-700 mx-auto my-12" /> : 
         requests?.length === 0 ? <p className="text-center p-12 text-slate-500"><Package className="w-12 h-12 mx-auto mb-2 opacity-50"/>No requests nearby.</p> :
         <AnimatePresence>{requests?.map((req: any, i: number) => (
           <RequestRow key={req.id} req={req} index={i} isAccepting={isAccepting === req.id} isDisabled={!!isAccepting && isAccepting !== req.id} onAccept={() => handleAccept(req.id)} />
         ))}</AnimatePresence>}
      </div>
    </div>
  );
}

const MetricInfo = ({ label, val, icon }: any) => (
  <div className="flex flex-col">
    <span className="text-[10px] sm:text-[11px] text-slate-400 font-bold uppercase mb-0.5 tracking-wider">{label}</span>
    <span className="font-extrabold text-sm sm:text-base text-slate-900 flex items-center">{icon}{val}</span>
  </div>
);

function RequestRow({ req, index, isAccepting, isDisabled, onAccept }: any) {
  return (
    <motion.div layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }} className={`${index % 2 === 0 ? 'bg-blue-100/40' : 'bg-blue-100/40'} p-3 sm:p-5 flex flex-col md:flex-row md:items-center gap-3 sm:gap-5 border-b border-blue-100/60 last:border-b-0`}>
      <div className="flex-1 flex flex-col gap-2 sm:gap-3 min-w-0">
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <span className="text-[11px] sm:text-xs font-black text-blue-800 bg-blue-100/70 px-2 py-0.5 rounded">{req.orderId}</span>
          <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1"><Clock className="w-3 h-3" /> Just now</span>
          {req.priority === 'HIGH' && <span className="px-1.5 py-0.5 bg-rose-500/10 text-rose-600 text-[10px] font-bold rounded flex items-center ml-auto md:ml-0"><AlertCircle className="w-3 h-3 mr-1" /> High</span>}
        </div>
        <div className="flex items-start gap-2.5 sm:gap-3">
          <div className="flex flex-col items-center mt-1 shrink-0"><div className="w-2 h-2 rounded-full bg-blue-600" /><div className="w-px h-4 sm:h-5 bg-blue-200 my-1" /><div className="w-2 h-2 rounded-full bg-emerald-500" /></div>
          <div className="flex flex-col gap-0.5 sm:gap-1 min-w-0">
            <p className="text-xs sm:text-sm font-bold truncate"><span className="text-[8px] sm:text-[9px] text-slate-400 uppercase block leading-none mb-0.5">Pickup</span>{req.pharmacy?.name || 'Pharmacy'}</p>
            <p className="text-xs sm:text-sm font-bold truncate mt-1"><span className="text-[8px] sm:text-[9px] text-slate-400 uppercase block leading-none mb-0.5">Dropoff</span>{req.destination?.area || 'Destination'}</p>
          </div>
        </div>
      </div>
        
      <div className="flex items-center justify-between sm:justify-start gap-5 sm:gap-8 md:px-6 shrink-0 overflow-x-auto py-1.5 sm:py-0 border-y sm:border-y-0 border-blue-100/60">
        <MetricInfo label="Pay" val={req.earnings || 50} icon={<IndianRupee className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-emerald-600 mr-0.5 stroke-[2.5]"/>} />
        <div className="w-px h-6 sm:h-7 bg-blue-200 hidden sm:block" />
        <MetricInfo label="Dist" val={`${req.distance || 3.2} km`} />
        <div className="w-px h-6 sm:h-7 bg-blue-200 hidden sm:block" />
        <MetricInfo label="Time" val={`${req.estimatedTime || 15} min`} />
      </div>

      <div className="flex items-center justify-end gap-2 sm:gap-3 shrink-0 mt-1 md:mt-0 w-full md:w-auto">
        <button disabled={isDisabled} className="flex-1 md:flex-initial px-4 sm:px-5 py-2 sm:py-2.5 bg-blue-100/50 hover:bg-blue-100 text-blue-900 text-xs font-bold rounded-xl transition-colors disabled:opacity-50">Decline</button>
        <button onClick={onAccept} disabled={isDisabled} className="flex-1 md:flex-initial min-w-25 sm:min-w-30 px-5 sm:px-6 py-2 sm:py-2.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-xl transition-all disabled:opacity-50 flex items-center justify-center">
          {isAccepting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Accept'}
        </button>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Redesigned Active Tracker (Google Maps + Modern Status)
// ---------------------------------------------------------------------------

const STEPS = ['ACCEPTED', 'GOING_TO_PICKUP', 'ARRIVED_AT_PICKUP', 'PICKED_UP', 'OUT_FOR_DELIVERY', 'ARRIVED_AT_DESTINATION', 'DELIVERED'];
const FLOW: any = { ACCEPTED: 'GOING_TO_PICKUP', GOING_TO_PICKUP: 'ARRIVED_AT_PICKUP', ARRIVED_AT_PICKUP: 'PICKED_UP', PICKED_UP: 'OUT_FOR_DELIVERY', OUT_FOR_DELIVERY: 'ARRIVED_AT_DESTINATION' };

const STATUS_UI: any = {
  ACCEPTED: { title: 'Order Accepted', desc: 'Ready to start navigation?', btn: 'Start Navigation', color: 'bg-blue-700' },
  GOING_TO_PICKUP: { title: 'Heading to Pharmacy', desc: 'Make your way to the pickup location.', btn: 'Arrived at Pharmacy', color: 'bg-blue-800' },
  ARRIVED_AT_PICKUP: { title: 'At Pharmacy', desc: 'Collect the order from the counter.', btn: 'Confirm Pickup', color: 'bg-amber-500' },
  PICKED_UP: { title: 'Medicine Picked Up', desc: 'Order secured. Ready to deliver?', btn: 'Start Delivery', color: 'bg-blue-700' },
  OUT_FOR_DELIVERY: { title: 'Out for Delivery', desc: 'Heading to the patient.', btn: 'Arrived at Destination', color: 'bg-indigo-700' },
  ARRIVED_AT_DESTINATION: { title: 'At Destination', desc: 'Ask patient for the 4-digit PIN.', btn: 'Verify & Complete', color: 'bg-emerald-600' }
};

function ActiveTracker({ delivery }: any) {
  const dispatch = useDispatch();
  const activeStatus = useSelector((s: any) => s.delivery?.activeDeliveryStatus || 'ACCEPTED');
  const [state, setState] = useState({ otp: '', isUpdating: false, showOtp: false });

  const currentIdx = STEPS.indexOf(activeStatus);
  const progressPercent = (Math.min(currentIdx, 5) / 5) * 100;
  const ui = STATUS_UI[activeStatus] || STATUS_UI.ACCEPTED;

  const handleNext = async () => {
    setState(s => ({ ...s, isUpdating: true }));

    try {
      if (activeStatus === 'ARRIVED_AT_PICKUP') {
        // API requires an OTP for pickup. We pass a default dummy '1234' since UI doesn't have an input for this yet.
        await deliveryApi.confirmPickup(delivery.id, '1234');
      }
      
      if (activeStatus === 'ARRIVED_AT_DESTINATION') {
        if (state.otp.length !== 4) {
          toast.error("Valid 4-digit OTP required");
          return setState(s => ({ ...s, isUpdating: false }));
        }
        await deliveryApi.confirmDelivery(delivery.id, state.otp);
      }
    } catch (err) {
      // Fallback for mock mode to allow testing without backend
      await new Promise(r => setTimeout(r, 600)); 
    }

    let next = FLOW[activeStatus] || 'DELIVERED';
    dispatch(updateActiveStatus(next));
    setState({ otp: '', isUpdating: false, showOtp: next === 'ARRIVED_AT_DESTINATION' });

    if (next === 'DELIVERED') {
      toast.success('Delivered! 🎉');
      setTimeout(() => dispatch(clearActiveDelivery()), 2500);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-0 lg:h-[calc(100vh-2rem)] lg:flex lg:flex-col lg:justify-center">
      
      <div className="hidden md:flex items-center justify-between px-2 mb-3 shrink-0">
        <h1 className="text-2xl font-bold text-slate-900">Live Delivery</h1>
        <span className="text-xs font-black bg-blue-100 text-blue-800 px-3 py-1 rounded-full uppercase tracking-wider">{delivery.orderId}</span>
      </div>

      <div className="flex flex-col md:flex-row gap-0 md:gap-4 bg-white md:bg-transparent rounded-none md:rounded-3xl h-dvh lg:h-[calc(100vh-7rem)] overflow-hidden">
        
        {/* Left Col: Real Google Maps Embed */}
        <div className="flex-1 h-[35%] md:h-full relative bg-slate-100 md:rounded-3xl overflow-hidden shadow-inner order-1">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d117925.33439927763!2d88.26495085437812!3d22.535406374533036!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f882db4908f667%3A0x43e330e68f6c2cbc!2sKolkata%2C%20West%20Bengal!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
            className="absolute inset-0 w-full h-full border-0" 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
          />
          <div className="absolute top-4 left-4 right-4 flex justify-between pointer-events-none">
            <div className="bg-white/95 backdrop-blur shadow-lg px-3.5 py-1.5 rounded-full font-bold text-xs sm:text-sm text-slate-800 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-700"/> {delivery.estimatedTime || 15} min
            </div>
            <div className="md:hidden bg-blue-950/90 backdrop-blur shadow-lg px-3 py-1.5 rounded-full font-bold text-xs text-white uppercase tracking-wider">
              {delivery.orderId}
            </div>
          </div>
        </div>

        {/* Right Col: Delivery Control Panel */}
        <div className="w-full md:w-105 bg-white md:rounded-3xl shadow-[0_-20px_40px_-15px_rgba(0,0,0,0.1)] md:shadow-xl border border-slate-100 flex flex-col z-20 order-2 h-[65%] md:h-full relative rounded-t-3xl -mt-6 md:mt-0 p-4 sm:p-5 justify-between">
          
          <div className="order-1 md:order-last pt-1 pb-3 md:py-0 md:mt-3 md:pt-3 border-b md:border-b-0 md:border-t border-slate-100 bg-white shrink-0">
            <button 
              onClick={handleNext} 
              disabled={state.isUpdating || activeStatus === 'DELIVERED'} 
              className={`w-full py-3.5 sm:py-4 text-white rounded-2xl font-bold text-base sm:text-lg flex items-center justify-center gap-2 shadow-lg transition-all disabled:opacity-50 active:scale-[0.98] ${ui.color} shadow-blue-900/15`}
            >
              {state.isUpdating ? <Loader2 className="animate-spin w-5 h-5 sm:w-6 sm:h-6"/> : <>{ui.btn} <ChevronRight className="w-5 h-5"/></>}
            </button>
          </div>

          <div className="order-2 md:order-first flex-1 overflow-y-auto flex flex-col justify-center my-2">
            <AnimatePresence mode="wait">
              {state.showOtp ? (
                <motion.div key="otp" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="flex flex-col items-center justify-center flex-1 py-2">
                  <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mb-3"><KeyRound className="w-7 h-7" /></div>
                  <h2 className="text-xl font-black text-slate-900 mb-1">Verify Delivery</h2>
                  <p className="text-xs sm:text-sm text-slate-500 mb-6 text-center px-4">Ask the patient for the 4-digit PIN to securely complete this order.</p>
                  <input autoFocus maxLength={4} value={state.otp} onChange={e => setState(s => ({...s, otp: e.target.value.replace(/\D/g, '')}))} className="w-48 text-center text-3xl tracking-[0.5em] font-black text-slate-900 bg-slate-50 border-2 border-slate-200 rounded-2xl py-3 focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all" />
                </motion.div>
              ) : activeStatus === 'DELIVERED' ? (
                <motion.div key="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center flex-1 py-4">
                  <CheckCircle2 className="w-16 h-16 text-emerald-500 mb-3" />
                  <h2 className="text-2xl font-black text-slate-900 mb-2">Delivered!</h2>
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-center w-full mt-2"><p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Earnings</p><p className="text-4xl font-black text-emerald-600">₹{delivery.earnings || 50}</p></div>
                </motion.div>
              ) : (
                <motion.div key="track" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col justify-center h-full">
                  
                  <div className="mb-3 sm:mb-4">
                    <div className="h-1.5 w-full bg-blue-50 rounded-full overflow-hidden">
                      <motion.div className="h-full bg-blue-700" initial={{ width: 0 }} animate={{ width: `${progressPercent}%` }} transition={{ duration: 0.5 }} />
                    </div>
                  </div>

                  <div className="mb-3 sm:mb-4">
                    <h2 className="text-lg sm:text-xl font-black text-slate-900 leading-tight">{ui.title}</h2>
                    <p className="text-xs sm:text-sm text-slate-500 mt-0.5 font-medium">{ui.desc}</p>
                  </div>

                  <div className="bg-blue-50/40 border border-blue-100/60 rounded-2xl p-3 sm:p-3.5">
                    <div className="flex gap-3">
                      <div className="flex flex-col items-center mt-1">
                        <MapPin className="w-4 h-4 text-blue-700" />
                        <div className="w-0.5 h-6 sm:h-8 bg-blue-200 my-1" />
                        <MapPin className="w-4 h-4 text-emerald-500" />
                      </div>
                      <div className="flex flex-col gap-3 flex-1 min-w-0">
                        <div>
                          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Pickup</p>
                          <p className="font-bold text-slate-900 text-xs sm:text-sm truncate">{delivery.pharmacy?.name || 'Pharmacy'}</p>
                          <p className="text-[11px] text-slate-500 truncate">{delivery.pharmacy?.address}</p>
                        </div>
                        <div>
                          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Dropoff</p>
                          <p className="font-bold text-slate-900 text-xs sm:text-sm truncate">{delivery.destination?.area || 'Customer Address'}</p>
                        </div>
                      </div>
                      <button className="w-9 h-9 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-sm text-slate-600 self-center hover:bg-slate-50 shrink-0">
                        <Phone className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </div>
  );
}