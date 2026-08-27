import { ShoppingBag } from 'lucide-react'; 

export default function MedicineOderPage() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Medicine Order</h1>
          <p className="text-sm text-slate-500 mt-1">Order your prescribed medicines</p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors">
          <ShoppingBag className="w-4 h-4" />
          <span>View Cart</span>
        </button>
      </div>
      
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col items-center justify-center min-h-[400px] text-center">
        <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-500 mb-4">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-lg font-semibold text-slate-900 mb-2">Your Medicine Orders</h2>
        <p className="text-sm text-slate-500 max-w-sm mb-6">Search for medicines or upload your prescription to get started.</p>
      </div>
    </div>
  );
}