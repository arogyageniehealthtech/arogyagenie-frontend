import { useState } from "react";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function LogoutButton() {
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {

    localStorage.removeItem("auth_token");
    navigate("/login");
  };

  return (
    <div className="mx-4 md:mx-0">
      <button
        onClick={() => setShowConfirm(true)}
        className="w-full flex items-center justify-center gap-2 p-4 bg-white rounded-xl border border-red-100 shadow-sm text-[#EF4444] hover:bg-red-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EF4444]"
      >
        <LogOut className="w-5 h-5" aria-hidden="true" />
        <span className="text-sm font-semibold">Logout</span>
      </button>

      {showConfirm && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#14152B]/40 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="logout-title"
          onClick={() => setShowConfirm(false)}
        >
          <div 
            className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="logout-title" className="text-xl font-semibold text-[#14152B] mb-2">
              Logout?
            </h2>
            <p className="text-[#64748B] text-sm mb-6">
              Are you sure you want to log out of ArogyaGenie?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-2.5 px-4 rounded-xl font-medium text-[#14152B] bg-slate-100 hover:bg-slate-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B21B6]"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 py-2.5 px-4 rounded-xl font-medium text-white bg-[#EF4444] hover:bg-red-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}