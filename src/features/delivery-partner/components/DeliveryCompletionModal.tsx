import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Loader2, KeyRound } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

interface CompletionProps {
  orderId: string;
  earnings: number;
  onSuccessCallback: () => void;
}

export default function DeliveryCompletionModal({ orderId, earnings, onSuccessCallback }: CompletionProps) {
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 4) return toast.error("Please enter a 4-digit OTP.");
    
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setIsSuccess(true);
      setTimeout(() => onSuccessCallback(), 3000); // Wait 3s then fire callback to cleanup
    }, 1500);
  };

  if (isSuccess) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white p-8 rounded-3xl shadow-2xl text-center border border-slate-100 max-w-sm mx-auto w-full">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1, rotate: [0, 10, 0] }} transition={{ type: 'spring', damping: 12 }} className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-12 h-12" />
        </motion.div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">Delivery Completed!</h2>
        <p className="text-slate-500 text-sm mb-6">Order {orderId} delivered successfully.</p>
        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 mb-8">
          <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">You Earned</p>
          <p className="text-3xl font-black text-emerald-700">₹{earnings}</p>
        </div>
        <button onClick={() => navigate('/delivery/dashboard')} className="w-full py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors">Back to Dashboard</button>
      </motion.div>
    );
  }

  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-200 max-w-sm mx-auto w-full">
      <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
        <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600"><KeyRound className="w-5 h-5" /></div>
        <div className="text-left">
          <h3 className="font-bold text-slate-900 text-lg">Verify Delivery</h3>
          <p className="text-xs text-slate-500">Ask the patient for the 4-digit PIN</p>
        </div>
      </div>

      <form onSubmit={handleVerify} className="space-y-6">
        <div>
          <input 
            autoFocus type="text" maxLength={4} placeholder="• • • •" value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
            className="w-full text-center text-4xl tracking-[1em] font-black text-slate-900 bg-slate-50 border border-slate-200 rounded-xl py-4 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
          />
        </div>
        <button 
          disabled={isVerifying || otp.length !== 4} type="submit"
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/30 transition-all flex justify-center disabled:opacity-50"
        >
          {isVerifying ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirm Delivery'}
        </button>
      </form>
    </div>
  );
}