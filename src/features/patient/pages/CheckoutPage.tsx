import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  MapPin, 
  CreditCard, 
  CheckCircle2, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ShieldCheck, 
  Truck, 
  Clock, 
  Sparkles, 
  Building2, 
  Tag, 
  Phone, 
  User, 
  FileText,
  BadgePercent,
  Banknote,
  Smartphone
} from 'lucide-react';
import toast from 'react-hot-toast';

import { selectCartItems, updateQuantity, removeItem, clearCart } from '@/store/slices/cartSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { pharmacyApi } from '../api/pharmacyApi';
import { ROUTES } from '@/constants/routes.constants';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  // Quotation passed from Pharmacy Selection modal
  const quotation = location.state?.quotation;
  const cartItems = useSelector(selectCartItems) || [];

  const [isProcessing, setIsProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'upi' | 'card'>('cod');
  const [orderId, setOrderId] = useState<string>('');

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    pincode: '',
    deliveryNote: ''
  });

  // Dynamic Calculations
  let rawSubtotal = 0;
  let discountedSubtotal = 0;

  cartItems.forEach((item: any) => {
    const medId = item.medicineId || item.id;
    const quotedItem = quotation?.items?.find((q: any) => q.medicineId === medId);

    const itemDiscountPercent = quotedItem?.disc ?? quotation?.totalDisc ?? 0;
    const originalPrice = item.unitPrice ?? item.medicine?.price ?? item.price ?? 0;
    const discountedPrice = originalPrice * (1 - itemDiscountPercent / 100);

    rawSubtotal += originalPrice * item.quantity;
    discountedSubtotal += discountedPrice * item.quantity;
  });

  const totalDiscountSaved = rawSubtotal - discountedSubtotal;
  const freeShippingThreshold = 500;
  const shippingFee = discountedSubtotal >= freeShippingThreshold ? 0 : 40;
  const finalTotal = discountedSubtotal + shippingFee;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    setIsProcessing(true);

    try {
      if (quotation?.id && !quotation.id.startsWith('MOCK')) {
        await pharmacyApi.acceptOffer(quotation.id);
      } else {
        await new Promise((resolve) => setTimeout(resolve, 1400));
      }

      const generatedId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
      setOrderId(generatedId);
      setOrderPlaced(true);
      dispatch(clearCart());
      toast.success('Order placed successfully!');
    } catch (error) {
      toast.error('Failed to place order. Please check details and try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // --------------------------------------------------------------------------
  // ORDER SUCCESS SCREEN
  // --------------------------------------------------------------------------
  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-slate-50/70 flex items-center justify-center p-4 sm:p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="bg-white rounded-3xl p-6 sm:p-10 max-w-lg w-full text-center shadow-xl shadow-slate-200/50 border border-slate-100"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.15, type: 'spring', stiffness: 220, damping: 15 }}
            className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-emerald-100/80 shadow-inner"
          >
            <CheckCircle2 className="w-10 h-10" />
          </motion.div>

          <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full mb-3">
            <Sparkles className="w-3.5 h-3.5" /> Order Placed Successfully
          </span>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-2">
            Thank You for Your Order!
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mb-6 leading-relaxed">
            Your prescription & medicines have been routed to the dispensing pharmacy. We'll keep you notified via SMS.
          </p>

          <div className="bg-slate-50 border border-slate-200/70 rounded-2xl p-4 text-left mb-6 space-y-2.5 text-xs text-slate-600">
            <div className="flex justify-between pb-2 border-b border-slate-200/60 font-medium">
              <span className="text-slate-400">Order ID</span>
              <span className="font-bold text-slate-900 font-mono">{orderId}</span>
            </div>
            <div className="flex justify-between pb-2 border-b border-slate-200/60 font-medium">
              <span className="text-slate-400">Recipient</span>
              <span className="font-bold text-slate-900">{formData.fullName}</span>
            </div>
            <div className="flex justify-between pb-2 border-b border-slate-200/60 font-medium">
              <span className="text-slate-400">Delivery Address</span>
              <span className="font-bold text-slate-900 text-right max-w-[60%] truncate">{formData.address}</span>
            </div>
            <div className="flex justify-between font-medium">
              <span className="text-slate-400">Payment Mode</span>
              <span className="font-bold text-indigo-600 uppercase">{paymentMethod}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={() => navigate(ROUTES.PATIENT.MEDICINE)}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 h-12 rounded-xl font-bold shadow-md shadow-indigo-600/20 text-white"
            >
              Order More Medicines
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // EMPTY CART SCREEN
  // --------------------------------------------------------------------------
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50/50 pt-10 px-4">
        <div className="max-w-4xl mx-auto">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)} 
            className="mb-6 -ml-3 text-slate-500 hover:text-slate-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>

          <div className="bg-white rounded-3xl p-10 sm:p-16 text-center shadow-sm border border-slate-200/70 max-w-xl mx-auto flex flex-col items-center">
            <div className="w-20 h-20 bg-indigo-50 text-indigo-500 rounded-3xl flex items-center justify-center mb-5 shadow-inner">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Your Cart is Empty</h2>
            <p className="text-slate-500 text-sm mb-6 max-w-sm">
              Looks like you haven't added any medicines or lab tests to your cart yet.
            </p>
            <Button
              onClick={() => navigate(ROUTES.PATIENT.MEDICINE)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-12 px-8 rounded-xl shadow-lg shadow-indigo-600/20"
            >
              Explore Pharmacy
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // MAIN CHECKOUT PAGE
  // --------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 pt-6 sm:pt-8 px-4 sm:px-6 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Delivery & Payment Details */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Pharmacy Fulfillment Banner (if quotation is present) */}
            {quotation && (
              <div className="bg-linear-to-r from-indigo-50 via-white to-purple-50/40 p-4 sm:p-5 rounded-2xl border border-indigo-100/90 shadow-xs flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-indigo-600/30">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] uppercase tracking-wider font-extrabold text-indigo-600 block">
                      Assigned Dispensary
                    </span>
                    <h3 className="text-sm font-black text-slate-900 truncate">
                      {quotation.p?.name || quotation.pharmacy?.name || 'Authorized Partner Pharmacy'}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 bg-white/90 border border-indigo-100 text-indigo-700 px-3 py-1.5 rounded-xl text-xs font-bold shrink-0">
                  <Clock className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{quotation.eta || 'Express 45-min'}</span>
                </div>
              </div>
            )}

            <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-6">
              
              {/* Delivery Details Card */}
              <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/80 shadow-xs">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                      <MapPin className="w-4 h-4" />
                    </div>
                    Delivery Address
                  </h3>
                  <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
                    Home Delivery
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-400" /> Full Name
                    </Label>
                    <Input
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="e.g. Rahul Sharma"
                      className="bg-slate-50 border-slate-200 focus:bg-white text-xs sm:text-sm h-11 rounded-xl"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400" /> Phone Number
                    </Label>
                    <Input
                      required
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="bg-slate-50 border-slate-200 focus:bg-white text-xs sm:text-sm h-11 rounded-xl"
                    />
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <Label className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" /> Complete Street Address
                    </Label>
                    <Input
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Flat / House No., Apartment name, Street, Landmark"
                      className="bg-slate-50 border-slate-200 focus:bg-white text-xs sm:text-sm h-11 rounded-xl"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-600">Postal / PIN Code</Label>
                    <Input
                      value={formData.pincode}
                      onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                      placeholder="e.g. 700001"
                      className="bg-slate-50 border-slate-200 focus:bg-white text-xs sm:text-sm h-11 rounded-xl"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-slate-400" /> Delivery Instructions (Optional)
                    </Label>
                    <Input
                      value={formData.deliveryNote}
                      onChange={(e) => setFormData({ ...formData, deliveryNote: e.target.value })}
                      placeholder="Leave at door, ring bell, etc."
                      className="bg-slate-50 border-slate-200 focus:bg-white text-xs sm:text-sm h-11 rounded-xl"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/80 shadow-xs">
                <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2.5 mb-5">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  Payment Method
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Cash on Delivery */}
                  <div
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between gap-3 ${
                      paymentMethod === 'cod'
                        ? 'border-indigo-600 bg-indigo-50/40 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                        <Banknote className="w-5 h-5" />
                      </div>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === 'cod' ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300'}`}>
                        {paymentMethod === 'cod' && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                      </div>
                    </div>
                    <div>
                      <p className="font-bold text-xs sm:text-sm text-slate-900">Cash on Delivery</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">Pay via cash or UPI at delivery</p>
                    </div>
                  </div>

                  {/* UPI / QR */}
                  <div
                    onClick={() => setPaymentMethod('upi')}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between gap-3 ${
                      paymentMethod === 'upi'
                        ? 'border-indigo-600 bg-indigo-50/40 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                        <Smartphone className="w-5 h-5" />
                      </div>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === 'upi' ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300'}`}>
                        {paymentMethod === 'upi' && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                      </div>
                    </div>
                    <div>
                      <p className="font-bold text-xs sm:text-sm text-slate-900">Instant UPI</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">Google Pay, PhonePe, Paytm</p>
                    </div>
                  </div>

                  {/* Cards / Net Banking */}
                  <div
                    onClick={() => setPaymentMethod('card')}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between gap-3 ${
                      paymentMethod === 'card'
                        ? 'border-indigo-600 bg-indigo-50/40 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === 'card' ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300'}`}>
                        {paymentMethod === 'card' && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                      </div>
                    </div>
                    <div>
                      <p className="font-bold text-xs sm:text-sm text-slate-900">Credit / Debit Card</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">Visa, Mastercard, RuPay</p>
                    </div>
                  </div>
                </div>
              </div>
            </form>

            {/* Trust Assurances Footer Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="flex items-center gap-2 p-3 bg-white rounded-xl border border-slate-200/60 shadow-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-[11px] font-bold text-slate-700">100% Genuine Medicine</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-white rounded-xl border border-slate-200/60 shadow-xs">
                <Truck className="w-4 h-4 text-indigo-600 shrink-0" />
                <span className="text-[11px] font-bold text-slate-700">Temperature Controlled</span>
              </div>
              <div className="hidden sm:flex items-center gap-2 p-3 bg-white rounded-xl border border-slate-200/60 shadow-xs">
                <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                <span className="text-[11px] font-bold text-slate-700">Pharmacist Verified</span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Order Summary & Action Card */}
          <div className="lg:col-span-5">
            <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/80 shadow-sm sticky top-6">
              
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-base sm:text-lg font-black text-slate-900">Order Summary</h3>
                <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                  {cartItems.length} {cartItems.length === 1 ? 'Item' : 'Items'}
                </span>
              </div>

              {/* Free Delivery Bar */}
              {discountedSubtotal < freeShippingThreshold && (
                <div className="bg-amber-50 border border-amber-200/70 p-3 rounded-xl mb-4">
                  <div className="flex justify-between items-center text-[11px] font-bold text-amber-900 mb-1.5">
                    <span>Add ₹{(freeShippingThreshold - discountedSubtotal).toFixed(2)} more for FREE Delivery</span>
                    <span>₹{discountedSubtotal.toFixed(0)} / ₹{freeShippingThreshold}</span>
                  </div>
                  <div className="w-full bg-amber-200/60 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-amber-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, (discountedSubtotal / freeShippingThreshold) * 100)}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Items List */}
              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                <AnimatePresence>
                  {cartItems.map((item: any) => {
                    const medId = item.medicineId || item.id;
                    const quotedItem = quotation?.items?.find((q: any) => q.medicineId === medId);
                    const discountPercent = quotedItem?.disc ?? quotation?.totalDisc ?? 0;

                    const originalPrice = item.unitPrice ?? item.medicine?.price ?? item.price ?? 0;
                    const discountedPrice = originalPrice * (1 - discountPercent / 100);
                    const medicineName = item.medicine?.name || item.name || 'Prescription Medicine';

                    return (
                      <motion.div
                        key={medId}
                        layout
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/60 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                              {medicineName}
                            </h4>
                            <button
                              onClick={() => dispatch(removeItem(medId))}
                              className="text-slate-400 hover:text-rose-500 p-0.5 rounded transition-colors"
                              title="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {discountPercent > 0 && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded mt-1">
                              <Tag className="w-2.5 h-2.5" /> {discountPercent}% Saved
                            </span>
                          )}

                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-baseline gap-1.5">
                              <span className="font-black text-slate-900 text-sm">
                                ₹{(discountedPrice * item.quantity).toFixed(2)}
                              </span>
                              {discountPercent > 0 && (
                                <span className="text-[10px] text-slate-400 line-through">
                                  ₹{(originalPrice * item.quantity).toFixed(2)}
                                </span>
                              )}
                            </div>

                            {/* Quantity Controls */}
                            <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg p-0.5 shadow-2xs">
                              <button
                                onClick={() => dispatch(updateQuantity({ medicineId: medId, quantity: item.quantity - 1 }))}
                                className="w-6 h-6 flex items-center justify-center text-slate-500 hover:text-indigo-600 rounded active:bg-slate-100"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-xs font-bold w-4 text-center text-slate-800">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => dispatch(updateQuantity({ medicineId: medId, quantity: item.quantity + 1 }))}
                                className="w-6 h-6 flex items-center justify-center text-slate-500 hover:text-indigo-600 rounded active:bg-slate-100"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>

              {/* Price Calculation Breakdown */}
              <div className="border-t border-slate-100 mt-5 pt-4 space-y-2.5 text-xs">
                <div className="flex justify-between font-medium text-slate-500">
                  <span>Cart Items Value (MRP)</span>
                  <span className="font-semibold text-slate-800">₹{rawSubtotal.toFixed(2)}</span>
                </div>

                {totalDiscountSaved > 0 && (
                  <div className="flex justify-between font-bold text-emerald-600">
                    <span className="flex items-center gap-1">
                      <BadgePercent className="w-3.5 h-3.5" /> Pharmacy Discount
                    </span>
                    <span>-₹{totalDiscountSaved.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between font-medium text-slate-500">
                  <span>Discounted Subtotal</span>
                  <span className="font-semibold text-slate-800">₹{discountedSubtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between font-medium text-slate-500">
                  <span>Delivery Charges</span>
                  {shippingFee === 0 ? (
                    <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded text-[10px]">
                      FREE
                    </span>
                  ) : (
                    <span className="font-semibold text-slate-800">₹{shippingFee.toFixed(2)}</span>
                  )}
                </div>
              </div>

              {/* Final Total Bar */}
              <div className="border-t border-slate-200 mt-4 pt-4 flex justify-between items-baseline">
                <div>
                  <span className="text-sm font-black text-slate-900 block">Total Amount</span>
                  <span className="text-[10px] text-slate-400 font-medium">Inclusive of all taxes</span>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-indigo-700 tracking-tight">
                    ₹{finalTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Order Submission Button */}
              <Button
                type="submit"
                form="checkout-form"
                disabled={isProcessing}
                className="w-full mt-6 bg-linear-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white py-6 rounded-xl font-black text-sm shadow-lg shadow-indigo-600/25 active:scale-[0.99] transition-all"
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    <span>Placing Your Order...</span>
                  </div>
                ) : (
                  `Place Order • ₹${finalTotal.toFixed(2)}`
                )}
              </Button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}