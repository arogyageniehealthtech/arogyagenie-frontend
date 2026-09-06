import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HealthAssistantChat } from "@/components/health/HealthAssistantChat";
import { ROUTES } from "@/constants/routes.constants";

export default function AiAssistantPage() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "ArogyaGenie AI - Health Assistant";

    const prevBodyBg = document.body.style.backgroundColor;
    const prevHtmlBg = document.documentElement.style.backgroundColor;
    const prevBodyOverscroll = document.body.style.overscrollBehavior;
    const prevHtmlOverscroll = document.documentElement.style.overscrollBehavior;

    // Lock html and body background to eliminate white canvas flashes on mobile resize
    document.body.style.backgroundColor = "#060819";
    document.documentElement.style.backgroundColor = "#060819";
    document.body.style.overscrollBehavior = "none";
    document.documentElement.style.overscrollBehavior = "none";

    return () => {
      document.body.style.backgroundColor = prevBodyBg;
      document.documentElement.style.backgroundColor = prevHtmlBg;
      document.body.style.overscrollBehavior = prevBodyOverscroll;
      document.documentElement.style.overscrollBehavior = prevHtmlOverscroll;
    };
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
    <div className="w-full h-full flex-1 flex flex-col overflow-hidden bg-[#060819] select-none">
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
