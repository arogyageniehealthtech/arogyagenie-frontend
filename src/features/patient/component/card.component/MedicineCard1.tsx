import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Pill, ShieldAlert, Plus, Minus, ShoppingCart } from 'lucide-react';
import toast from 'react-hot-toast';

import type { Medicine } from '../../../../types/medicine.type.';
import { addItem, updateQuantity, removeItem, selectCartItemById } from '@/store/slices/cartSlice';
import type { RootState } from '@/store';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export function MedicineCard({ medicine }: { medicine: Medicine }) {
  const dispatch = useDispatch();
  const cartItem = useSelector((state: RootState) => selectCartItemById(medicine.id)(state));
  const [imgError, setImgError] = useState(false);

  const isOutOfStock = medicine.stock <= 0;
  const isLowStock = !isOutOfStock && medicine.stock <= 5;

  const handleAddToCart = () => {
    dispatch(addItem({ medicine, quantity: 1 }));
    toast.success(`${medicine.name} added to cart`);
  };

  const handleQtyChange = (newQty: number) => {
    if (newQty > medicine.stock) {
      toast.error('Maximum stock reached');
      return;
    }
    
    if (newQty <= 0) {
      dispatch(removeItem(medicine.id));
      toast.success('Item removed from cart');
    } else {
      dispatch(updateQuantity({ medicineId: medicine.id, quantity: newQty }));
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="group relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:border-blue-200 hover:shadow-md focus-within:ring-2 focus-within:ring-blue-500"
    >
      {/* Badges */}
      <div className="absolute left-3 top-3 z-10 flex flex-col gap-1.5">
        {medicine.discountPercentage && medicine.discountPercentage > 0 && (
          <Badge className="bg-green-600 text-white hover:bg-green-600 font-bold">
            {medicine.discountPercentage}% OFF
          </Badge>
        )}
        {medicine.prescriptionRequired && (
          <Badge variant="secondary" className="bg-slate-100 text-slate-700 flex items-center gap-1 border-slate-200">
            <ShieldAlert className="w-3 h-3 text-amber-500" /> Rx Req
          </Badge>
        )}
      </div>

      {/* Image */}
      <div className="relative mb-4 flex h-36 w-full items-center justify-center overflow-hidden rounded-xl bg-slate-50">
        {!imgError && medicine.imageUrl ? (
          <img
            src={medicine.imageUrl}
            alt={`Image of ${medicine.name}`}
            className="h-full w-full object-contain mix-blend-multiply transition-transform duration-300 group-hover:scale-105"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <Pill className="h-12 w-12 text-slate-300" />
        )}
      </div>

      {/* Product Info */}
      <div className="flex flex-1 flex-col">
        <h3 className="line-clamp-2 text-sm font-bold text-slate-900" title={medicine.name}>
          {medicine.name}
        </h3>
        <p className="mt-1 text-xs text-slate-500">
          <span className="font-semibold text-slate-700">{medicine.brandName}</span>
          {medicine.packSize && ` • ${medicine.packSize}`}
        </p>

        {medicine.genericName && (
          <p className="mt-1 line-clamp-1 text-xs text-slate-400">
            Generic: {medicine.genericName}
          </p>
        )}

        <div className="mt-4 flex items-end gap-2">
          <span className="text-lg font-black text-slate-900">₹{medicine.price}</span>
          {medicine.mrp && medicine.mrp > medicine.price && (
            <span className="mb-0.5 text-xs text-slate-400 line-through">₹{medicine.mrp}</span>
          )}
        </div>
        
        {isLowStock && (
          <p className="mt-1 text-xs font-semibold text-amber-600">Only {medicine.stock} left!</p>
        )}
      </div>

      {/* Actions */}
      <div className="mt-4 border-t border-slate-100 pt-4">
        {isOutOfStock ? (
          <div className="w-full rounded-lg bg-slate-100 py-2 text-center text-xs font-bold text-slate-500">
            Out of Stock
          </div>
        ) : cartItem ? (
          <div className="flex items-center justify-between rounded-lg border border-blue-600 bg-blue-50 p-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-blue-700 hover:bg-blue-100 hover:text-blue-800"
              onClick={() => handleQtyChange(cartItem.quantity - 1)}
              aria-label="Decrease quantity"
            >
              <Minus className="h-3.5 w-3.5" />
            </Button>
            <span className="text-xs font-bold text-blue-900 w-8 text-center" aria-live="polite">
              {cartItem.quantity}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-blue-700 hover:bg-blue-100 hover:text-blue-800"
              disabled={cartItem.quantity >= medicine.stock}
              onClick={() => handleQtyChange(cartItem.quantity + 1)}
              aria-label="Increase quantity"
            >
              <Plus className="h-3.5 w-3.5" />
            </Button>
          </div>
        ) : (
          <Button 
            className="w-full bg-blue-600 text-white hover:bg-blue-700 font-semibold"
            onClick={handleAddToCart}
            aria-label={`Add ${medicine.name} to cart`}
          >
            <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
          </Button>
        )}
      </div>
    </motion.div>
  );
}

// Skeleton Component
export function MedicineCardSkeleton() {
  return (
    <div className="flex h-[360px] w-full flex-col justify-between rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
      <div className="h-36 w-full animate-pulse rounded-xl bg-slate-100 mb-4" />
      <div className="flex-1 space-y-3">
        <div className="h-4 w-3/4 animate-pulse rounded-md bg-slate-100" />
        <div className="h-3 w-1/2 animate-pulse rounded-md bg-slate-100" />
        <div className="h-3 w-full animate-pulse rounded-md bg-slate-100" />
      </div>
      <div className="mt-4 h-9 w-full animate-pulse rounded-lg bg-slate-100" />
    </div>
  );
}