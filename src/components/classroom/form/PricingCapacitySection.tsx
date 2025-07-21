
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PricingCapacityFormData {
  price: number;
  capacity: number;
}

interface PricingCapacitySectionProps {
  formData: PricingCapacityFormData;
  errors: Record<string, string>;
  onUpdateFormData: (updates: Partial<PricingCapacityFormData>) => void;
}

const PricingCapacitySection = ({ formData, errors, onUpdateFormData }: PricingCapacitySectionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-purple-300 border-b border-white/10 pb-2">
        Pricing & Capacity
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="price" className="text-white">
            Price per Session ($) <span className="text-red-400">*</span>
          </Label>
          <Input
            id="price"
            type="number"
            value={formData.price}
            onChange={(e) => onUpdateFormData({ price: parseInt(e.target.value) || 0 })}
            placeholder="25"
            className={`bg-white/10 border-white/20 text-white ${
              errors.price ? 'border-red-500' : ''
            }`}
            min="0"
          />
          {errors.price && <p className="text-red-400 text-sm mt-1">{errors.price}</p>}
        </div>

        <div>
          <Label htmlFor="capacity" className="text-white">
            Maximum Students <span className="text-red-400">*</span>
          </Label>
          <Input
            id="capacity"
            type="number"
            value={formData.capacity}
            onChange={(e) => onUpdateFormData({ capacity: parseInt(e.target.value) || 20 })}
            placeholder="20"
            className={`bg-white/10 border-white/20 text-white ${
              errors.capacity ? 'border-red-500' : ''
            }`}
            min="1"
            max="100"
          />
          {errors.capacity && <p className="text-red-400 text-sm mt-1">{errors.capacity}</p>}
        </div>
      </div>
    </div>
  );
};

export default PricingCapacitySection;
