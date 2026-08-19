import React, { useState } from 'react';
import {
  ShoppingBag,
  Truck,
  Store,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Eye,
  Check,
  ChevronRight,
  IndianRupee,
} from 'lucide-react';
import { usePartner } from '../context/PartnerContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { PartnerEmptyState } from '../components/common/PartnerEmptyState';
import { PartnerSkeleton } from '../components/common/PartnerSkeleton';
import { Button } from '@/components/ui/button';
import type { PharmacyOrder, PartnerRequestStatus } from '@/types/partner.types';

export const PharmacyOrdersPage: React.FC = () => {
  const { orders, isLoading, updateOrderStatus } = usePartner();
  const [selectedOrder, setSelectedOrder] = useState<PharmacyOrder | null>(null);

  if (isLoading) {
    return <PartnerSkeleton rows={5} />;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
            <ShoppingBag className="h-6 w-6 text-indigo-600" />
            Pharmacy Medicine Orders
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Prescription fulfillment, express home delivery, and store pickup counter workflow
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-100">
            Total Orders: {orders.length}
          </span>
        </div>
      </div>

      {orders.length === 0 ? (
        <PartnerEmptyState
          title="No medicine orders found"
          description="Orders submitted by patients on the AarogyaGenie app will display here."
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Orders List (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {orders.map((order) => {
              const isSelected = selectedOrder?.id === order.id;

              return (
                <div
                  key={order.id}
                  onClick={() => setSelectedOrder(order)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer bg-white ${
                    isSelected
                      ? 'border-indigo-500 shadow-md ring-2 ring-indigo-500/10'
                      : 'border-slate-200/90 shadow-2xs hover:border-slate-300 hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                          {order.orderNumber}
                        </span>
                        <StatusBadge status={order.orderStatus} size="sm" />
                      </div>
                      <h3 className="text-base font-bold text-slate-900">{order.patient.name}</h3>
                      <p className="text-xs text-slate-500">{order.patient.phone}</p>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-extrabold text-slate-900 block">
                        ₹{order.totalAmount.toLocaleString()}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {order.paymentStatus}
                      </span>
                    </div>
                  </div>

                  {/* Order Mode & Items Summary */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 font-medium text-slate-600">
                      {order.fulfillmentType === 'HOME_DELIVERY' ? (
                        <>
                          <Truck className="h-4 w-4 text-emerald-600" />
                          <span>Express Delivery</span>
                        </>
                      ) : (
                        <>
                          <Store className="h-4 w-4 text-indigo-600" />
                          <span>Store Pickup Counter</span>
                        </>
                      )}
                    </div>

                    <span className="text-slate-500 font-medium">
                      {order.items.length} medicine item{order.items.length > 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Order Inspector (5 cols) */}
          <div className="lg:col-span-5">
            {selectedOrder ? (
              <div className="sticky top-28 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-xs font-mono font-bold text-indigo-600">
                      {selectedOrder.orderNumber}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                      {selectedOrder.patient.name}
                    </h3>
                  </div>
                  <StatusBadge status={selectedOrder.orderStatus} />
                </div>

                {/* Delivery details */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs text-slate-700">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    {selectedOrder.fulfillmentType === 'HOME_DELIVERY' ? (
                      <Truck className="h-4 w-4 text-emerald-600" />
                    ) : (
                      <Store className="h-4 w-4 text-indigo-600" />
                    )}
                    Fulfillment Destination
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    {selectedOrder.deliveryAddress || 'Self pickup at counter'}
                  </p>
                  {selectedOrder.riderName && (
                    <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                      <span>Rider: <strong>{selectedOrder.riderName}</strong></span>
                      <span className="text-slate-500">{selectedOrder.riderPhone}</span>
                    </div>
                  )}
                </div>

                {/* Itemized Medicines */}
                <div className="space-y-2.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Medicines to Package ({selectedOrder.items.length})
                  </h4>
                  <div className="rounded-xl border border-slate-200 divide-y divide-slate-100 text-xs">
                    {selectedOrder.items.map((item) => (
                      <div key={item.id} className="p-3 flex items-start justify-between">
                        <div>
                          <span className="font-bold text-slate-900 block">{item.medicineName}</span>
                          <span className="text-[11px] text-slate-500">{item.dosage}</span>
                          {item.instruction && (
                            <span className="text-[10px] text-indigo-600 block mt-0.5 italic">
                              "{item.instruction}"
                            </span>
                          )}
                        </div>
                        <div className="text-right">
                          <span className="font-semibold text-slate-800">x{item.quantity}</span>
                          <span className="block font-bold text-slate-900">₹{item.totalPrice}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 flex items-center justify-between font-bold text-sm text-slate-900">
                    <span>Total Amount Payable:</span>
                    <span className="text-emerald-700">₹{selectedOrder.totalAmount}</span>
                  </div>
                </div>

                {/* Order Status Action Controls */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Update Fulfillment Status
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateOrderStatus(selectedOrder.id, 'IN_PROGRESS')}
                      className={`rounded-xl text-xs font-bold ${
                        selectedOrder.orderStatus === 'IN_PROGRESS'
                          ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                          : ''
                      }`}
                    >
                      Packaging
                    </Button>

                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => updateOrderStatus(selectedOrder.id, 'COMPLETED')}
                      className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-bold"
                    >
                      Delivered / Picked up
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 p-12 text-center text-slate-400 bg-white">
                <ShoppingBag className="h-10 w-10 mx-auto mb-2 opacity-50" />
                <p className="text-xs font-medium">Select an order on the left to inspect itemized packaging details</p>
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
};

export default PharmacyOrdersPage;
