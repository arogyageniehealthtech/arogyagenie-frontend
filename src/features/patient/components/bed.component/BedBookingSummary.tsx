import React from "react";
import type { BedBookingPayload } from "../../types/bed.types";
import { BED_LABELS } from "../../../../constants/bed.constants";

interface Props {
  payload: BedBookingPayload;
  pricePerDay: number;
  hospitalName: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading: boolean;
}

export const BedBookingSummary: React.FC<Props> = ({
  payload,
  pricePerDay,
  hospitalName,
  onConfirm,
  onCancel,
  isLoading,
}) => {
  const start = new Date(payload.admissionDate);
  const end = new Date(payload.dischargeDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const durationDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
  const estimatedAmount = durationDays * pricePerDay;

  return (
    <div className="bg-white p-6 rounded-lg border border-purple-100 shadow-sm space-y-4">
      <h3 className="text-lg font-bold text-purple-900 border-b pb-2">Confirm Bed Booking</h3>
      
      <div className="space-y-3 text-sm text-gray-700">
        <div className="flex justify-between">
          <span className="font-medium text-gray-500">Hospital:</span>
          <span className="font-semibold text-purple-900">{hospitalName}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium text-gray-500">Bed Type:</span>
          <span className="font-semibold">{BED_LABELS[payload.bedType]}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium text-gray-500">Admission:</span>
          <span>{payload.admissionDate}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium text-gray-500">Expected Discharge:</span>
          <span>{payload.dischargeDate}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium text-gray-500">Expected duration:</span>
          <span>{durationDays} days</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium text-gray-500">Price per day:</span>
          <span>₹{pricePerDay.toLocaleString()}</span>
        </div>
        <div className="flex justify-between border-t pt-3 text-base">
          <span className="font-bold text-gray-900">Estimated cost:</span>
          <span className="font-extrabold text-purple-700">₹{estimatedAmount.toLocaleString()}</span>
        </div>
      </div>

      <div className="bg-purple-50 text-purple-700 text-xs p-3 rounded">
        IMPORTANT: Clearly label this as an <strong>Estimated Cost</strong>. The final hospital bill may differ.
      </div>

      <div className="flex gap-4 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="w-1/2 border border-gray-300 py-2 rounded-md font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="button"
          disabled={isLoading}
          onClick={onConfirm}
          className="w-1/2 bg-purple-700 text-white py-2 rounded-md font-semibold hover:bg-purple-800 transition disabled:bg-purple-300"
        >
          {isLoading ? "Processing..." : "Confirm Booking"}
        </button>
      </div>
    </div>
  );
};