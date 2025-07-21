
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ScheduleDetailsFormData {
  duration_weeks: number;
  sessions_per_week: number;
  session_duration_minutes: number;
}

interface ScheduleDetailsSectionProps {
  formData: ScheduleDetailsFormData;
  errors: Record<string, string>;
  onUpdateFormData: (updates: Partial<ScheduleDetailsFormData>) => void;
}

const ScheduleDetailsSection = ({ formData, errors, onUpdateFormData }: ScheduleDetailsSectionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-purple-300 border-b border-white/10 pb-2">
        Schedule Details
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="duration_weeks" className="text-white">
            Duration (weeks) <span className="text-red-400">*</span>
          </Label>
          <Input
            id="duration_weeks"
            type="number"
            value={formData.duration_weeks}
            onChange={(e) => onUpdateFormData({ duration_weeks: parseInt(e.target.value) || 12 })}
            placeholder="12"
            className={`bg-white/10 border-white/20 text-white ${
              errors.duration_weeks ? 'border-red-500' : ''
            }`}
            min="1"
          />
          {errors.duration_weeks && <p className="text-red-400 text-sm mt-1">{errors.duration_weeks}</p>}
        </div>

        <div>
          <Label htmlFor="sessions_per_week" className="text-white">
            Sessions per Week <span className="text-red-400">*</span>
          </Label>
          <Input
            id="sessions_per_week"
            type="number"
            value={formData.sessions_per_week}
            onChange={(e) => onUpdateFormData({ sessions_per_week: parseInt(e.target.value) || 2 })}
            placeholder="2"
            className={`bg-white/10 border-white/20 text-white ${
              errors.sessions_per_week ? 'border-red-500' : ''
            }`}
            min="1"
            max="7"
          />
          {errors.sessions_per_week && <p className="text-red-400 text-sm mt-1">{errors.sessions_per_week}</p>}
        </div>

        <div>
          <Label htmlFor="session_duration_minutes" className="text-white">
            Session Duration (minutes) <span className="text-red-400">*</span>
          </Label>
          <Input
            id="session_duration_minutes"
            type="number"
            value={formData.session_duration_minutes}
            onChange={(e) => onUpdateFormData({ session_duration_minutes: parseInt(e.target.value) || 60 })}
            placeholder="60"
            className={`bg-white/10 border-white/20 text-white ${
              errors.session_duration_minutes ? 'border-red-500' : ''
            }`}
            min="15"
            max="180"
          />
          {errors.session_duration_minutes && <p className="text-red-400 text-sm mt-1">{errors.session_duration_minutes}</p>}
        </div>
      </div>
    </div>
  );
};

export default ScheduleDetailsSection;
