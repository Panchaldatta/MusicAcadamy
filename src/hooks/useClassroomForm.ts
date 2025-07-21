
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface ClassroomFormData {
  name: string;
  description: string;
  subject: string;
  level: string;
  schedule: string;
  price: number;
  capacity: number;
  prerequisites: string;
  duration_weeks: number;
  sessions_per_week: number;
  session_duration_minutes: number;
}

const initialFormData: ClassroomFormData = {
  name: "",
  description: "",
  subject: "",
  schedule: "",
  level: "",
  price: 25,
  capacity: 20,
  prerequisites: "",
  duration_weeks: 12,
  sessions_per_week: 2,
  session_duration_minutes: 60
};

export const useClassroomForm = () => {
  const [formData, setFormData] = useState<ClassroomFormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const updateFormData = (updates: Partial<ClassroomFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
    // Clear errors for updated fields
    const updatedFields = Object.keys(updates);
    setErrors(prev => {
      const newErrors = { ...prev };
      updatedFields.forEach(field => delete newErrors[field]);
      return newErrors;
    });
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Classroom name is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.subject) newErrors.subject = "Subject is required";
    if (!formData.schedule.trim()) newErrors.schedule = "Schedule is required";
    if (!formData.level) newErrors.level = "Level is required";
    if (formData.price < 0) newErrors.price = "Price must be positive";
    if (formData.capacity < 1) newErrors.capacity = "Capacity must be at least 1";
    if (formData.duration_weeks < 1) newErrors.duration_weeks = "Duration must be at least 1 week";
    if (formData.sessions_per_week < 1) newErrors.sessions_per_week = "Must have at least 1 session per week";
    if (formData.session_duration_minutes < 15) newErrors.session_duration_minutes = "Session must be at least 15 minutes";

    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setErrors({});
  };

  return {
    formData,
    errors,
    updateFormData,
    validateForm,
    resetForm
  };
};
