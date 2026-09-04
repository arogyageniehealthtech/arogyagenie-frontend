import { useMedicineRecommendations } from '../../hooks/useMedicines';
import { MedicineCard, MedicineCardSkeleton } from '../card.component/MedicineCard1';

export function MedicineRecommendations() {
  const { data: recommendations, isLoading, isError } = useMedicineRecommendations();

  if (isError || (!isLoading && (!recommendations || recommendations.length === 0))) {
    return null; // Hidden elegantly as per requirements
  }

  return (
    <section className="mt-16 border-t border-slate-200 pt-12 pb-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Recommended for You</h2>
        <p className="text-sm text-slate-500 mt-1">Based on popular products in your area</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <MedicineCardSkeleton key={i} />)
          : recommendations?.slice(0, 4).map((medicine) => (
              <MedicineCard key={medicine.id} medicine={medicine} />
            ))}
      </div>
    </section>
  );
}