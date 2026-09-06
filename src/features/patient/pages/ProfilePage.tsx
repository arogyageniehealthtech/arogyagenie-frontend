import React, { useState, useEffect, useRef } from 'react';
import { User, Phone, Save, Edit2, Loader2, HeartPulse } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from '@/store/slices/authSlice';
import { patientApi } from '../api/profile.api';
import type { GenderType,ProfileFormData } from '../types/profile.types'; // Update import path according to your structure



const initialFormState: ProfileFormData = {
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  gender: 'PREFER_NOT_TO_SAY',
  phone: '',
  emergencyContact: '',
  city: '',
  state: '',
  address: '',
  bloodGroup: '',
  allergies: '',
  existingConditions: '',
  currentMedications: '',
  previousSurgeries: '',
};

export default function ProfilePage() {
  const dispatch = useDispatch();
  const authUser = useSelector((state: any) => state.auth.user);

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isNewProfile, setIsNewProfile] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>(initialFormState);

  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;

    const fetchProfile = async () => {
      try {
        const data = await patientApi.getMe();

        if (data) {
          // Supports both dateOfBirth and dob if property names differ across models
          const rawDob = data.dateOfBirth || data.dob || '';

          setFormData({
            firstName: data.firstName || authUser?.firstName || '',
            lastName: data.lastName || authUser?.lastName || '',
            dateOfBirth: rawDob ? rawDob.split('T')[0] : '',
            gender: (data.gender as GenderType) || 'PREFER_NOT_TO_SAY',
            bloodGroup: data.bloodGroup || '',
            phone: data.phone || authUser?.phone || '',
            emergencyContact: data.emergencyContact || '',
            city: data.city || '',
            state: data.state || '',
            address: data.address || '',
            allergies: data.allergies || '',
            existingConditions: data.existingConditions || '',
            currentMedications: data.currentMedications || '',
            previousSurgeries: data.previousSurgeries || '',
          });
          setIsNewProfile(false);
          setIsEditing(false);
        }
      } catch (err: any) {
        if (err?.response?.status === 404 || !authUser?.profile || authUser?.profile?.type === null) {
          setIsNewProfile(true);
          setIsEditing(true);
          setFormData(prev => ({
            ...prev,
            firstName: authUser?.firstName || '',
            lastName: authUser?.lastName || '',
            phone: authUser?.phone || '',
          }));
        } else {
          toast.error('Failed to load profile data.');
        }
      } finally {
        setIsLoading(false);
        hasFetched.current = true;
      }
    };

    fetchProfile();
  }, [authUser?.firstName, authUser?.lastName, authUser?.phone, authUser?.profile]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'gender' ? (value as GenderType) : value,
    }));
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.dateOfBirth) {
      toast.error('Date of birth is required.');
      return;
    }

    setIsSaving(true);
    const toastId = toast.loading('Saving profile...');

    try {
      const payload = {
        ...formData,
        gender: formData.gender as GenderType,
        dateOfBirth: new Date(formData.dateOfBirth).toISOString(),
      };

      let updatedData;
      if (isNewProfile) {
        updatedData = await patientApi.createProfile(payload);
        setIsNewProfile(false);
      } else {
        updatedData = await patientApi.updateProfile(payload);
      }

      dispatch(
        updateUser({
          firstName: updatedData.firstName,
          lastName: updatedData.lastName,
          profile: {
            type: 'PATIENT',
            id: updatedData.id,
            firstName: updatedData.firstName,
            lastName: updatedData.lastName,
          },
        })
      );

      setIsEditing(false);
      toast.success('Profile saved successfully!', { id: toastId });
    } catch (err: any) {
      const errorMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error?.message ||
        'Failed to save changes.';
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

  const inputStyles =
    'w-full px-3.5 py-2.5 bg-slate-50/60 border border-slate-200 rounded-2xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#5B21B6]/20 focus:border-[#5B21B6] transition-all disabled:opacity-60 disabled:cursor-not-allowed';

  return (
    <div className="max-w-4xl mx-auto space-y-6 px-3 sm:px-6 py-6 font-sans bg-transparent min-h-screen text-slate-900">
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            borderRadius: '16px',
            background: '#333',
            color: '#fff',
            fontSize: '14px',
            fontWeight: '500',
          },
        }}
      />

      <form onSubmit={handleSave} className="space-y-6">
        {/* Top Header & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 sm:gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              My Profile
            </h1>
            <p className="text-xs sm:text-sm font-medium text-slate-500 mt-0.5">
              {isNewProfile
                ? 'Complete your profile to enable bookings.'
                : 'Manage your personal details and medical background.'}
            </p>
          </div>

          <div className="relative h-10.5 w-full sm:w-60 shrink-0">
            {/* Edit Button */}
            <div
              className={`absolute top-0 right-0 w-full sm:w-auto transition-all duration-300 sm:origin-right origin-center ${
                isEditing ? 'opacity-0 scale-90 pointer-events-none' : 'opacity-100 scale-100'
              }`}
            >
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-white border border-slate-200 hover:border-purple-300 hover:bg-purple-50 text-slate-700 hover:text-purple-700 rounded-2xl font-bold text-xs sm:text-sm shadow-sm transition-all active:scale-95 shrink-0"
              >
                <Edit2 className="w-4 h-4" /> Edit Profile
              </button>
            </div>

            {/* Cancel & Save Buttons */}
            <div
              className={`absolute top-0 right-0 w-full sm:w-auto flex items-center gap-2 transition-all duration-300 sm:origin-right origin-center ${
                !isEditing ? 'opacity-0 scale-90 pointer-events-none' : 'opacity-100 scale-100'
              }`}
            >
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
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Saving
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" /> Save
                  </>
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
              <p className="text-[11px] text-slate-500 font-medium">Required Core Details</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                First Name <span className="text-rose-500">*</span>
              </label>
              <input
                required
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                disabled={!isEditing || isSaving}
                className={inputStyles}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                Last Name <span className="text-rose-500">*</span>
              </label>
              <input
                required
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                disabled={!isEditing || isSaving}
                className={inputStyles}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                Date of Birth <span className="text-rose-500">*</span>
              </label>
              <input
                required
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                disabled={!isEditing || isSaving}
                className={inputStyles}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                Gender <span className="text-rose-500">*</span>
              </label>
              <select
                required
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                disabled={!isEditing || isSaving}
                className={inputStyles}
              >
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
                <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Contact & Address */}
        <div className="bg-transparent p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="p-2 bg-purple-50 text-[#5B21B6] rounded-xl border border-purple-100">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-sm">Contact Information</h3>
              <p className="text-[11px] text-slate-500 font-medium">Reachability & Location</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={!isEditing || isSaving}
                className={inputStyles}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Emergency Contact</label>
              <input
                type="tel"
                name="emergencyContact"
                value={formData.emergencyContact}
                onChange={handleChange}
                disabled={!isEditing || isSaving}
                className={inputStyles}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                disabled={!isEditing || isSaving}
                className={inputStyles}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">State</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                disabled={!isEditing || isSaving}
                className={inputStyles}
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-bold text-slate-700">Street Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                disabled={!isEditing || isSaving}
                className={inputStyles}
              />
            </div>
          </div>
        </div>

        {/* Section 3: Medical Details */}
        <div className="bg-transparent p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="p-2 bg-purple-50 text-[#5B21B6] rounded-xl border border-purple-100">
              <HeartPulse className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-sm">Medical Details</h3>
              <p className="text-[11px] text-slate-500 font-medium">Health history & prescriptions</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-bold text-slate-700">Blood Group</label>
              <select
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
                disabled={!isEditing || isSaving}
                className={inputStyles}
              >
                <option value="">Select Blood Group</option>
                <option value="A_POSITIVE">A+</option>
                <option value="A_NEGATIVE">A-</option>
                <option value="B_POSITIVE">B+</option>
                <option value="B_NEGATIVE">B-</option>
                <option value="AB_POSITIVE">AB+</option>
                <option value="AB_NEGATIVE">AB-</option>
                <option value="O_POSITIVE">O+</option>
                <option value="O_NEGATIVE">O-</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Known Allergies</label>
              <textarea
                rows={2}
                name="allergies"
                value={formData.allergies}
                onChange={handleChange}
                disabled={!isEditing || isSaving}
                placeholder="Penicillin, Peanuts, etc."
                className={inputStyles}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Existing Conditions</label>
              <textarea
                rows={2}
                name="existingConditions"
                value={formData.existingConditions}
                onChange={handleChange}
                disabled={!isEditing || isSaving}
                placeholder="Asthma, Hypertension, etc."
                className={inputStyles}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Current Medications</label>
              <textarea
                rows={2}
                name="currentMedications"
                value={formData.currentMedications}
                onChange={handleChange}
                disabled={!isEditing || isSaving}
                placeholder="Metformin 500mg, etc."
                className={inputStyles}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Previous Surgeries</label>
              <textarea
                rows={2}
                name="previousSurgeries"
                value={formData.previousSurgeries}
                onChange={handleChange}
                disabled={!isEditing || isSaving}
                placeholder="Appendectomy (2018), etc."
                className={inputStyles}
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}