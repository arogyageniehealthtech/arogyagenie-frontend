import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Package, Clock, CheckCircle2, 
  XCircle, Store, ChevronRight, MapPin, Receipt
} from 'lucide-react';

import { pharmacyApi } from '../api/pharmacyApi';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes.constants';

// --- Types & Mock Data ---
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
  status: OrderStatus;
  createdAt: string;
  totalAmount: number;
  items: OrderItem[];
}

const MOCK_ORDERS: MedicineOrder[] = [
  {
    id: 'ORD-882910',
    pharmacyName: 'Apollo Pharmacy',
    pharmacyAddress: 'Sector 5, Salt Lake',
    status: 'PREPARING',
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
    totalAmount: 450.00,
    items: [
      { medicineId: '1', name: 'Paracetamol 500mg', quantity: 2, price: 45 },
      { medicineId: '2', name: 'Vitamin C Complex', quantity: 1, price: 360 }
    ]
  },
  {
    id: 'ORD-773821',
    pharmacyName: 'Wellness Forever',
    pharmacyAddress: 'Park Street',
    status: 'CONFIRMED',
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 mins ago
    totalAmount: 120.00,
    items: [
      { medicineId: '3', name: 'Amoxicillin 500mg', quantity: 1, price: 120 }
    ]
  },
  {
    id: 'ORD-554112',
    pharmacyName: 'Frank Ross Pharmacy',
    pharmacyAddress: 'New Town',
    status: 'DELIVERED',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
    totalAmount: 890.50,
    items: [
      { medicineId: '4', name: 'Cough Reliever Syrup', quantity: 1, price: 110 },
      { medicineId: '5', name: 'Whey Protein', quantity: 1, price: 780.50 }
    ]
  },
  {
    id: 'ORD-221990',
    pharmacyName: 'Apollo Pharmacy',
    pharmacyAddress: 'Sector 5, Salt Lake',
    status: 'CANCELLED',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
    totalAmount: 250.00,
    items: [
      { medicineId: '6', name: 'Ibuprofen 400mg', quantity: 2, price: 125 }
    ]
  }
];

// --- Helper Components ---
const StatusBadge = ({ status }: { status: OrderStatus }) => {
  const config = {
    CONFIRMED: { color: 'text-blue-700 bg-blue-50 border-blue-200', icon: Clock, label: 'Confirmed' },
    PREPARING: { color: 'text-amber-700 bg-amber-50 border-amber-200', icon: Package, label: 'Preparing' },
    READY_FOR_PICKUP: { color: 'text-indigo-700 bg-indigo-50 border-indigo-200', icon: Store, label: 'Ready for Pickup' },
    OUT_FOR_DELIVERY: { color: 'text-violet-700 bg-violet-50 border-violet-200', icon: MapPin, label: 'On the Way' },
    DELIVERED: { color: 'text-emerald-700 bg-emerald-50 border-emerald-200', icon: CheckCircle2, label: 'Delivered' },
    CANCELLED: { color: 'text-rose-700 bg-rose-50 border-rose-200', icon: XCircle, label: 'Cancelled' },
  };

  const { color, icon: Icon, label } = config[status] || config.CONFIRMED;

  return (
    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border shadow-xs ${color}`}>
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

  useEffect(() => {
    setIsLoading(true);
    pharmacyApi.getMyOrders()
      .then(res => {
        const fetchedOrders = res.data?.data || res.data || [];
        setOrders(fetchedOrders.length > 0 ? fetchedOrders : MOCK_ORDERS);
        setIsLoading(false);
      })
      .catch(() => {
        // Fallback to mock data if API fails
        setOrders(MOCK_ORDERS);
        setIsLoading(false);
      });
  }, []);

  const activeOrders = orders.filter(o => !['DELIVERED', 'CANCELLED'].includes(o.status));
  const pastOrders = orders.filter(o => ['DELIVERED', 'CANCELLED'].includes(o.status));
  
  const displayOrders = activeTab === 'ACTIVE' ? activeOrders : pastOrders;

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-12 font-sans text-sm text-slate-800">
      
      {/* Header */}
      <div className="bg-[#13102F] text-white pt-6 pb-12 px-4 sm:px-6 rounded-b-[40px] shadow-md relative z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-slate-100 hover:text-white rounded-xl text-xs font-semibold transition-all shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          <h1 className="text-lg font-extrabold tracking-wide">My Orders</h1>
          <div className="w-20" /> {/* Spacer for centering */}
        </div>
      </div>

      <main className="container max-w-4xl mx-auto px-4 sm:px-6 -mt-6 relative z-20 space-y-6">
        
        {/* Custom Tabs */}
        <div className="bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200/80 flex w-full max-w-sm mx-auto">
          {['ACTIVE', 'PAST'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all relative ${activeTab === tab ? 'text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
            >
              {activeTab === tab && (
                <motion.div layoutId="orderTab" className="absolute inset-0 bg-[#13102F] rounded-xl -z-10" transition={{ type: "spring", stiffness: 300, damping: 30 }} />
              )}
              {tab === 'ACTIVE' ? `Active (${activeOrders.length})` : `History (${pastOrders.length})`}
            </button>
          ))}
        </div>

        {/* Order List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            </div>
          ) : displayOrders.length === 0 ? (
            <div className="bg-white rounded-3xl p-16 text-center border border-slate-200/80 shadow-xs flex flex-col items-center">
              <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mb-4">
                <Receipt className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-base text-[#13102F] mb-1">No {activeTab.toLowerCase()} orders</h3>
              <p className="text-xs text-slate-400 mb-6">Looks like you haven't placed any orders yet.</p>
              <Button onClick={() => navigate(ROUTES.PATIENT.MEDICINE)} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-10 px-6 font-bold shadow-md">
                Order Medicines Now
              </Button>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {displayOrders.map((order) => (
                <motion.div 
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-md transition-all group"
                >
                  {/* Order Header */}
                  <div className="p-4 md:p-5 flex justify-between items-start gap-4 border-b border-slate-100 bg-slate-50/50">
                    <div className="flex gap-3 items-start">
                      <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                        <Store className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-slate-900 leading-tight">{order.pharmacyName}</h3>
                        <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1.5">
                          <span className="font-medium text-slate-700">Order #{order.id.split('-')[1]}</span>
                          <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                    </div>
                    <StatusBadge status={order.status} />
                  </div>

                  {/* Order Items Preview */}
                  <div className="p-4 md:p-5 space-y-3">
                    {order.items.slice(0, 2).map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">
                            {item.quantity}x
                          </span>
                          <span className="font-medium text-slate-700">{item.name}</span>
                        </div>
                        <span className="font-bold text-slate-900">₹{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                    {order.items.length > 2 && (
                      <p className="text-[11px] font-semibold text-indigo-600 pt-1">
                        + {order.items.length - 2} more item{order.items.length - 2 > 1 ? 's' : ''}
                      </p>
                    )}
                  </div>

                  {/* Order Footer Actions */}
                  <div className="p-3 md:p-4 border-t border-slate-100 bg-white flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Paid</p>
                      <p className="text-base font-black text-slate-900 leading-none mt-0.5">₹{order.totalAmount.toFixed(2)}</p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {order.status === 'DELIVERED' && (
                        <button className="h-9 px-4 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-xs font-bold text-slate-700 transition-all">
                          Reorder
                        </button>
                      )}
                      <button className="h-9 px-4 rounded-xl bg-[#13102F] hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 group-hover:pr-3">
                        <span>{activeTab === 'ACTIVE' ? 'Track Order' : 'View Details'}</span>
                        <ChevronRight className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </main>
    </div>
  );
}