
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface BasicInformationFormData {
  name: string;
  description: string;
  subject: string;
  level: string;
  schedule: string;
}

interface BasicInformationSectionProps {
  formData: BasicInformationFormData;
  errors: Record<string, string>;
  onUpdateFormData: (updates: Partial<BasicInformationFormData>) => void;
}

const subjects = [
  "Piano",
  "Guitar", 
  "Violin",
  "Vocals",
  "Drums",
  "Bass",
  "Saxophone",
  "Flute",
  "Trumpet",
  "Music Theory"
];

const levels = [
  "Beginner",
  "Intermediate",
  "Advanced"
];

const BasicInformationSection = ({ formData, errors, onUpdateFormData }: BasicInformationSectionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-purple-300 border-b border-white/10 pb-2">
        Basic Information
      </h3>
      
      <div>
        <Label htmlFor="name" className="text-white">
          Classroom Name <span className="text-red-400">*</span>
        </Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => onUpdateFormData({ name: e.target.value })}
          placeholder="e.g., Piano Fundamentals"
          className={`bg-white/10 border-white/20 text-white placeholder:text-gray-400 ${
            errors.name ? 'border-red-500' : ''
          }`}
        />
        {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
      </div>

      <div>
        <Label htmlFor="description" className="text-white">
          Description <span className="text-red-400">*</span>
        </Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => onUpdateFormData({ description: e.target.value })}
          placeholder="Describe what students will learn in this classroom..."
          className={`bg-white/10 border-white/20 text-white placeholder:text-gray-400 ${
            errors.description ? 'border-red-500' : ''
          }`}
          rows={3}
        />
        {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="subject" className="text-white">
            Subject <span className="text-red-400">*</span>
          </Label>
          <Select value={formData.subject} onValueChange={(value) => onUpdateFormData({ subject: value })}>
            <SelectTrigger className={`bg-white/10 border-white/20 text-white ${
              errors.subject ? 'border-red-500' : ''
            }`}>
              <SelectValue placeholder="Select subject" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-white/20">
              {subjects.map((subject) => (
                <SelectItem key={subject} value={subject} className="text-white hover:bg-white/10">
                  {subject}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.subject && <p className="text-red-400 text-sm mt-1">{errors.subject}</p>}
        </div>

        <div>
          <Label htmlFor="level" className="text-white">
            Level <span className="text-red-400">*</span>
          </Label>
          <Select value={formData.level} onValueChange={(value) => onUpdateFormData({ level: value })}>
            <SelectTrigger className={`bg-white/10 border-white/20 text-white ${
              errors.level ? 'border-red-500' : ''
            }`}>
              <SelectValue placeholder="Select level" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-white/20">
              {levels.map((level) => (
                <SelectItem key={level} value={level} className="text-white hover:bg-white/10">
                  {level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.level && <p className="text-red-400 text-sm mt-1">{errors.level}</p>}
        </div>
      </div>

      <div>
        <Label htmlFor="schedule" className="text-white">
          Schedule <span className="text-red-400">*</span>
        </Label>
        <Input
          id="schedule"
          value={formData.schedule}
          onChange={(e) => onUpdateFormData({ schedule: e.target.value })}
          placeholder="e.g., Mon, Wed, Fri - 4:00 PM"
          className={`bg-white/10 border-white/20 text-white placeholder:text-gray-400 ${
            errors.schedule ? 'border-red-500' : ''
          }`}
        />
        {errors.schedule && <p className="text-red-400 text-sm mt-1">{errors.schedule}</p>}
      </div>
    </div>
  );
};

export default BasicInformationSection;
