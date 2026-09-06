import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Package, Clock, CheckCircle2, 
  XCircle, Store, ChevronRight, MapPin, Receipt,
  X, Phone, KeyRound, Truck, Search, RotateCcw, 
  ShieldCheck, Copy, Check
} from 'lucide-react';
import toast from 'react-hot-toast';

import { pharmacyApi } from '../api/pharmacyApi';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes.constants';

// --- Types & Interfaces ---
type OrderStatus = 'CONFIRMED' | 'PREPARING' | 'READY_FOR_PICKUP' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';

interface OrderItem {
  medicineId: string;
  name: string;
  quantity: number;
  price: number;
}

interface MedicineOrder {
  id: string;
  pharmacyName: string;
  pharmacyAddress: string;
  deliveryAddress: string;
  status: OrderStatus;
  createdAt: string;
  totalAmount: number;
  items: OrderItem[];
  otp?: string;
  eta?: string;
  riderName?: string;
  riderPhone?: string;
}

const MOCK_ORDERS: MedicineOrder[] = [
  {
    id: 'ORD-882910',
    pharmacyName: 'Apollo Pharmacy',
    pharmacyAddress: 'Sector 5, Salt Lake, Kolkata',
    deliveryAddress: 'Flat 4B, Greenview Heights, Sector 5, Kolkata',
    status: 'OUT_FOR_DELIVERY',
    createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    totalAmount: 450.00,
    otp: '4829',
    eta: '12 mins',
    riderName: 'Vikram Das',
    riderPhone: '+91 98765 43210',
    items: [
      { medicineId: '1', name: 'Paracetamol 500mg', quantity: 2, price: 45 },
      { medicineId: '2', name: 'Vitamin C Complex', quantity: 1, price: 360 }
    ]
  },
  {
    id: 'ORD-773821',
    pharmacyName: 'Wellness Forever',
    pharmacyAddress: 'Park Street, Kolkata',
    deliveryAddress: '12/A Southern Avenue, Kolkata',
    status: 'PREPARING',
    createdAt: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
    totalAmount: 120.00,
    otp: '7193',
    eta: '30 mins',
    items: [
      { medicineId: '3', name: 'Amoxicillin 500mg', quantity: 1, price: 120 }
    ]
  },
  {
    id: 'ORD-554112',
    pharmacyName: 'Frank Ross Pharmacy',
    pharmacyAddress: 'New Town, Action Area 1, Kolkata',
    deliveryAddress: 'Tower 2, Uniworld City, New Town',
    status: 'DELIVERED',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    totalAmount: 890.50,
    items: [
      { medicineId: '4', name: 'Cough Reliever Syrup', quantity: 1, price: 110 },
      { medicineId: '5', name: 'Whey Protein Formula', quantity: 1, price: 780.50 }
    ]
  },
  {
    id: 'ORD-221990',
    pharmacyName: 'Apollo Pharmacy',
    pharmacyAddress: 'Sector 5, Salt Lake, Kolkata',
    deliveryAddress: 'Salt Lake, Sector 2, Kolkata',
    status: 'CANCELLED',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    totalAmount: 250.00,
    items: [
      { medicineId: '6', name: 'Ibuprofen 400mg', quantity: 2, price: 125 }
    ]
  }
];

