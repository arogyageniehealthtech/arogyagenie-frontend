import React, { useState, useMemo } from 'react';
import {
  PackageSearch,
  Search,
  AlertTriangle,
  Plus,
  Minus,
  CheckCircle2,
  Calendar,
  Layers,
  Edit2,
} from 'lucide-react';
import { usePartner } from '../context/PartnerContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { PartnerSkeleton } from '../components/common/PartnerSkeleton';
import { PartnerEmptyState } from '../components/common/PartnerEmptyState';
import { Button } from '@/components/ui/button';
import type { InventoryItem } from '@/types/partner.types';

export const PharmacyInventoryPage: React.FC = () => {
  const { inventory, isLoading, updateInventoryStock } = usePartner();
  const [search, setSearch] = useState<string>('');
  const [category, setCategory] = useState<string>('ALL');
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [newStockVal, setNewStockVal] = useState<number>(0);

  const categories = useMemo(() => {
    const set = new Set(inventory.map((i) => i.category));
    return ['ALL', ...Array.from(set)];
  }, [inventory]);

  const filteredInventory = useMemo(() => {
    return inventory.filter((item) => {
      if (category !== 'ALL' && item.category !== category) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        if (
          !item.name.toLowerCase().includes(q) &&
          !item.genericName.toLowerCase().includes(q) &&
          !item.batchNumber.toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [inventory, category, search]);

  const lowStockItems = inventory.filter(
    (i) => i.status === 'LOW_STOCK' || i.status === 'OUT_OF_STOCK'
  );

  const handleOpenEdit = (item: InventoryItem) => {
    setEditingItem(item);
    setNewStockVal(item.stock);
  };

  const handleSaveStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      await updateInventoryStock(editingItem.id, Number(newStockVal));
      setEditingItem(null);
    }
  };

  if (isLoading) {
    return <PartnerSkeleton rows={6} />;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
            <PackageSearch className="h-6 w-6 text-emerald-600" />
            Medicine Inventory & Stock Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real-time stock quantities, batch tracking, expiry monitoring, and low-stock alerts
          </p>
        </div>

        <div className="flex items-center gap-2">
          {lowStockItems.length > 0 && (
            <span className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl bg-orange-50 text-orange-800 border border-orange-200">
              <AlertTriangle className="h-4 w-4 text-orange-600 animate-pulse" />
              {lowStockItems.length} items low stock
            </span>
          )}
        </div>
      </div>

      {/* Filter bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
        <div className="relative sm:col-span-8">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search medicine by brand name, active molecule, or batch #..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-4 py-2.5 text-xs font-medium text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
          />
        </div>

        <div className="sm:col-span-4">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-slate-700 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100 cursor-pointer"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c === 'ALL' ? 'All Drug Categories' : c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Inventory Table */}
      {filteredInventory.length === 0 ? (
        <PartnerEmptyState
          title="No medicine inventory records found"
          description="Try clearing your search query."
        />
      ) : (
        <div className="rounded-2xl border border-slate-200/90 bg-white shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/90 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Medicine Name & Generic Composition</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Batch # & Expiry</th>
                  <th className="py-3.5 px-4">Unit Price</th>
                  <th className="py-3.5 px-4">Stock Level</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Quick Stock Adjust</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredInventory.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-900 block">{item.name}</span>
                      <span className="text-[11px] text-slate-500">{item.genericName}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium text-[10px]">
                        {item.category}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-mono text-slate-700 font-semibold block">{item.batchNumber}</span>
                      <span className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <Calendar className="h-3 w-3 text-slate-400" />
                        Exp: {item.expiryDate}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      ₹{item.unitPrice} / unit
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="space-y-1">
                        <span className="text-sm font-extrabold text-slate-900">
                          {item.stock} <span className="text-[11px] font-normal text-slate-500">{item.unit}</span>
                        </span>
                        <span className="text-[10px] text-slate-400 block">Min Threshold: {item.minThreshold}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <StatusBadge status={item.status} size="sm" />
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => updateInventoryStock(item.id, Math.max(0, item.stock - 5))}
                          title="Reduce 5 units"
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => updateInventoryStock(item.id, item.stock + 10)}
                          title="Add 10 units"
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(item)}
                          title="Manual Edit Stock"
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-xs flex items-center gap-1 transition-colors"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                          Set
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Stock Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setEditingItem(null)}
          />
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 z-10 space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Adjust Stock: {editingItem.name}
            </h3>
            <p className="text-xs text-slate-500">
              Batch: {editingItem.batchNumber} • Category: {editingItem.category}
            </p>

            <form onSubmit={handleSaveStock} className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  New Quantity ({editingItem.unit})
                </label>
                <input
                  type="number"
                  min="0"
                  value={newStockVal}
                  onChange={(e) => setNewStockVal(parseInt(e.target.value) || 0)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-sm font-bold text-slate-900 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" type="button" onClick={() => setEditingItem(null)}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit" className="bg-emerald-600 hover:bg-emerald-700">
                  Update Stock Count
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default PharmacyInventoryPage;
