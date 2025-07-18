
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useCreateClassroom } from "@/hooks/useClassrooms";
import { useClassroomForm } from "@/hooks/useClassroomForm";
import BasicInformationSection from "./classroom/form/BasicInformationSection";
import PricingCapacitySection from "./classroom/form/PricingCapacitySection";
import ScheduleDetailsSection from "./classroom/form/ScheduleDetailsSection";
import AdditionalInfoSection from "./classroom/form/AdditionalInfoSection";

interface CreateClassroomDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateClassroomDialog = ({ open, onOpenChange }: CreateClassroomDialogProps) => {
  const createClassroom = useCreateClassroom();
  const { formData, errors, updateFormData, validateForm, resetForm } = useClassroomForm();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }
    
    try {
      await createClassroom.mutateAsync({
        name: formData.name,
        description: formData.description,
        subject: formData.subject,
        schedule: formData.schedule,
        level: formData.level,
        price: formData.price,
        capacity: formData.capacity,
        prerequisites: formData.prerequisites || null,
        duration_weeks: formData.duration_weeks,
        sessions_per_week: formData.sessions_per_week,
        session_duration_minutes: formData.session_duration_minutes
      });

      resetForm();
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to create classroom:', error);
    }
  };

  const handleCancel = () => {
    resetForm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-900 border-white/20 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Create New Classroom
          </DialogTitle>
          <DialogDescription className="text-gray-300">
            Set up a new classroom to start teaching students online.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <BasicInformationSection 
            formData={formData}
            errors={errors}
            onUpdateFormData={updateFormData}
          />

          <PricingCapacitySection 
            formData={formData}
            errors={errors}
            onUpdateFormData={updateFormData}
          />

          <ScheduleDetailsSection 
            formData={formData}
            errors={errors}
            onUpdateFormData={updateFormData}
          />

          <AdditionalInfoSection 
            formData={formData}
            onUpdateFormData={updateFormData}
          />

          <div className="flex gap-3 pt-6 border-t border-white/10">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleCancel}
              className="flex-1 border-white/30 text-white hover:bg-white/10"
              disabled={createClassroom.isPending}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              disabled={createClassroom.isPending}
            >
              {createClassroom.isPending ? "Creating..." : "Create Classroom"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateClassroomDialog;
