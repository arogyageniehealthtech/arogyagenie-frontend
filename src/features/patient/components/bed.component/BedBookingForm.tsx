import React, { useState } from "react";
import type { BedBookingPayload, BedType } from "../../types/bed.types";

interface Props {
  hospitalId: string;
  bedType: BedType;
  onSubmit: (data: Partial<BedBookingPayload>) => void;
}

export const BedBookingForm: React.FC<Props> = ({ hospitalId, bedType, onSubmit }) => {
  const [form, setForm] = useState({
    patientName: "",
    age: "",
    gender: "Male",
    contactNumber: "",
    emergencyContact: "",
    admissionDate: "",
    dischargeDate: "",
    reasonForAdmission: "",
    doctorId: "",
    department: "",
    existingAppointmentId: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (new Date(form.dischargeDate) < new Date(form.admissionDate)) {
      setError("Discharge date cannot be earlier than admission date.");
      return;
    }
    setError("");
    onSubmit({
      ...form,
      age: Number(form.age),
      hospitalId,
      bedType,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg border border-purple-100 shadow-sm">
      {error && <div className="p-3 bg-red-50 text-red-700 text-sm rounded border border-red-200">{error}</div>}
      
      <div>
        <h3 className="text-md font-bold text-purple-900 border-b pb-2 mb-4">Patient Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Patient Name</label>
            <input required type="text" name="patientName" value={form.patientName} onChange={handleChange} className="w-full border rounded-md p-2 focus:ring-purple-500 focus:border-purple-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
            <input required type="number" name="age" value={form.age} onChange={handleChange} className="w-full border rounded-md p-2 focus:ring-purple-500 focus:border-purple-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
            <select name="gender" value={form.gender} onChange={handleChange} className="w-full border rounded-md p-2 focus:ring-purple-500 focus:border-purple-500">
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
            <input required type="tel" name="contactNumber" value={form.contactNumber} onChange={handleChange} className="w-full border rounded-md p-2 focus:ring-purple-500 focus:border-purple-500" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact</label>
            <input required type="tel" name="emergencyContact" value={form.emergencyContact} onChange={handleChange} className="w-full border rounded-md p-2 focus:ring-purple-500 focus:border-purple-500" />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-md font-bold text-purple-900 border-b pb-2 mb-4">Admission Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Admission Date</label>
            <input required type="date" min={new Date().toISOString().split("T")[0]} name="admissionDate" value={form.admissionDate} onChange={handleChange} className="w-full border rounded-md p-2 focus:ring-purple-500 focus:border-purple-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Expected Discharge Date</label>
            <input required type="date" min={form.admissionDate || new Date().toISOString().split("T")[0]} name="dischargeDate" value={form.dischargeDate} onChange={handleChange} className="w-full border rounded-md p-2 focus:ring-purple-500 focus:border-purple-500" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Admission</label>
            <textarea required name="reasonForAdmission" rows={3} value={form.reasonForAdmission} onChange={handleChange} className="w-full border rounded-md p-2 focus:ring-purple-500 focus:border-purple-500" />
          </div>
        </div>
      </div>

      <button type="submit" className="w-full bg-purple-700 text-white py-3 rounded-md font-semibold hover:bg-purple-800 transition">
        Proceed to Summary
      </button>
    </form>
  );
};