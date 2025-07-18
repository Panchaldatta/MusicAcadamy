
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface AdditionalInfoFormData {
  prerequisites: string;
}

interface AdditionalInfoSectionProps {
  formData: AdditionalInfoFormData;
  onUpdateFormData: (updates: Partial<AdditionalInfoFormData>) => void;
}

const AdditionalInfoSection = ({ formData, onUpdateFormData }: AdditionalInfoSectionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-purple-300 border-b border-white/10 pb-2">
        Additional Information
      </h3>
      
      <div>
        <Label htmlFor="prerequisites" className="text-white">
          Prerequisites (optional)
        </Label>
        <Textarea
          id="prerequisites"
          value={formData.prerequisites}
          onChange={(e) => onUpdateFormData({ prerequisites: e.target.value })}
          placeholder="Any requirements or prior knowledge needed..."
          className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
          rows={2}
        />
      </div>
    </div>
  );
};

export default AdditionalInfoSection;
