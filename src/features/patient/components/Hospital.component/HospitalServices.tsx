import React from "react";
import type{ HospitalService } from "../../types/hospital.types";
import { HospitalServiceItem } from "./HospitalServiceItem";

interface HospitalServicesProps {
  services: HospitalService[];
}

export const HospitalServices: React.FC<HospitalServicesProps> = ({ services }) => {
  return (
    <div className="my-6 space-y-3">
      <h3 className="text-base font-bold text-[#14152B]">Hospital Services</h3>
      <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
        {services.map((service) => (
          <HospitalServiceItem
            key={service.id}
            type={service.type}
            name={service.name}
            isAvailable={service.isAvailable}
          />
        ))}
      </div>
    </div>
  );
};