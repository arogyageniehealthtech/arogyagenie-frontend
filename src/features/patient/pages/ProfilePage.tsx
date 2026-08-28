import React, { useState } from 'react';
import { User, Phone, FileText, Save } from 'lucide-react';

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
  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: 'RAJAT',
    lastName: 'Mondal',
    dob: '2026-08-11',
    age: '28',
    gender: '',
    phone: '+9174788971622',
    emergencyContact: '',
    city: '',
    state: '',
    address: '',
    bloodGroup: '',
    allergies: '',
    existingConditions: '',
    currentMedications: '',
    previousSurgeries: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert('Profile saved successfully!');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-5 px-3 sm:px-6 py-6 font-sans bg-[#F8FAFC] min-h-screen text-slate-900">
      
      {/* Page Title & Subtitle */}
      {/* <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">My Profile</h1>
        <p className="text-xs sm:text-sm font-medium text-slate-500 mt-0.5">Manage your personal details, contact preferences, and medical background.</p>
      </div> */}

      <form onSubmit={handleSave} className="space-y-5">
        
        {/* Top Profile Card */}
        {/* <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"> */}
          {/* <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#5B21B6] text-white flex items-center justify-center font-black text-lg shadow-md shadow-purple-900/20">
              RM
            </div> */}
            {/* <div>
              <div className="flex items-center gap-2">
                <h2 className="font-black text-base sm:text-lg text-slate-900">RAJAT Mondal</h2>
                <span className="bg-purple-100 text-purple-700 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-purple-200">
                  👑 Premium Member
                </span>
              </div>
              <p className="text-xs font-medium text-slate-500 mt-0.5">userrajat@gmail.com</p>
            </div>
          </div> */}

          {/* <button 
            type="submit"
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#5B21B6] hover:bg-[#4c1d95] text-white rounded-2xl font-bold text-xs sm:text-sm shadow-md shadow-purple-900/20 transition-all active:scale-95"
          >
            <Save className="w-4 h-4" /> Save Profile
          </button>
        </div> */}

        {/* Section 1: Personal Information */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
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
                className="w-full px-3.5 py-2.5 bg-slate-50/60 border border-slate-200 rounded-2xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#5B21B6]/20 focus:border-[#5B21B6] transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Last Name</label>
              <input 
                type="text" 
                name="lastName" 
                value={formData.lastName} 
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-50/60 border border-slate-200 rounded-2xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#5B21B6]/20 focus:border-[#5B21B6] transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Date of Birth</label>
              <input 
                type="date" 
                name="dob" 
                value={formData.dob} 
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-50/60 border border-slate-200 rounded-2xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#5B21B6]/20 focus:border-[#5B21B6] transition-all"
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
                className="w-full px-3.5 py-2.5 bg-slate-50/60 border border-slate-200 rounded-2xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#5B21B6]/20 focus:border-[#5B21B6] transition-all"
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
                className="w-full px-3.5 py-2.5 bg-slate-50/60 border border-slate-200 rounded-2xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#5B21B6]/20 focus:border-[#5B21B6] transition-all"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Contact & Address Details */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
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
                className="w-full px-3.5 py-2.5 bg-slate-50/60 border border-slate-200 rounded-2xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#5B21B6]/20 focus:border-[#5B21B6] transition-all"
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
                className="w-full px-3.5 py-2.5 bg-slate-50/60 border border-slate-200 rounded-2xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#5B21B6]/20 focus:border-[#5B21B6] transition-all"
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
                className="w-full px-3.5 py-2.5 bg-slate-50/60 border border-slate-200 rounded-2xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#5B21B6]/20 focus:border-[#5B21B6] transition-all"
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
                className="w-full px-3.5 py-2.5 bg-slate-50/60 border border-slate-200 rounded-2xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#5B21B6]/20 focus:border-[#5B21B6] transition-all"
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
                className="w-full px-3.5 py-2.5 bg-slate-50/60 border border-slate-200 rounded-2xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#5B21B6]/20 focus:border-[#5B21B6] transition-all"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Medical Background & History */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
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
                className="w-full px-3.5 py-2.5 bg-slate-50/60 border border-slate-200 rounded-2xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#5B21B6]/20 focus:border-[#5B21B6] transition-all"
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
                className="w-full p-3.5 bg-slate-50/60 border border-slate-200 rounded-2xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#5B21B6]/20 focus:border-[#5B21B6] transition-all"
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
                className="w-full p-3.5 bg-slate-50/60 border border-slate-200 rounded-2xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#5B21B6]/20 focus:border-[#5B21B6] transition-all"
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
                className="w-full p-3.5 bg-slate-50/60 border border-slate-200 rounded-2xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#5B21B6]/20 focus:border-[#5B21B6] transition-all"
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
                className="w-full p-3.5 bg-slate-50/60 border border-slate-200 rounded-2xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#5B21B6]/20 focus:border-[#5B21B6] transition-all"
              />
            </div>
          </div>
        </div>

        {/* Bottom Save Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] font-semibold text-slate-500">Ensure all medical details are accurate for AI clinical insights.</p>
          <button 
            type="submit"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-[#5B21B6] hover:bg-[#4c1d95] text-white rounded-2xl font-bold text-xs sm:text-sm shadow-md shadow-purple-900/20 transition-all active:scale-95 shrink-0"
          >
            <Save className="w-4 h-4" /> Save Changes
          </button>
        </div>

      </form>
    </div>
  );
}