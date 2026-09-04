import { useState } from 'react';
import { Moon, Bell, LogOut, Lock, Globe, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function DeliverySettings() {
  const [settings, setSettings] = useState({
    autoAccept: false, newRequests: true, earningsAlerts: true, dark: false
  });

  const toggle = (key: keyof typeof settings) => setSettings(s => ({ ...s, [key]: !s[key] }));

  const handleLogout = () => {
    if (confirm("Are you sure you want to log out?")) {
      toast.success("Logged out successfully");
      // Handle actual logout logic here
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Settings</h1>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50/50"><h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2"><Shield className="w-4 h-4 text-indigo-500"/> Availability & Operations</h3></div>
        <div className="p-2">
          <SettingToggle label="Auto-Accept Deliveries" description="Automatically accept requests that meet your criteria." value={settings.autoAccept} onChange={() => toggle('autoAccept')} />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50/50"><h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2"><Bell className="w-4 h-4 text-indigo-500"/> Notifications</h3></div>
        <div className="p-2">
          <SettingToggle label="New Delivery Requests" description="Get notified when a new request is nearby." value={settings.newRequests} onChange={() => toggle('newRequests')} />
          <SettingToggle label="Earnings Alerts" description="Get notified when payments are credited." value={settings.earningsAlerts} onChange={() => toggle('earningsAlerts')} />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50/50"><h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2"><Globe className="w-4 h-4 text-indigo-500"/> Preferences</h3></div>
        <div className="p-2">
          <SettingToggle label="Dark Mode" description="Switch to a darker theme for night driving." value={settings.dark} onChange={() => toggle('dark')} icon={Moon} />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50/50"><h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2"><Lock className="w-4 h-4 text-indigo-500"/> Account Security</h3></div>
        <div className="p-5 flex justify-between items-center hover:bg-slate-50 cursor-pointer transition-colors border-b border-slate-100">
          <div><p className="text-sm font-bold text-slate-900">Change Password</p><p className="text-xs text-slate-500 mt-0.5">Update your account password</p></div>
        </div>
        <div onClick={handleLogout} className="p-5 flex justify-between items-center hover:bg-rose-50 cursor-pointer transition-colors group">
          <div><p className="text-sm font-bold text-rose-600">Logout</p><p className="text-xs text-rose-400 mt-0.5">Sign out of this device</p></div>
          <LogOut className="w-5 h-5 text-rose-400 group-hover:text-rose-600" />
        </div>
      </div>
    </div>
  );
}

const SettingToggle = ({ label, description, value, onChange, icon: Icon }: any) => (
  <div className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer" onClick={onChange}>
    <div className="flex items-center gap-3">
      {Icon && <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center"><Icon className="w-4 h-4 text-slate-600" /></div>}
      <div><p className="text-sm font-bold text-slate-900">{label}</p><p className="text-xs text-slate-500 mt-0.5">{description}</p></div>
    </div>
    <div className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${value ? 'bg-indigo-600' : 'bg-slate-300'}`}>
      <motion.div layout className="w-4 h-4 bg-white rounded-full shadow-sm" animate={{ x: value ? 20 : 0 }} transition={{ type: "spring", stiffness: 500, damping: 30 }} />
    </div>
  </div>
);