import { useParams } from "react-router-dom";
import { VideoConsultationRoom } from "@/components/video/VideoConsultationRoom";

export function DoctorVideoConsultationPage() {
  const { appointmentId } = useParams<{ appointmentId: string }>();

  return (
    <VideoConsultationRoom
      appointmentId={appointmentId || "default-apt"}
      userRole="DOCTOR"
      onEndCallRedirectPath="/doctor/appointments"
    />
  );
}

export default DoctorVideoConsultationPage;
