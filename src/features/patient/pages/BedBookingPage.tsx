import  { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { BedBookingForm } from "../components/bed.component/BedBookingForm";
import { BedBookingSummary } from "../components/bed.component/BedBookingSummary";
import type { BedBookingPayload, BedType } from "../types/bed.types";

export default function BedBookingPage() {
  const { hospitalId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { bedType?: BedType; pricePerDay?: number; hospitalName?: string } | null;
  const bedType = state?.bedType || "PRIVATE_ROOM";
  const pricePerDay = state?.pricePerDay || 6000;
  const hospitalName = state?.hospitalName || "CarePlus Multi-Specialty Hospital";

  const [bookingPayload, setBookingPayload] = useState<BedBookingPayload | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFormSubmit = (formData: Partial<BedBookingPayload>) => {
    setBookingPayload({
      hospitalId: hospitalId || "careplus",
      bedType,
      patientName: formData.patientName || "",
      age: formData.age || 0,
      gender: formData.gender || "Male",
      contactNumber: formData.contactNumber || "",
      emergencyContact: formData.emergencyContact || "",
      admissionDate: formData.admissionDate || "",
      dischargeDate: formData.dischargeDate || "",
      reasonForAdmission: formData.reasonForAdmission || "",
      doctorId: formData.doctorId,
      department: formData.department,
      existingAppointmentId: formData.existingAppointmentId,
    });
  };

  const handleConfirmBooking = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert("Bed booking request submitted successfully!");
      navigate("/dashboard"); 
    }, 1000);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div>
        <button 
          onClick={() => navigate(-1)} 
          className="text-sm text-purple-700 font-medium hover:underline mb-2 inline-block"
        >
          ← Back
        </button>
        <h1 className="text-2xl font-bold text-purple-900">
          {bookingPayload ? "Confirm Bed Booking" : "Patient Admission Details"}
        </h1>
        <p className="text-sm text-gray-500">Hospital: {hospitalName}</p>
      </div>

      {!bookingPayload ? (
        <BedBookingForm 
          hospitalId={hospitalId || "careplus"} 
          bedType={bedType} 
          onSubmit={handleFormSubmit} 
        />
      ) : (
        <BedBookingSummary 
          payload={bookingPayload}
          pricePerDay={pricePerDay}
          hospitalName={hospitalName}
          onConfirm={handleConfirmBooking}
          onCancel={() => setBookingPayload(null)}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}