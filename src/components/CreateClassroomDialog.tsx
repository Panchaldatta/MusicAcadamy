
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCreateClassroom } from "@/hooks/useClassrooms";
import { useClassroomForm } from "@/hooks/useClassroomForm";
import BasicInformationSection from "./classroom/form/BasicInformationSection";
import PricingCapacitySection from "./classroom/form/PricingCapacitySection";
import ScheduleDetailsSection from "./classroom/form/ScheduleDetailsSection";
import AdditionalInfoSection from "./classroom/form/AdditionalInfoSection";
import { BookOpen, Sparkles, CheckCircle, Plus } from "lucide-react";

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
      <DialogContent className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-2 border-purple-500/30 text-white max-w-6xl max-h-[95vh] overflow-y-auto shadow-2xl">
        {/* Enhanced Header */}
        <DialogHeader className="relative pb-6">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-t-xl -m-6 mb-0" />
          <div className="relative">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl shadow-lg">
                <Plus className="h-8 w-8 text-white" />
              </div>
              <div>
                <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-300 bg-clip-text text-transparent">
                  Create New Classroom
                </DialogTitle>
                <DialogDescription className="text-gray-300 text-lg mt-1">
                  Design your perfect learning environment and start teaching students worldwide
                </DialogDescription>
              </div>
            </div>
            
            {/* Progress indicator */}
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Sparkles className="h-4 w-4 text-yellow-400" />
              <span>Set up your classroom in a few simple steps</span>
            </div>
          </div>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Form Sections with Enhanced Cards */}
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
            <CardContent className="p-6">
              <BasicInformationSection 
                formData={formData}
                errors={errors}
                onUpdateFormData={updateFormData}
              />
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
            <CardContent className="p-6">
              <PricingCapacitySection 
                formData={formData}
                errors={errors}
                onUpdateFormData={updateFormData}
              />
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
            <CardContent className="p-6">
              <ScheduleDetailsSection 
                formData={formData}
                errors={errors}
                onUpdateFormData={updateFormData}
              />
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
            <CardContent className="p-6">
              <AdditionalInfoSection 
                formData={formData}
                onUpdateFormData={updateFormData}
              />
            </CardContent>
          </Card>

          {/* Enhanced Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-white/20">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleCancel}
              className="flex-1 border-white/30 text-white hover:bg-white/10 hover:border-white/50 h-12 text-lg font-medium"
              disabled={createClassroom.isPending}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className="flex-1 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 hover:from-purple-700 hover:via-pink-700 hover:to-purple-700 text-white h-12 text-lg font-bold shadow-lg hover:shadow-xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105"
              disabled={createClassroom.isPending}
            >
              {createClassroom.isPending ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white" />
                  Creating Classroom...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Create Classroom
                </div>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateClassroomDialog;
