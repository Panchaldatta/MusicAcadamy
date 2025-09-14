
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Star, Users, DollarSign, Clock } from "lucide-react";

interface PricingCapacityFormData {
  price: number;
  capacity: number;
}

interface PricingCapacitySectionProps {
  formData: PricingCapacityFormData;
  errors: Record<string, string>;
  onUpdateFormData: (updates: Partial<PricingCapacityFormData>) => void;
}

interface PricingPackage {
  id: string;
  name: string;
  price: number;
  duration: string;
  features: string[];
  badge?: string;
  popular?: boolean;
  icon: typeof DollarSign;
  color: string;
}

const pricingPackages: PricingPackage[] = [
  {
    id: "starter",
    name: "Starter Package",
    price: 299,
    duration: "per hour",
    features: ["Basic lessons", "Individual attention", "Progress tracking"],
    icon: DollarSign,
    color: "from-green-500 to-emerald-500"
  },
  {
    id: "standard",
    name: "Standard Package", 
    price: 399,
    duration: "per hour",
    features: ["Comprehensive lessons", "Practice materials", "Performance feedback", "Homework assignments"],
    badge: "Popular",
    popular: true,
    icon: Star,
    color: "from-blue-500 to-indigo-500"
  },
  {
    id: "premium",
    name: "Premium Package",
    price: 599,
    duration: "per hour", 
    features: ["Advanced techniques", "Personalized curriculum", "Recording sessions", "Performance preparation", "Career guidance"],
    badge: "Best Value",
    icon: Crown,
    color: "from-purple-500 to-pink-500"
  },
  {
    id: "masterclass",
    name: "Master Class",
    price: 899,
    duration: "per hour",
    features: ["Expert-level training", "Industry secrets", "One-on-one mentoring", "Portfolio building", "Network access", "Lifetime support"],
    badge: "Elite",
    icon: Crown,
    color: "from-orange-500 to-red-500"
  }
];

const PricingCapacitySection = ({ formData, errors, onUpdateFormData }: PricingCapacitySectionProps) => {
  const selectedPackage = pricingPackages.find(pkg => pkg.price === formData.price);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg">
          <DollarSign className="h-5 w-5 text-white" />
        </div>
        <h3 className="text-xl font-bold text-white">
          Pricing & Capacity
        </h3>
      </div>
      
      {/* Pricing Packages */}
      <div className="space-y-4">
        <Label className="text-white text-base font-medium">
          Choose a Pricing Package <span className="text-red-400">*</span>
        </Label>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {pricingPackages.map((pkg) => (
            <Card 
              key={pkg.id}
              className={`relative cursor-pointer transition-all duration-300 border-2 ${
                formData.price === pkg.price
                  ? 'border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/25'
                  : 'border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10'
              }`}
              onClick={() => onUpdateFormData({ price: pkg.price })}
            >
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1">
                    {pkg.badge}
                  </Badge>
                </div>
              )}
              
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${pkg.color}`}>
                      <pkg.icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white text-lg">{pkg.name}</h4>
                      <p className="text-gray-400 text-sm">{pkg.badge && `${pkg.badge} • `}Professional teaching</p>
                    </div>
                  </div>
                  
                  {formData.price === pkg.price && (
                    <div className="p-1 bg-purple-600 rounded-full">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>
                
                <div className="mb-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-white">₹{pkg.price}</span>
                    <span className="text-gray-400">{pkg.duration}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {pkg.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-400 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        {errors.price && <p className="text-red-400 text-sm">{errors.price}</p>}
      </div>

      {/* Capacity Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
            <Users className="h-5 w-5 text-white" />
          </div>
          <Label htmlFor="capacity" className="text-white text-base font-medium">
            Maximum Students <span className="text-red-400">*</span>
          </Label>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            id="capacity"
            type="number"
            value={formData.capacity}
            onChange={(e) => onUpdateFormData({ capacity: parseInt(e.target.value) || 20 })}
            placeholder="20"
            className={`bg-white/10 border-white/20 text-white placeholder:text-gray-400 h-12 ${
              errors.capacity ? 'border-red-500' : ''
            }`}
            min="1"
            max="100"
          />
          
          <div className="md:col-span-2 flex items-center gap-2 text-sm text-gray-300">
            <Clock className="h-4 w-4" />
            <span>Recommended: 15-25 students for optimal learning experience</span>
          </div>
        </div>
        {errors.capacity && <p className="text-red-400 text-sm mt-1">{errors.capacity}</p>}
      </div>

      {/* Selected Package Summary */}
      {selectedPackage && (
        <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-white">Selected: {selectedPackage.name}</h4>
                <p className="text-gray-300 text-sm">₹{selectedPackage.price} per hour • Max {formData.capacity} students</p>
              </div>
              <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                Active
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PricingCapacitySection;
