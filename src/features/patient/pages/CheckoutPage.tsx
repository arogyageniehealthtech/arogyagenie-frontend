import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, MapPin, CreditCard, CheckCircle2, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import toast from 'react-hot-toast';

import { selectCartItems, updateQuantity, removeItem, clearCart } from '@/store/slices/cartSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { pharmacyApi } from '../api/pharmacyApi';
import { ROUTES } from '@/constants/routes.constants';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  
  // The quotation object passed from the Pharmacy Selection modal
  const quotation = location.state?.quotation;
  const cartItems = useSelector(selectCartItems) || [];
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: ''
  });

  // Dynamic Calculation
  let rawSubtotal = 0;
  let discountedSubtotal = 0;

  cartItems.forEach((item: any) => {
    const medId = item.medicineId || item.id;
    // Find if this item had a specific discount in the quotation
    const quotedItem = quotation?.items?.find((q: any) => q.medicineId === medId);
    
    // Fallbacks
    const itemDiscountPercent = quotedItem?.disc ?? quotation?.totalDisc ?? 0;
    const originalPrice = item.unitPrice ?? item.medicine?.price ?? item.price ?? 0;
    const discountedPrice = originalPrice * (1 - itemDiscountPercent / 100);
    
    rawSubtotal += originalPrice * item.quantity;
    discountedSubtotal += discountedPrice * item.quantity;
  });

  const totalDiscountSaved = rawSubtotal - discountedSubtotal;
  const shippingFee = discountedSubtotal > 500 ? 0 : 40; 
  const finalTotal = discountedSubtotal + shippingFee;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    setIsProcessing(true);

    try {
      if (quotation?.id && !quotation.id.startsWith('MOCK')) {
        // Accept the real API offer if an offerId exists
        await pharmacyApi.acceptOffer(quotation.id);
      } else {
        // Fallback for mock flow: simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));
      }

      setOrderPlaced(true);
      dispatch(clearCart());
      toast.success('Order placed successfully!');
    } catch (error) {
      toast.error('Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-lg border border-slate-100">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </motion.div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Order Confirmed!</h2>
          <p className="text-slate-500 text-sm mb-8">Your medicines will be delivered safely to {formData.address}. You will receive tracking details shortly.</p>
          <Button onClick={() => navigate(ROUTES.PATIENT.MEDICINE)} className="w-full bg-indigo-600 hover:bg-indigo-700 py-6 rounded-xl font-bold">Back to Pharmacy</Button>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 pt-8 px-4">
        <div className="max-w-4xl mx-auto">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6 -ml-4 text-slate-500"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button>
          <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-slate-200/60 max-w-2xl mx-auto flex flex-col items-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4"><ShoppingBag className="w-8 h-8 text-slate-300" /></div>
            <h2 className="text-xl font-bold text-slate-900">Your cart is empty</h2>
            <Button onClick={() => navigate(ROUTES.PATIENT.MEDICINE)} className="mt-6 bg-indigo-600 hover:bg-indigo-700 rounded-xl px-8">Browse Medicines</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pb-16 pt-6 sm:pt-10 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" size="icon" onClick={() => navigate(-1)} className="rounded-xl border-slate-200"><ArrowLeft className="w-4 h-4" /></Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Checkout</h1>
            <p className="text-sm font-medium text-slate-500">Review your cart and enter delivery details</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-7 space-y-6">
            <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200/70 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-6"><MapPin className="w-5 h-5 text-indigo-600" /> Delivery Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5"><Label className="text-slate-600">Full Name</Label><Input required value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} placeholder="John Doe" className="bg-slate-50" /></div>
                  <div className="space-y-1.5"><Label className="text-slate-600">Phone</Label><Input required value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} type="tel" placeholder="+91 98765 43210" className="bg-slate-50" /></div>
                  <div className="space-y-1.5 sm:col-span-2"><Label className="text-slate-600">Address</Label><Input required value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} placeholder="House/Flat No., Street" className="bg-slate-50" /></div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200/70 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-6"><CreditCard className="w-5 h-5 text-indigo-600" /> Payment Method</h3>
                <RadioGroup defaultValue="cod" className="gap-3">
                  <Label htmlFor="cod" className="flex items-center p-4 border rounded-xl cursor-pointer hover:bg-slate-50 has-data-[state=checked]:border-indigo-600 has-data-[state=checked]:bg-indigo-50/50">
                    <RadioGroupItem value="cod" id="cod" className="text-indigo-600 mr-3" />
                    <div><p className="font-bold text-slate-900">Cash on Delivery</p><p className="text-xs text-slate-500">Pay when order arrives</p></div>
                  </Label>
                </RadioGroup>
              </div>
            </form>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/70 shadow-sm sticky top-24">
              <h3 className="text-lg font-bold text-slate-900 mb-6">Order Summary</h3>
              {quotation && (
                <div className="mb-4 bg-indigo-50 text-indigo-700 p-3 rounded-xl text-xs font-bold border border-indigo-100 flex justify-between">
                  <span>Fulfilling via: {quotation.p?.name || quotation.pharmacy?.name || 'Selected Pharmacy'}</span>
                  <span>{quotation.eta}</span>
                </div>
              )}
              
              <div className="space-y-4 max-h-[35vh] overflow-y-auto pr-2">
                <AnimatePresence>
                  {cartItems.map((item: any) => {
                    const medId = item.medicineId || item.id;
                    const quotedItem = quotation?.items?.find((q: any) => q.medicineId === medId);
                    const discountPercent = quotedItem?.disc ?? quotation?.totalDisc ?? 0;
                    
                    const originalPrice = item.unitPrice ?? item.medicine?.price ?? item.price ?? 0;
                    const discountedPrice = originalPrice * (1 - discountPercent / 100);
                    const medicineName = item.medicine?.name || item.name || 'Medicine';

                    return (
                      <motion.div key={medId} layout exit={{ opacity: 0 }} className="flex gap-4 p-3 rounded-xl border border-slate-100 bg-slate-50/50">
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start gap-2">
                            <h4 className="font-bold text-xs text-slate-900">{medicineName}</h4>
                            <button onClick={() => dispatch(removeItem(medId))} className="text-slate-400 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                          </div>
                          
                          {/* Itemized Discount Info */}
                          {discountPercent > 0 && (
                            <p className="text-[10px] text-green-600 font-bold mt-0.5">
                              Saving {discountPercent}% per item (Orig: ₹{originalPrice})
                            </p>
                          )}

                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-baseline gap-1.5">
                              <span className="font-bold text-indigo-700 text-sm">₹{(discountedPrice * item.quantity).toFixed(2)}</span>
                              {discountPercent > 0 && (
                                <span className="text-[10px] text-slate-400 line-through">₹{(originalPrice * item.quantity).toFixed(2)}</span>
                              )}
                            </div>

                            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg p-0.5">
                              <button onClick={() => dispatch(updateQuantity({ medicineId: medId, quantity: item.quantity - 1 }))} className="w-6 h-6 flex items-center justify-center text-slate-500"><Minus className="w-3 h-3" /></button>
                              <span className="text-[11px] font-bold w-4 text-center">{item.quantity}</span>
                              <button onClick={() => dispatch(updateQuantity({ medicineId: medId, quantity: item.quantity + 1 }))} className="w-6 h-6 flex items-center justify-center text-slate-500"><Plus className="w-3 h-3" /></button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>

              <div className="border-t border-slate-100 mt-6 pt-4 space-y-3">
                <div className="flex justify-between text-sm font-medium text-slate-500">
                  <span>Cart Value</span><span>₹{rawSubtotal.toFixed(2)}</span>
                </div>
                {totalDiscountSaved > 0 && (
                  <div className="flex justify-between text-sm font-medium text-green-600">
                    <span>Pharmacy Discount</span><span>-₹{totalDiscountSaved.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-medium text-slate-600">
                  <span>Subtotal</span><span>₹{discountedSubtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-medium text-slate-600">
                  <span>Shipping</span>{shippingFee === 0 ? <span className="text-green-600 font-bold">Free</span> : <span>₹{shippingFee.toFixed(2)}</span>}
                </div>
              </div>

              <div className="border-t border-slate-100 mt-4 pt-4 flex justify-between items-center">
                <span className="text-base font-bold text-slate-900">Total</span>
                <span className="text-2xl font-black text-indigo-700">₹{finalTotal.toFixed(2)}</span>
              </div>

              <Button type="submit" form="checkout-form" disabled={isProcessing} className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 py-6 rounded-xl font-bold shadow-md shadow-indigo-600/20">
                {isProcessing ? 'Processing Order...' : `Place Order • ₹${finalTotal.toFixed(2)}`}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}