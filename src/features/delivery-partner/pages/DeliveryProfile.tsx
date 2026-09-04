import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { User, Mail, Phone, Truck, ShieldCheck, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const profileSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(10, "Invalid phone"),
  vehicleType: z.string().min(2, "Vehicle type required"),
  vehicleNumber: z.string().min(4, "Vehicle number required"),
});

export default function DeliveryProfile() {
  const [isSaving, setIsSaving] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: 'Rajat Kumar', email: 'rajat.k@example.com', phone: '+91 9876543210', vehicleType: 'Motorcycle / Scooter', vehicleNumber: 'WB 02 AB 1234' }
  });

  const onSubmit = (data: any) => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Profile updated successfully!');
    }, 1200);
  };

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 flex flex-col sm:flex-row gap-6 items-center sm:items-start">
        <div className="w-24 h-24 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-3xl font-black border-4 border-white shadow-lg shrink-0">
          RK
        </div>
        <div className="flex-1 text-center sm:text-left">
          <h1 className="text-2xl font-bold text-slate-900">Rajat Kumar</h1>
          <p className="text-slate-500 text-sm mb-4">Delivery Partner • Joined Aug 2025</p>
          <div className="flex flex-wrap justify-center sm:justify-start gap-4">
            <Badge icon={ShieldCheck} label="ID: DP-88492" color="bg-blue-50 text-blue-700" />
            <Badge icon={Truck} label="248 Deliveries" color="bg-emerald-50 text-emerald-700" />
            <div className="px-3 py-1 bg-amber-50 text-amber-700 text-xs font-bold rounded-lg flex items-center gap-1.5">★ 4.8 Rating</div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-4 mb-4">Personal Information</h3>
          <div className="grid sm:grid-cols-2 gap-5">
            <InputField label="Full Name" icon={User} {...register('name')} error={errors.name} />
            <InputField label="Email Address" icon={Mail} {...register('email')} error={errors.email} type="email" />
            <InputField label="Phone Number" icon={Phone} {...register('phone')} error={errors.phone} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-4 mb-4">Vehicle Information</h3>
          <div className="grid sm:grid-cols-2 gap-5">
            <InputField label="Vehicle Type" icon={Truck} {...register('vehicleType')} error={errors.vehicleType} />
            <InputField label="Vehicle Number" icon={ShieldCheck} {...register('vehicleNumber')} error={errors.vehicleNumber} className="uppercase" />
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={isSaving} className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-2 disabled:opacity-50 transition-all">
            {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}

const Badge = ({ icon: Icon, label, color }: any) => (
  <div className={`px-3 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1.5 ${color}`}><Icon className="w-3.5 h-3.5" />{label}</div>
);

const InputField = ({ label, icon: Icon, error, ...props }: any) => (
  <div>
    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider pl-1">{label}</label>
    <div className="relative mt-1">
      <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
      <input className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl text-sm font-medium text-slate-900 outline-none transition-all ${error ? 'border-rose-300 focus:ring-rose-500/20' : 'border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10'}`} {...props} />
    </div>
    {error && <p className="text-rose-500 text-[10px] mt-1 pl-1 font-semibold">{error.message}</p>}
  </div>
);