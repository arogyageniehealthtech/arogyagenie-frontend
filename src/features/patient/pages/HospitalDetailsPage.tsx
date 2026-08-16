import { useParams } from "react-router-dom";
import { Star, MapPin, BadgeCheck } from "lucide-react";
import { useHospital, useHospitalFavorite } from "../hooks/useHospital";
import { HospitalHero } from "../components/Hospital.component/HospitalHero";
import { HospitalStats } from "../components/Hospital.component/HospitalStats";
import { BedAvailability } from "../components/bed.component/BedAvailability";
import { HospitalServices } from "../components/Hospital.component/HospitalServices";
import { HospitalActions } from "../components/Hospital.component/HospitalActions";
import { HospitalDetailsSkeleton } from "../components/Hospital.component/HospitalDetailsSkeleton";
import { HospitalDetailsError } from "../components/Hospital.component/HospitalDetailsError";



export default function HospitalDetailsPage() {
  const { hospitalId } = useParams<{ hospitalId: string }>();
  const { data: hospital, isLoading, isError, refetch } = useHospital(hospitalId || "");
  const { mutate: toggleFavorite } = useHospitalFavorite(hospitalId || "");
  if (isLoading) {
    return <HospitalDetailsSkeleton />;
  }
  if (isError || !hospital) {
    return (
      <div className="max-w-xl md:max-w-4xl mx-auto min-h-screen bg-[#F8FAFC]">
        <HospitalDetailsError onRetry={() => refetch()} />
      </div>
    );
  }
  return (

    <div className="min-h-screen bg-[#F8FAFC] pb-28">
      <div className="max-w-xl md:max-w-4xl mx-auto bg-white min-h-screen shadow-xs">
        <HospitalHero
          image={hospital.image}
          name={hospital.name}
          isFavorite={hospital.isFavorite}
          onToggleFavorite={() => toggleFavorite()}
        />
        <div className="p-5 md:p-8 space-y-2">
          <div className="flex items-center justify-between">
            <h1 className="text-xl md:text-2xl font-bold text-[#14152B]">
              {hospital.name}
            </h1>
            {hospital.isVerified && (
              <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-green-50 text-green-700 border border-green-200">
                <BadgeCheck className="w-3.5 h-3.5" />
                Verified
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 text-sm text-[#64748B] pt-1">
            <div className="flex items-center gap-1 text-amber-500 font-bold">
              <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
              <span>{hospital.rating.toFixed(1)}</span>
              <span className="text-[#64748B] font-normal">({hospital.reviewCount} reviews)</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4 text-purple-700" />
              <span>{hospital.distanceKm.toFixed(1)} km away</span>
            </div>
          </div>
          <HospitalStats
            icuBeds={hospital.icuBedsAvailable}
            generalBeds={hospital.generalBedsAvailable}
            specialistCount={hospital.specialistCount}
          />
          <BedAvailability
            hospitalId={hospital.id}
            icuBeds={hospital.icuBedsAvailable}
            generalBeds={hospital.generalBedsAvailable}
            privateRooms={hospital.privateRoomsAvailable}
          />
          <HospitalServices services={hospital.services} />

        </div>
        <HospitalActions
          hospitalId={hospital.id}
          phoneNumber={hospital.phoneNumber}
          latitude={hospital.latitude}
          longitude={hospital.longitude}
        />
      </div>
    </div>
  );
}