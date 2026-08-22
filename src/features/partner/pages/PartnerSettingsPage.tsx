import React, { useState, useEffect } from 'react';
import {
  Settings,
  Building2,
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  Save,
  CheckCircle2,
} from 'lucide-react';
import { usePartner } from '../context/PartnerContext';
import { PartnerSkeleton } from '../components/common/PartnerSkeleton';
import { Button } from '@/components/ui/button';

export const PartnerSettingsPage: React.FC = () => {
  const { activeProvider, isLoading, updateSettings } = usePartner();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [operationalHours, setOperationalHours] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [isOpen, setIsOpen] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (activeProvider) {
      setName(activeProvider.name);
      setPhone(activeProvider.phone);
      setEmail(activeProvider.email);
      setAddress(activeProvider.address);
      setOperationalHours(activeProvider.operationalHours);
      setEmergencyContact(activeProvider.emergencyContact || '');
      setIsOpen(activeProvider.isOpen);
    }
  }, [activeProvider]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateSettings({
        name,
        phone,
        email,
        address,
        operationalHours,
        emergencyContact,
        isOpen,
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading && !activeProvider) {
    return <PartnerSkeleton rows={5} />;
  }

  return (
    <div className="max-w-4xl space-y-6 animate-in fade-in duration-300">
      
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
          <Settings className="h-6 w-6 text-indigo-600" />
          Facility Profile & Operations Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Configure verified contact info, operating hours, and dispatch parameters for {activeProvider?.name}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Verification Status Card */}
        <div className="p-5 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-emerald-950">AarogyaGenie Verified Organization</h4>
              <p className="text-xs text-emerald-800">
                License: <strong>{activeProvider?.licenseNumber}</strong> • Verified on {activeProvider?.verifiedAt}
              </p>
            </div>
          </div>

          <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-600 text-white shadow-2xs">
            Active Verified Partner
          </span>
        </div>

        {/* General Details Section */}
        <div className="p-6 rounded-2xl border border-slate-200/90 bg-white shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Building2 className="h-5 w-5 text-indigo-600" />
            Organization Profile
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Facility Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Provider Modality</label>
              <input
                type="text"
                disabled
                value={activeProvider?.type || 'PHARMACY'}
                className="w-full rounded-xl border border-slate-200 bg-slate-100 p-2.5 text-xs text-slate-500 font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Official Contact Phone</label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Dispatch / Support Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">Facility Physical Address</label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Operating Hours & Dispatch Schedule */}
        <div className="p-6 rounded-2xl border border-slate-200/90 bg-white shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Clock className="h-5 w-5 text-indigo-600" />
            Hours & Emergency Helpline
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Operational Hours</label>
              <input
                type="text"
                required
                value={operationalHours}
                onChange={(e) => setOperationalHours(e.target.value)}
                placeholder="e.g. 08:00 AM - 11:00 PM"
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Emergency Escalation Helpline</label>
              <input
                type="text"
                value={emergencyContact}
                onChange={(e) => setEmergencyContact(e.target.value)}
                placeholder="e.g. +91 98765 43211"
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Save Controls */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="submit"
            isLoading={isSaving}
            className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
            leftIcon={<Save className="h-4 w-4" />}
          >
            Save Settings
          </Button>
        </div>

      </form>

    </div>
  );
};

export default PartnerSettingsPage;
