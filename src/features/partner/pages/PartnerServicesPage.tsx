
import {
  Stethoscope,
  Clock,
  IndianRupee,
} from 'lucide-react';
import { usePartner } from '../context/PartnerContext';
import { PartnerSkeleton } from '../components/common/PartnerSkeleton';
import { PartnerEmptyState } from '../components/common/PartnerEmptyState';

export const PartnerServicesPage: React.FC = () => {
  const { services, isLoading, toggleService } = usePartner();

  if (isLoading) {
    return <PartnerSkeleton rows={4} />;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
            <Stethoscope className="h-6 w-6 text-indigo-600" />
            Healthcare Services Catalog
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage your facility's active service offerings, pricing, turnaround times, and patient discovery on AarogyaGenie
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100">
            {services.filter((s) => s.isAvailable).length} Active on Platform
          </span>
        </div>
      </div>

      {services.length === 0 ? (
        <PartnerEmptyState
          title="No services configured"
          description="Offerings mapped to your facility will be listed here."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((service) => (
            <div
              key={service.id}
              className={`p-6 rounded-2xl border transition-all bg-white flex flex-col justify-between space-y-4 ${
                service.isAvailable
                  ? 'border-slate-200/90 shadow-2xs hover:border-indigo-200 hover:shadow-md'
                  : 'border-slate-200 bg-slate-50/50 opacity-75'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700">
                    {service.category}
                  </span>
                  
                  {/* Availability Toggle Switch */}
                  <button
                    onClick={() => toggleService(service.id, !service.isAvailable)}
                    className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                      service.isAvailable
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {service.isAvailable ? (
                      <>
                        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        Active
                      </>
                    ) : (
                      'Paused'
                    )}
                  </button>
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {service.name}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">{service.description}</p>
              </div>

              <div className="space-y-3 pt-3 border-t border-slate-100 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                    <Clock className="h-3.5 w-3.5 text-indigo-500" />
                    <span>Turnaround: <strong>{service.turnaroundTime}</strong></span>
                  </div>

                  <span className="text-sm font-extrabold text-slate-900 flex items-center">
                    <IndianRupee className="h-3.5 w-3.5" />
                    {service.price === 0 ? 'Free Service' : service.price.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default PartnerServicesPage;
