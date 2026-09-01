import React, { useState, useEffect } from 'react';
import { User, Phone, FileText, Save, Edit2, X, Loader2 } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

interface ProfileFormData {
  firstName: string;
  lastName: string;
  dob: string;
  age: string;
  gender: string;
  phone: string;
  emergencyContact: string;
  city: string;
  state: string;
  address: string;
  bloodGroup: string;
  allergies: string;
  existingConditions: string;
  currentMedications: string;
  previousSurgeries: string;
}

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: '', lastName: '', dob: '', age: '', gender: '',
    phone: '', emergencyContact: '', city: '', state: '', address: '',
    bloodGroup: '', allergies: '', existingConditions: '', currentMedications: '', previousSurgeries: ''
  });

  // Fetch Profile Data on Mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/profile'); // Replace with your GET endpoint
        if (!response.ok) throw new Error('Failed to fetch profile data');
        
        const data = await response.json();
        setFormData(data);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'An error occurred while loading.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Save Profile Data
  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);

    const toastId = toast.loading('Saving profile...');

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to update profile');

      setIsEditing(false);
      toast.success('Profile saved successfully!', { id: toastId });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save changes.', { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <Loader2 className="w-8 h-8 text-[#5B21B6] animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-5 px-3 sm:px-6 py-6 font-sans bg-transparent min-h-screen text-slate-900">
      
      <Toaster 
        position="top-center"
        toastOptions={{
          style: {
            borderRadius: '16px',
            background: '#333',
            color: '#fff',
            fontSize: '14px',
            fontWeight: '500'
          },
        }} 
      />

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Top Header & Smooth Actions */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 sm:gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">My Profile</h1>
            <p className="text-xs sm:text-sm font-medium text-slate-500 mt-0.5">Manage your personal details and medical background.</p>
          </div>

          {/* Action Buttons Animation Wrapper */}
          <div className="relative h-[42px] w-full sm:w-[240px] flex-shrink-0">
            
            {/* Edit Button */}
            <div
              className={`absolute top-0 right-0 w-full sm:w-auto transition-all duration-400 ease-[cubic-bezier(0.23,1,0.32,1)] sm:origin-right origin-center ${
                isEditing ? 'opacity-0 scale-90 pointer-events-none' : 'opacity-100 scale-100'
              }`}
            >
              <button 
                type="button"
                onClick={(e) => { e.preventDefault(); setIsEditing(true); }}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-white border border-slate-200 hover:border-purple-300 hover:bg-purple-50 text-slate-700 hover:text-purple-700 rounded-2xl font-bold text-xs sm:text-sm shadow-sm transition-all active:scale-95 shrink-0"
              >
                <Edit2 className="w-4 h-4" /> Edit Profile
              </button>
            </div>

            {/* Cancel & Save Buttons */}
            <div
              className={`absolute top-0 right-0 w-full sm:w-auto flex items-center gap-2 transition-all duration-400 ease-[cubic-bezier(0.23,1,0.32,1)] sm:origin-right origin-center ${
                !isEditing ? 'opacity-0 scale-90 pointer-events-none' : 'opacity-100 scale-100'
              }`}
            >
              <button 
                type="button"
                onClick={() => setIsEditing(false)}
                disabled={isSaving}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-2xl font-bold text-xs sm:text-sm shadow-sm transition-all active:scale-95 shrink-0 disabled:opacity-50"
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={isSaving}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-[#5B21B6] hover:bg-[#4c1d95] text-white rounded-2xl font-bold text-xs sm:text-sm shadow-md shadow-purple-900/20 transition-all active:scale-95 shrink-0 disabled:opacity-70"
              >
                {isSaving ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Saving</>
                ) : (
                  <><Save className="w-4 h-4" /> Save</>
                )}
              </button>
            </div>
          </div>
        </div>
        
        {/* Section 1: Personal Information */}
        <div className="bg-transparent p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="p-2 bg-purple-50 text-[#5B21B6] rounded-xl border border-purple-100">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-sm">Personal Information</h3>
              <p className="text-[11px] text-slate-500 font-medium">Legal name, age, and identity details.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">First Name</label>
              <input 
                type="text" 
                name="firstName" 
                value={formData.firstName} 
                onChange={handleChange}
                disabled={!isEditing || isSaving}
                className="w-full px-3.5 py-2.5 bg-slate-50/60 border border-slate-200 rounded-2xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#5B21B6]/20 focus:border-[#5B21B6] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Last Name</label>
              <input 
                type="text" 
                name="lastName" 
                value={formData.lastName} 
                onChange={handleChange}
                disabled={!isEditing || isSaving}
                className="w-full px-3.5 py-2.5 bg-slate-50/60 border border-slate-200 rounded-2xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#5B21B6]/20 focus:border-[#5B21B6] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Date of Birth</label>
              <input 
                type="date" 
                name="dob" 
                value={formData.dob} 
                onChange={handleChange}
                disabled={!isEditing || isSaving}
                className="w-full px-3.5 py-2.5 bg-slate-50/60 border border-slate-200 rounded-2xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#5B21B6]/20 focus:border-[#5B21B6] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Age</label>
              <input 
                type="text" 
                name="age" 
                placeholder="e.g. 28"
                value={formData.age} 
                onChange={handleChange}
                disabled={!isEditing || isSaving}
                className="w-full px-3.5 py-2.5 bg-slate-50/60 border border-slate-200 rounded-2xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#5B21B6]/20 focus:border-[#5B21B6] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-bold text-slate-700">Gender</label>
              <input 
                type="text" 
                name="gender" 
                placeholder="e.g. Male, Female, Other"
                value={formData.gender} 
                onChange={handleChange}
                disabled={!isEditing || isSaving}
                className="w-full px-3.5 py-2.5 bg-slate-50/60 border border-slate-200 rounded-2xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#5B21B6]/20 focus:border-[#5B21B6] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Contact & Address Details */}
        <div className="bg-transparent p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="p-2 bg-purple-50 text-[#5B21B6] rounded-xl border border-purple-100">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-sm">Contact & Address Details</h3>
              <p className="text-[11px] text-slate-500 font-medium">Phone numbers, emergency contacts, and residential location.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Phone Number</label>
              <input 
                type="text" 
                name="phone" 
                value={formData.phone} 
                onChange={handleChange}
                disabled={!isEditing || isSaving}
                className="w-full px-3.5 py-2.5 bg-slate-50/60 border border-slate-200 rounded-2xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#5B21B6]/20 focus:border-[#5B21B6] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Emergency Contact</label>
              <input 
                type="text" 
                name="emergencyContact" 
                placeholder="e.g. Spouse: +91 98765 43211"
                value={formData.emergencyContact} 
                onChange={handleChange}
                disabled={!isEditing || isSaving}
                className="w-full px-3.5 py-2.5 bg-slate-50/60 border border-slate-200 rounded-2xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#5B21B6]/20 focus:border-[#5B21B6] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">City</label>
              <input 
                type="text" 
                name="city" 
                placeholder="e.g. New Delhi"
                value={formData.city} 
                onChange={handleChange}
                disabled={!isEditing || isSaving}
                className="w-full px-3.5 py-2.5 bg-slate-50/60 border border-slate-200 rounded-2xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#5B21B6]/20 focus:border-[#5B21B6] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">State</label>
              <input 
                type="text" 
                name="state" 
                placeholder="e.g. Delhi"
                value={formData.state} 
                onChange={handleChange}
                disabled={!isEditing || isSaving}
                className="w-full px-3.5 py-2.5 bg-slate-50/60 border border-slate-200 rounded-2xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#5B21B6]/20 focus:border-[#5B21B6] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-bold text-slate-700">Residential Address</label>
              <input 
                type="text" 
                name="address" 
                placeholder="Full home address..."
                value={formData.address} 
                onChange={handleChange}
                disabled={!isEditing || isSaving}
                className="w-full px-3.5 py-2.5 bg-slate-50/60 border border-slate-200 rounded-2xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#5B21B6]/20 focus:border-[#5B21B6] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Medical Background & History */}
        <div className="bg-transparent p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 bg-emerald-50/50 p-3 rounded-2xl border">
            <div className="p-2 bg-emerald-600 text-white rounded-xl shadow-xs">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-sm">Medical Background & History</h3>
              <p className="text-[11px] text-slate-500 font-medium">Blood group, known allergies, chronic conditions, and current medications.</p>
            </div>
          </div>

          <div className="space-y-4 pt-1">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Blood Group</label>
              <input 
                type="text" 
                name="bloodGroup" 
                placeholder="e.g. O+, A-, AB+"
                value={formData.bloodGroup} 
                onChange={handleChange}
                disabled={!isEditing || isSaving}
                className="w-full px-3.5 py-2.5 bg-slate-50/60 border border-slate-200 rounded-2xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#5B21B6]/20 focus:border-[#5B21B6] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Allergies</label>
              <textarea 
                name="allergies" 
                rows={2}
                placeholder="List any known drug, food, or environmental allergies..."
                value={formData.allergies} 
                onChange={handleChange}
                disabled={!isEditing || isSaving}
                className="w-full p-3.5 bg-slate-50/60 border border-slate-200 rounded-2xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#5B21B6]/20 focus:border-[#5B21B6] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Existing Conditions</label>
              <textarea 
                name="existingConditions" 
                rows={2}
                placeholder="List chronic or existing conditions (e.g. Asthma, Hypertension, Type 2 Diabetes)..."
                value={formData.existingConditions} 
                onChange={handleChange}
                disabled={!isEditing || isSaving}
                className="w-full p-3.5 bg-slate-50/60 border border-slate-200 rounded-2xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#5B21B6]/20 focus:border-[#5B21B6] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Current Medications</label>
              <textarea 
                name="currentMedications" 
                rows={2}
                placeholder="List prescription or over-the-counter medications..."
                value={formData.currentMedications} 
                onChange={handleChange}
                disabled={!isEditing || isSaving}
                className="w-full p-3.5 bg-slate-50/60 border border-slate-200 rounded-2xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#5B21B6]/20 focus:border-[#5B21B6] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Previous Major Illnesses / Surgeries</label>
              <textarea 
                name="previousSurgeries" 
                rows={2}
                placeholder="List past major illnesses, hospitalizations, or surgeries..."
                value={formData.previousSurgeries} 
                onChange={handleChange}
                disabled={!isEditing || isSaving}
                className="w-full p-3.5 bg-slate-50/60 border border-slate-200 rounded-2xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#5B21B6]/20 focus:border-[#5B21B6] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>
          </div>
        </div>

      </form>
    </div>
  );
}