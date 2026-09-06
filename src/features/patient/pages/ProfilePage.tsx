import React, { useState, useEffect } from 'react';
import { User, Phone, FileText, Save, Edit2, Loader2 } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from '@/store/slices/authSlice';
import { patientApi } from '../api/profile.api';

interface ProfileFormData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  bloodGroup: string;
  phone: string;
  emergencyContact: string;
  city: string;
  state: string;
  address: string;
  allergies: string;
  existingConditions: string;
  currentMedications: string;
  previousSurgeries: string;
}

export default function ProfilePage() {
  const dispatch = useDispatch();
  const authUser = useSelector((state: any) => state.auth.user);

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isNewProfile, setIsNewProfile] = useState(false);
  
  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: authUser?.firstName || '', 
    lastName: authUser?.lastName || '', 
    dateOfBirth: '', 
    gender: 'PREFER_NOT_TO_SAY',
    phone: authUser?.phone || '', 
    emergencyContact: '', city: '', state: '', address: '',
    bloodGroup: '', allergies: '', existingConditions: '', currentMedications: '', previousSurgeries: ''
  });

  // Fetch Profile Data on Mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await patientApi.getMe();
        console.log("Fetched Profile Data:", data);
        
        if (data) {
          setFormData(prev => ({
            ...prev,
            firstName: data.firstName || prev.firstName,
            lastName: data.lastName || prev.lastName,
            dateOfBirth: data.dateOfBirth ? data.dateOfBirth.split('T')[0] : '',
            gender: data.gender || 'PREFER_NOT_TO_SAY',
            bloodGroup: data.bloodGroup || '',
          }));
          setIsNewProfile(false);
          setIsEditing(false); // Default to view mode if profile exists
        }
      } catch (err: any) {
        // If 404 or profile is missing/uninitialized, force edit mode for creation
        if (err?.response?.status === 404 || !authUser?.profile || authUser.profile.type === null) {
          setIsNewProfile(true);
          setIsEditing(true); 
        } else {
          toast.error("Failed to load profile data.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [authUser]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Save Profile Data
  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    const toastId = toast.loading('Saving profile...');

    try {
      const corePayload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender as any, 
        bloodGroup: formData.bloodGroup,
      };

      let updatedData;

      if (isNewProfile) {
        updatedData = await patientApi.createProfile(corePayload);
        setIsNewProfile(false);
      } else {
        updatedData = await patientApi.updateProfile(corePayload);
      }

      dispatch(updateUser({
        firstName: updatedData.firstName,
        lastName: updatedData.lastName,
        profile: {
          type: 'PATIENT',
          id: updatedData.id,
          firstName: updatedData.firstName,
          lastName: updatedData.lastName
        }
      }));

      setIsEditing(false);
      toast.success('Profile saved successfully!', { id: toastId });
    } catch (err: any) {
      const errorMsg = err?.response?.data?.message || err?.response?.data?.error?.message || 'Failed to save changes.';
      toast.error(errorMsg, { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-transparent">
        <Loader2 className="w-8 h-8 text-[#5B21B6] animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-5 px-3 sm:px-6 py-6 font-sans bg-transparent min-h-screen text-slate-900">
      
      <Toaster 
        position="top-center"
        toastOptions={{
          style: { borderRadius: '16px', background: '#333', color: '#fff', fontSize: '14px', fontWeight: '500' },
        }} 
      />

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Top Header & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 sm:gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">My Profile</h1>
            <p className="text-xs sm:text-sm font-medium text-slate-500 mt-0.5">
              {isNewProfile ? "Complete your profile to enable bookings." : "Manage your personal details and medical background."}
            </p>
          </div>

          <div className="relative h-[42px] w-full sm:w-[240px] flex-shrink-0">
            
            {/* Edit Button */}
            <div className={`absolute top-0 right-0 w-full sm:w-auto transition-all duration-300 sm:origin-right origin-center ${isEditing ? 'opacity-0 scale-90 pointer-events-none' : 'opacity-100 scale-100'}`}>
              <button 
                type="button"
                onClick={(e) => { e.preventDefault(); setIsEditing(true); }}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-white border border-slate-200 hover:border-purple-300 hover:bg-purple-50 text-slate-700 hover:text-purple-700 rounded-2xl font-bold text-xs sm:text-sm shadow-sm transition-all active:scale-95 shrink-0"
              >
                <Edit2 className="w-4 h-4" /> Edit Profile
              </button>
            </div>

            {/* Cancel & Save Buttons */}
            <div className={`absolute top-0 right-0 w-full sm:w-auto flex items-center gap-2 transition-all duration-300 sm:origin-right origin-center ${!isEditing ? 'opacity-0 scale-90 pointer-events-none' : 'opacity-100 scale-100'}`}>
              {!isNewProfile && (
                <button 
                  type="button"
                  onClick={() => setIsEditing(false)}
                  disabled={isSaving}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-2xl font-bold text-xs sm:text-sm shadow-sm transition-all active:scale-95 shrink-0 disabled:opacity-50"
                >
                  Cancel
                </button>
              )}
              <button 
                type="submit"
                disabled={isSaving}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-[#5B21B6] hover:bg-[#4c1d95] text-white rounded-2xl font-bold text-xs sm:text-sm shadow-md shadow-purple-900/20 transition-all active:scale-95 shrink-0 disabled:opacity-70"
              >
                {isSaving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving</> : <><Save className="w-4 h-4" /> Save</>}
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
              <p className="text-[11px] text-slate-500 font-medium">Required Core Details</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">First Name <span className="text-rose-500">*</span></label>
              <input required type="text" name="firstName" value={formData.firstName} onChange={handleChange} disabled={!isEditing || isSaving} className="w-full px-3.5 py-2.5 bg-slate-50/60 border border-slate-200 rounded-2xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#5B21B6]/20 focus:border-[#5B21B6] transition-all disabled:opacity-60 disabled:cursor-not-allowed" />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Last Name <span className="text-rose-500">*</span></label>
              <input required type="text" name="lastName" value={formData.lastName} onChange={handleChange} disabled={!isEditing || isSaving} className="w-full px-3.5 py-2.5 bg-slate-50/60 border border-slate-200 rounded-2xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#5B21B6]/20 focus:border-[#5B21B6] transition-all disabled:opacity-60 disabled:cursor-not-allowed" />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Date of Birth <span className="text-rose-500">*</span></label>
              <input required type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} disabled={!isEditing || isSaving} className="w-full px-3.5 py-2.5 bg-slate-50/60 border border-slate-200 rounded-2xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#5B21B6]/20 focus:border-[#5B21B6] transition-all disabled:opacity-60 disabled:cursor-not-allowed" />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Gender <span className="text-rose-500">*</span></label>
              <select required name="gender" value={formData.gender} onChange={handleChange} disabled={!isEditing || isSaving} className="w-full px-3.5 py-2.5 bg-slate-50/60 border border-slate-200 rounded-2xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#5B21B6]/20 focus:border-[#5B21B6] transition-all disabled:opacity-60 disabled:cursor-not-allowed">
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
                <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
              </select>
            </div>
          </div>
        </div>

      </form>
    </div>
  );
}