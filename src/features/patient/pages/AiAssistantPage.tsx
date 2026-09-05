import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HealthAssistantChat } from "@/components/health/HealthAssistantChat";
import { ROUTES } from "@/constants/routes.constants";

export default function AiAssistantPage() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "ArogyaGenie AI - Health Assistant";
  }, []);

  const handleClose = () => {
    // If there is history, navigate back, otherwise return to dashboard
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(ROUTES.PATIENT.DASHBOARD);
    }
  };

  return (
    <div className="w-full h-[100dvh] bg-[#060819] flex flex-col overflow-hidden">
      {/* Ambient glowing top border beam */}
      <div className="h-1 w-full bg-linear-to-r from-purple-600 via-indigo-500 to-cyan-400 shrink-0" />
      
      <div className="flex-1 w-full h-full min-h-0 overflow-hidden">
        <HealthAssistantChat
          className="w-full h-full border-0 shadow-none rounded-none"
          onClose={handleClose}
          isFullPage={true}
        />
      </div>
    </div>
  );
}
