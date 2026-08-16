import React from "react";
import { ArrowLeft, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface HospitalHeroProps {
  image: string;
  name: string;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export const HospitalHero: React.FC<HospitalHeroProps> = ({
  image,
  name,
  isFavorite,
  onToggleFavorite,
}) => {
  const navigate = useNavigate();

  return (
    <div className="relative w-full h-52 md:h-72 overflow-hidden rounded-b-3xl bg-gray-900 shadow-sm">
      <img
        src={image}
        alt={`${name} building`}
        className="w-full h-full object-cover opacity-95"
      />
      
      {/* Top Floating Actions */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
        <button
          onClick={() => navigate(-1)}
          aria-label="Go back"
          className="w-10 h-10 rounded-full bg-purple-950/60 backdrop-blur-md flex items-center justify-center text-white transition hover:bg-purple-950/80 focus:outline-none focus:ring-2 focus:ring-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <button
          onClick={onToggleFavorite}
          aria-label={isFavorite ? "Remove hospital from favorites" : "Add hospital to favorites"}
          className="w-10 h-10 rounded-full bg-purple-950/60 backdrop-blur-md flex items-center justify-center text-white transition hover:bg-purple-950/80 focus:outline-none focus:ring-2 focus:ring-white"
        >
          <Heart className={`w-5 h-5 ${isFavorite ? "fill-red-500 text-red-500" : "text-white"}`} />
        </button>
      </div>
    </div>
  );
};