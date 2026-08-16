// import { useQuery } from "@tanstack/react-query";
// import axios from "../../../lib/axios";
// import type{ BedBookingResponse } from "../types/bed.types";
// import { BED_LABELS } from "../../../constants/bed.constants";

// export default function MyBedBookingsSection () {
//   const { data: responseData, isLoading } = useQuery({
//     queryKey: ["my-bed-bookings"],
//     queryFn: async () => (await axios.get("/api/bed-bookings")).data,
//   });

//   // Safely extract array regardless of whether API returns raw array or wrapped object
//   const bookings: BedBookingResponse[] = Array.isArray(responseData) 
//     ? responseData 
//     : responseData?.data || [];

//   if (isLoading) {
//     return <div className="p-4 text-gray-500">Loading your bed bookings...</div>;
//   }

//   return (
//     <div className="bg-white border border-purple-100 rounded-lg p-5 shadow-sm">
//       <h3 className="text-lg font-bold text-purple-900 mb-4">My Bed Bookings</h3>
      
//       {bookings.length === 0 ? (
//         <p className="text-sm text-gray-500">No active bed bookings found.</p>
//       ) : (
//         <div className="space-y-4">
//           {bookings.map((booking) => (
//             <div key={booking.bookingId} className="border border-purple-50 bg-purple-50/20 p-4 rounded-md">
//               <h4 className="font-bold text-gray-900">Hospital Reference #{booking.hospitalId}</h4>
//               <p className="text-sm text-purple-700 font-medium">{BED_LABELS[booking.bedType]}</p>
//               <p className="text-xs text-gray-500 mt-1">Admission: {booking.admissionDate}</p>
//               <div className="mt-2 text-xs font-semibold text-purple-800 uppercase tracking-wide">
//                 ● {booking.status}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };
import type { BedBookingResponse } from "../types/bed.types";
import { BED_LABELS } from "../../../constants/bed.constants";

// Dummy data for immediate testing
const DUMMY_BOOKINGS: BedBookingResponse[] = [
  {
    bookingId: "book-101",
    hospitalId: "CarePlus Multi-Specialty Hospital",
    bedType: "PRIVATE_ROOM",
    patientName: "John Doe",
    age: 32,
    gender: "Male",
    contactNumber: "9876543210",
    emergencyContact: "9876543211",
    admissionDate: "2026-06-01",
    dischargeDate: "2026-06-04",
    reasonForAdmission: "Post-surgery recovery and monitoring",
    status: "CONFIRMED",
    estimatedCost: 18000,
    createdAt: new Date().toISOString(),
  },
  {
    bookingId: "book-102",
    hospitalId: "City General Hospital",
    bedType: "ICU",
    patientName: "Jane Smith",
    age: 45,
    gender: "Female",
    contactNumber: "9123456789",
    emergencyContact: "9123456788",
    admissionDate: "2026-06-05",
    dischargeDate: "2026-06-10",
    reasonForAdmission: "Critical cardiac observation",
    status: "PENDING",
    estimatedCost: 40000,
    createdAt: new Date().toISOString(),
  },
];

export default function MyBedBookingsSection() {
  const bookings: BedBookingResponse[] = DUMMY_BOOKINGS;

  return (
    <div className="bg-white border border-purple-100 rounded-lg p-5 shadow-sm">
      <h3 className="text-lg font-bold text-purple-900 mb-4">My Bed Bookings</h3>
      
      {bookings.length === 0 ? (
        <p className="text-sm text-gray-500">No active bed bookings found.</p>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking.bookingId} className="border border-purple-100 bg-purple-50/20 p-4 rounded-md">
              <h4 className="font-bold text-gray-900">{booking.hospitalId}</h4>
              <p className="text-sm text-purple-700 font-medium">{BED_LABELS[booking.bedType]}</p>
              <p className="text-xs text-gray-500 mt-1">Admission: {booking.admissionDate}</p>
              <div className="mt-2 text-xs font-semibold text-purple-800 uppercase tracking-wide">
                ● {booking.status}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}