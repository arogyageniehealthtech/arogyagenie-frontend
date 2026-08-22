import type { Provider } from '../types/healthcare';
import { ProviderCard } from './ProviderCard';

interface Props {
  providers: Provider[];
  onGetDirections: (provider: Provider) => void;
  // NEW: Add the booking handler prop
  onBookAppointment: (provider: Provider) => void;
}

export function ProviderList({ providers, onGetDirections, onBookAppointment }: Props) {
  return (
    <div className="w-full lg:w-[42%] flex flex-col gap-4 max-h-[400px] md:max-h-[500px] lg:max-h-[700px] overflow-y-auto pr-2 custom-scrollbar">
      {providers.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center text-gray-500 shrink-0">
          No providers found matching your criteria. Try expanding your search radius.
        </div>
      ) : (
        providers.map(provider => (
          <div key={provider.id} className="shrink-0">
            <ProviderCard 
              provider={provider} 
              onGetDirections={onGetDirections}
              onBookAppointment={onBookAppointment} // NEW: Pass it down
            />
          </div>
        ))
      )}
    </div>
  );
}