import { useParams } from "react-router-dom";
import { VideoConsultationRoom } from "@/components/video/VideoConsultationRoom";

export function PatientVideoConsultationPage() {
  const { appointmentId } = useParams<{ appointmentId: string }>();

  return (
    <VideoConsultationRoom
      appointmentId={appointmentId || "default-apt"}
      userRole="PATIENT"
      onEndCallRedirectPath="/appointment"
    />
  );
}

export default PatientVideoConsultationPage;
