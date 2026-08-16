import { Link } from "react-router";
import { Siren } from "lucide-react";
import { ROUTES } from "../../constants/routes.constants";

export function EmergencyButton() {
  return (
    <Link
      to={ROUTES.PATIENT.EMERGENCY}
      aria-label="Emergency — request help now"
      className="fixed bottom-24 right-4 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-(--color-danger) text-white shadow-(--shadow-floating) transition-transform hover:scale-105 active:scale-95 lg:bottom-8 lg:right-8"
    >
      <Siren className="h-6 w-6" aria-hidden="true" />
    </Link>
  );
}