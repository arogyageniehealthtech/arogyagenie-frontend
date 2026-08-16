import { useNavigate } from "react-router-dom";

export function BookAppointmentButton() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/find-doctors")}
      className="w-full bg-purple-700 hover:bg-purple-800 text-white font-medium h-12 rounded-xl mt-4 mb-6 transition-colors shadow-sm active:scale-[0.98]"
    >
      Book New Appointment
    </button>
  );
}