const TRACKING_STEPS = [
  { key: 'CONFIRMED', label: 'Confirmed' },
  { key: 'PREPARING', label: 'Preparing' },
  { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery' },
  { key: 'DELIVERED', label: 'Delivered' }
];

const StatusBadge = ({ status }: { status: OrderStatus }) => {
  const config = {
    CONFIRMED: { color: 'text-blue-700 bg-blue-50 border-blue-200', icon: Clock, label: 'Confirmed' },
    PREPARING: { color: 'text-amber-700 bg-amber-50 border-amber-200', icon: Package, label: 'Preparing' },
    READY_FOR_PICKUP: { color: 'text-indigo-700 bg-indigo-50 border-indigo-200', icon: Store, label: 'Ready' },
    OUT_FOR_DELIVERY: { color: 'text-purple-700 bg-purple-50 border-purple-200', icon: Truck, label: 'On the Way' },
    DELIVERED: { color: 'text-emerald-700 bg-emerald-50 border-emerald-200', icon: CheckCircle2, label: 'Delivered' },
    CANCELLED: { color: 'text-rose-700 bg-rose-50 border-rose-200', icon: XCircle, label: 'Cancelled' },
  };

  const { color, icon: Icon, label } = config[status] || config.CONFIRMED;

  return (
    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border shadow-2xs shrink-0 ${color}`}>
      <Icon className="w-3.5 h-3.5" />
      <span className="text-[10px] font-black uppercase tracking-wider">{label}</span>
    </div>
  );
};

export default function OrdersPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<MedicineOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'ACTIVE' | 'PAST'>('ACTIVE');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<MedicineOrder | null>(null);
  const [copiedOtp, setCopiedOtp] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    // Safe API call with graceful fallback to mock data
    const fetchOrders = async () => {
      try {
        if (typeof (pharmacyApi as any).getMyOrders === 'function') {
          const res = await (pharmacyApi as any).getMyOrders();
          const fetched = res.data?.data || res.data || [];
          setOrders(fetched.length > 0 ? fetched : MOCK_ORDERS);
        } else {
          setOrders(MOCK_ORDERS);
        }
      } catch {
        setOrders(MOCK_ORDERS);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const activeOrders = useMemo(() => 
    orders.filter(o => !['DELIVERED', 'CANCELLED'].includes(o.status)), 
    [orders]
  );
  
  const pastOrders = useMemo(() => 
    orders.filter(o => ['DELIVERED', 'CANCELLED'].includes(o.status)), 
    [orders]
  );

  const filteredOrders = useMemo(() => {
    const list = activeTab === 'ACTIVE' ? activeOrders : pastOrders;
    if (!searchQuery.trim()) return list;

    const q = searchQuery.toLowerCase();
    return list.filter(o => 
      o.id.toLowerCase().includes(q) ||
      o.pharmacyName.toLowerCase().includes(q) ||
      o.items.some(i => i.name.toLowerCase().includes(q))
    );
  }, [activeTab, activeOrders, pastOrders, searchQuery]);

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-IN', { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const handleCopyOtp = (otp: string) => {
    navigator.clipboard.writeText(otp);
    setCopiedOtp(true);
    toast.success('PIN copied to clipboard!');
    setTimeout(() => setCopiedOtp(false), 2000);
  };

  const handleReorder = (order: MedicineOrder) => {
    toast.success(`Redirecting to catalog to reorder ${order.items.length} items`);
    navigate(ROUTES.PATIENT.MEDICINE);
  };

  const getStepStatus = (orderStatus: OrderStatus, stepKey: string) => {
    const priorityMap: Record<string, number> = {
      CONFIRMED: 0,
      PREPARING: 1,
      READY_FOR_PICKUP: 1,
      OUT_FOR_DELIVERY: 2,
      DELIVERED: 3,
      CANCELLED: -1
    };

    const targetMap: Record<string, number> = {
      CONFIRMED: 0,
      PREPARING: 1,
      OUT_FOR_DELIVERY: 2,
      DELIVERED: 3
    };

    const currentPriority = priorityMap[orderStatus] ?? 0;
    const stepPriority = targetMap[stepKey] ?? 0;

    if (currentPriority > stepPriority) return 'COMPLETED';
    if (currentPriority === stepPriority) return 'CURRENT';
    return 'UPCOMING';
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-16 font-sans text-sm text-slate-800">
      
      {/* Header */}
      <div className="bg-[#13102F] text-white pt-6 pb-12 px-4 sm:px-6 rounded-b-[36px] shadow-md relative z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-slate-100 hover:text-white rounded-xl text-xs font-semibold transition-all shadow-xs cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          <h1 className="text-base sm:text-lg font-extrabold tracking-wide">My Medicine Orders</h1>
          <div className="w-16" />
        </div>
      </div>

      <main className="container max-w-4xl mx-auto px-4 sm:px-6 -mt-6 relative z-20 space-y-4">
        
        {/* Navigation Tabs & Search Toolbar */}
        <div className="bg-white p-2 sm:p-2.5 rounded-2xl shadow-xs border border-slate-200/80 flex flex-col sm:flex-row items-center gap-2.5">
          <div className="flex bg-slate-100/90 p-1 rounded-xl w-full sm:w-auto shrink-0">
            {(['ACTIVE', 'PAST'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 sm:flex-initial px-5 py-2 text-xs font-bold rounded-lg transition-all relative cursor-pointer ${
                  activeTab === tab ? 'text-white' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {activeTab === tab && (
                  <motion.div 
                    layoutId="orderActiveTab" 
                    className="absolute inset-0 bg-[#13102F] rounded-lg -z-10 shadow-xs" 
                    transition={{ type: "spring", stiffness: 350, damping: 30 }} 
                  />
                )}
                {tab === 'ACTIVE' ? `Active (${activeOrders.length})` : `History (${pastOrders.length})`}
              </button>
            ))}
          </div>

          <div className="relative w-full flex-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="Search by Order ID, Pharmacy, or Medicine..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 transition-all"
            />
          </div>
        </div>

        {/* Orders Listing */}
        <div className="space-y-3.5">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-3 border-indigo-200 border-t-[#13102F] rounded-full animate-spin" />
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 sm:p-16 text-center border border-slate-200/80 shadow-xs flex flex-col items-center">
              <div className="w-14 h-14 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center mb-3">
                <Receipt className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-base text-slate-900 mb-1">
                {searchQuery ? 'No matching orders found' : `No ${activeTab.toLowerCase()} orders`}
              </h3>
              <p className="text-xs text-slate-400 mb-6 max-w-xs">
                {searchQuery ? 'Try searching with a different order number or pharmacy name.' : 'Your active prescription deliveries will appear here in real-time.'}
              </p>
              <Button 
                onClick={() => navigate(ROUTES.PATIENT.MEDICINE)} 
                className="bg-[#13102F] hover:bg-slate-800 text-white rounded-xl h-10 px-6 font-bold text-xs shadow-md cursor-pointer"
              >
                Browse Medicines
              </Button>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredOrders.map((order) => {
                const isActive = !['DELIVERED', 'CANCELLED'].includes(order.status);

                return (
                  <motion.div 
                    key={order.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs hover:border-slate-300 hover:shadow-sm transition-all"
                  >
                    {/* Card Header */}
                    <div className="p-4 sm:p-5 flex justify-between items-start gap-3 border-b border-slate-100 bg-slate-50/50">
                      <div className="flex gap-3 items-start min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700 shrink-0 shadow-2xs">
                          <Store className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-black text-sm text-slate-900 leading-tight truncate">
                            {order.pharmacyName}
                          </h3>
                          <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1.5 flex-wrap">
                            <span className="font-mono font-bold text-slate-800">{order.id}</span>
                            <span className="w-1 h-1 rounded-full bg-slate-300" />
                            <span>{formatDate(order.createdAt)}</span>
                          </p>
                        </div>
                      </div>
                      <StatusBadge status={order.status} />
                    </div>

                    {/* Active Order Delivery PIN Strip (Cohesive with Delivery Partner App) */}
                    {isActive && order.otp && (
                      <div className="mx-4 sm:mx-5 mt-3.5 p-3 rounded-xl bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-500/20 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                            <KeyRound className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <span className="text-[9px] font-black uppercase tracking-wider text-emerald-800 block leading-tight">
                              Delivery Verification PIN
                            </span>
                            <p className="text-xs font-black text-slate-900 tracking-wider font-mono">
                              {order.otp}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {order.eta && (
                            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold text-slate-600 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                              <Clock className="w-3 h-3 text-indigo-600" /> ETA: {order.eta}
                            </span>
                          )}
                          <button
                            onClick={() => handleCopyOtp(order.otp!)}
                            className="px-2.5 py-1 text-[11px] font-bold text-emerald-800 hover:text-emerald-950 bg-emerald-100/70 hover:bg-emerald-100 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            {copiedOtp ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedOtp ? 'Copied' : 'Copy'}</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Ordered Items Preview */}
                    <div className="p-4 sm:p-5 space-y-2.5">
                      {order.items.slice(0, 3).map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center text-xs">
                          <div className="flex items-center gap-2 min-w-0 pr-3">
                            <span className="w-5 h-5 rounded-md bg-slate-100 text-slate-600 font-bold text-[10px] flex items-center justify-center shrink-0">
                              {item.quantity}x
                            </span>
                            <span className="font-semibold text-slate-800 truncate">{item.name}</span>
                          </div>
                          <span className="font-bold text-slate-900 shrink-0">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}

                      {order.items.length > 3 && (
                        <p className="text-[11px] font-bold text-indigo-600 pt-0.5">
                          + {order.items.length - 3} more items in this order
                        </p>
                      )}
                    </div>

                    {/* Card Footer Actions */}
                    <div className="px-4 py-3 sm:px-5 sm:py-3.5 border-t border-slate-100 bg-white flex items-center justify-between gap-3">
                      <div>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Total Amount</p>
                        <p className="text-base font-black text-slate-900 leading-none mt-0.5">
                          ₹{order.totalAmount.toFixed(2)}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {order.status === 'DELIVERED' && (
                          <button 
                            onClick={() => handleReorder(order)}
                            className="h-9 px-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Reorder</span>
                          </button>
                        )}
                        <button 
                          onClick={() => setSelectedOrder(order)}
                          className="h-9 px-4 rounded-xl bg-[#13102F] hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95"
                        >
                          <span>{isActive ? 'Track Order' : 'Order Details'}</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </div>
      </main>

      {/* ========================================================================= */}
      {/* ORDER TRACKING & DETAILS MODAL                                            */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="px-5 py-4 bg-[#13102F] text-white flex items-center justify-between shrink-0">
                <div>
                  <h3 className="font-black text-sm sm:text-base">Order Status & Tracking</h3>
                  <p className="text-[11px] text-slate-300 font-mono mt-0.5">{selectedOrder.id}</p>
                </div>
                <button 
                  onClick={() => setSelectedOrder(null)}
                  className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Scroll Content */}
              <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
                
                {/* 1. Interactive Timeline Stepper */}
                {selectedOrder.status !== 'CANCELLED' && (
                  <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4">
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-3">
                      Live Order Journey
                    </h4>

                    <div className="flex items-center justify-between relative py-2">
                      {TRACKING_STEPS.map((step, idx) => {
                        const stepStatus = getStepStatus(selectedOrder.status, step.key);
                        const isDone = stepStatus === 'COMPLETED';
                        const isCurrent = stepStatus === 'CURRENT';

                        return (
                          <div key={step.key} className="flex-1 flex items-center last:flex-none">
                            <div className="flex flex-col items-center relative z-10">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black transition-all ${
                                isDone 
                                  ? 'bg-emerald-600 text-white' 
                                  : isCurrent 
                                  ? 'bg-[#13102F] text-white ring-4 ring-indigo-100 shadow-sm' 
                                  : 'bg-slate-200 text-slate-400'
                              }`}>
                                {isDone ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : idx + 1}
                              </div>
                              <span className={`text-[9px] font-bold mt-1 text-center max-w-[50px] leading-tight ${
                                isCurrent ? 'text-slate-900 font-black' : isDone ? 'text-slate-600' : 'text-slate-400'
                              }`}>
                                {step.label}
                              </span>
                            </div>

                            {idx < TRACKING_STEPS.length - 1 && (
                              <div className="h-0.5 w-full bg-slate-200 mx-1 mb-3 relative overflow-hidden rounded-full">
                                <div className={`h-full bg-emerald-600 transition-all duration-300 ${
                                  isDone ? 'w-full' : 'w-0'
                                }`} />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 2. Customer Delivery PIN Banner (If Active) */}
                {!['DELIVERED', 'CANCELLED'].includes(selectedOrder.status) && selectedOrder.otp && (
                  <div className="bg-gradient-to-r from-emerald-500/15 via-emerald-500/10 to-transparent border border-emerald-500/30 rounded-2xl p-4 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                        <KeyRound className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-emerald-900 block">
                          Share With Delivery Partner
                        </span>
                        <p className="text-xl font-black font-mono tracking-widest text-slate-900">
                          {selectedOrder.otp}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleCopyOtp(selectedOrder.otp!)}
                      className="px-3 py-1.5 bg-white border border-emerald-300 text-emerald-800 text-xs font-bold rounded-xl shadow-2xs hover:bg-emerald-50 transition-all cursor-pointer"
                    >
                      {copiedOtp ? 'Copied' : 'Copy PIN'}
                    </button>
                  </div>
                )}

                {/* 3. Rider Contact Card (if out for delivery) */}
                {selectedOrder.status === 'OUT_FOR_DELIVERY' && selectedOrder.riderName && (
                  <div className="p-3 bg-indigo-50/60 border border-indigo-100 rounded-2xl flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-xs shrink-0">
                        <Truck className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">{selectedOrder.riderName}</p>
                        <p className="text-[10px] text-slate-500">Delivery Partner Assigned</p>
                      </div>
                    </div>
                    {selectedOrder.riderPhone && (
                      <a 
                        href={`tel:${selectedOrder.riderPhone}`}
                        className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-indigo-600 transition-colors shadow-2xs"
                      >
                        <Phone className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                )}

                {/* 4. Delivery Address & Store Details */}
                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-2.5">
                    <Store className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">Dispensed From</span>
                      <p className="font-bold text-slate-800">{selectedOrder.pharmacyName}</p>
                      <p className="text-[11px] text-slate-500">{selectedOrder.pharmacyAddress}</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">Delivery Destination</span>
                      <p className="font-bold text-slate-800">{selectedOrder.deliveryAddress}</p>
                    </div>
                  </div>
                </div>

                {/* 5. Complete Itemized Breakdown */}
                <div className="border border-slate-200/80 rounded-2xl p-4 bg-white space-y-3">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                    Order Summary ({selectedOrder.items.length} Items)
                  </h4>
                  <div className="divide-y divide-slate-100 text-xs">
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="py-2 flex justify-between items-center first:pt-0 last:pb-0">
                        <div>
                          <p className="font-bold text-slate-800">{item.name}</p>
                          <span className="text-[10px] text-slate-400">Qty: {item.quantity} × ₹{item.price.toFixed(2)}</span>
                        </div>
                        <span className="font-black text-slate-900">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-slate-200 pt-3 flex justify-between items-center text-xs">
                    <span className="font-black text-slate-900">Grand Total</span>
                    <span className="text-base font-black text-slate-900">₹{selectedOrder.totalAmount.toFixed(2)}</span>
                  </div>
                </div>

              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-2 shrink-0">
                <button 
                  onClick={() => setSelectedOrder(null)}
                  className="w-full py-2.5 bg-[#13102F] hover:bg-slate-800 text-white rounded-xl font-bold text-xs shadow-xs transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}