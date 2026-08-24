import { X, ShoppingBag } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: any[];
}

export default function CartDrawer({ isOpen, onClose, items }: CartDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        <div className="p-5 border-b flex justify-between items-center bg-gray-50">
          <h2 className="font-bold text-xl flex items-center gap-2"><ShoppingBag className="w-5 h-5"/> Your Cart</h2>
          <button onClick={onClose} className="p-2 bg-white rounded-full border shadow-sm text-gray-400 hover:text-red-500"><X className="w-4 h-4" /></button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <p className="text-center text-gray-500 mt-10">Your cart is empty.</p>
          ) : (
            items.map(item => (
              <div key={item.id} className="flex justify-between items-center border-b pb-4">
                <div>
                  <p className="font-bold text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
                <p className="font-bold text-purple-700">₹{item.price * item.quantity}</p>
              </div>
            ))
          )}
        </div>

        <div className="p-5 border-t bg-gray-50">
          <button className="w-full py-3.5  text-white rounded-xl font-bold shadow-md bg-[#5B21B6] hover:bg-purple-700 transition-colors">
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}