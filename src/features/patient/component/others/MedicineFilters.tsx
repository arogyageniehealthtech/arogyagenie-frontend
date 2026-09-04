import { Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '../../../../components/ui/radio-group';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../../../../components/ui/sheet';

interface MedicineFiltersProps {
  filters: { category: string; type: string; prescription: string };
  onChange: (key: string, value: string) => void;
  onClear: () => void;
}

export function MedicineFiltersContent({ filters, onChange, onClear }: MedicineFiltersProps) {
  return (
    <div className="space-y-6 pb-6">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-slate-900">Filters</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onClear} 
          className="text-xs text-blue-600 hover:text-blue-700"
        >
          Clear All
        </Button>
      </div>

      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-slate-700">Prescription</h4>
        <RadioGroup value={filters.prescription} onValueChange={(val) => onChange('prescription', val)}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="all" id="rx-all" />
            <Label htmlFor="rx-all">All</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="true" id="rx-req" />
            <Label htmlFor="rx-req">Required</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="false" id="rx-no" />
            <Label htmlFor="rx-no">Not Required</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-slate-700">Category</h4>
        <RadioGroup value={filters.category} onValueChange={(val) => onChange('category', val)}>
          {['all', 'Pain Relief', 'Cold & Flu', 'Vitamins & Supplements', 'Skin Care', 'Digestive Health'].map((cat) => (
            <div key={cat} className="flex items-center space-x-2">
              <RadioGroupItem value={cat} id={`cat-${cat.replace(/\s+/g, '-').toLowerCase()}`} />
              <Label htmlFor={`cat-${cat.replace(/\s+/g, '-').toLowerCase()}`} className="capitalize">
                {cat === 'all' ? 'All Categories' : cat}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
      
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-slate-700">Type</h4>
        <RadioGroup value={filters.type} onValueChange={(val) => onChange('type', val)}>
          {['all', 'Tablet', 'Capsule', 'Syrup', 'Drops', 'Cream'].map((type) => (
            <div key={type} className="flex items-center space-x-2">
              <RadioGroupItem value={type} id={`type-${type.toLowerCase()}`} />
              <Label htmlFor={`type-${type.toLowerCase()}`} className="capitalize">
                {type === 'all' ? 'All Types' : type}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
}

// Wrapper to handle responsive Mobile Sheet vs Desktop Sidebar
export function MedicineFilters(props: MedicineFiltersProps) {
  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 shrink-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm h-fit sticky top-24">
        <MedicineFiltersContent {...props} />
      </div>

      {/* Mobile/Tablet Sheet */}
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger >
            <Button variant="outline" className="border-slate-200 shadow-sm flex items-center gap-2">
              <Filter className="w-4 h-4" /> Filters
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] overflow-y-auto">
            <SheetHeader className="mb-4 text-left">
              <SheetTitle>Filter Medicines</SheetTitle>
            </SheetHeader>
            <MedicineFiltersContent {...props} />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}