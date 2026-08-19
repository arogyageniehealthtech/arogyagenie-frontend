import React, { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RejectRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => Promise<void>;
  requestNumber: string;
  patientName: string;
}

const PRESET_REASONS = [
  'Item / Medicine currently out of stock with distributor delay',
  'Required diagnostic reagent / equipment undergoing calibration',
  'Specialist doctor on emergency call / unavailable during requested slot',
  'Requested address falls outside express delivery radius',
  'Duplicate request created by patient',
  'Other operational constraint',
];

export const RejectRequestModal: React.FC<RejectRequestModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  requestNumber,
  patientName,
}) => {
  const [selectedReason, setSelectedReason] = useState<string>(PRESET_REASONS[0]);
  const [customReason, setCustomReason] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalReason = selectedReason.includes('Other') && customReason.trim()
      ? customReason.trim()
      : selectedReason;

    setIsSubmitting(true);
    try {
      await onConfirm(finalReason);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Dialog box */}
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 z-10 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600 border border-rose-100">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Decline Request</h3>
              <p className="text-xs text-slate-500">
                #{requestNumber} • Patient: {patientName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Select Reason for Declining
            </label>
            <div className="space-y-2">
              {PRESET_REASONS.map((reason) => (
                <label
                  key={reason}
                  className={`flex items-center gap-3 p-3 rounded-xl border text-sm cursor-pointer transition-all ${
                    selectedReason === reason
                      ? 'border-rose-300 bg-rose-50/50 text-slate-900 font-medium ring-1 ring-rose-200'
                      : 'border-slate-200 bg-slate-50/40 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="rejectionReason"
                    checked={selectedReason === reason}
                    onChange={() => setSelectedReason(reason)}
                    className="accent-rose-600"
                  />
                  <span className="text-xs sm:text-sm">{reason}</span>
                </label>
              ))}
            </div>
          </div>

          {selectedReason.includes('Other') && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Custom Explanation
              </label>
              <textarea
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="Explain why this request cannot be fulfilled..."
                rows={3}
                required
                className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-200"
              />
            </div>
          )}

          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/80 text-xs text-amber-800">
            <strong>Platform Note:</strong> Declining will automatically notify the AarogyaGenie
            platform to reroute this request to another nearby verified partner without disrupting
            the patient experience.
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="destructive"
              isLoading={isSubmitting}
              className="rounded-xl bg-rose-600 hover:bg-rose-700"
            >
              Confirm Decline
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
