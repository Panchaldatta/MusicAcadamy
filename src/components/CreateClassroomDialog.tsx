
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCreateClassroom } from "@/hooks/useClassrooms";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface CreateClassroomDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateClassroomDialog = ({ open, onOpenChange }: CreateClassroomDialogProps) => {
  const createClassroom = useCreateClassroom();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    level: "",
    schedule: "",
    price: 25,
    capacity: 20
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Classroom name is required";
    if (!formData.subject) newErrors.subject = "Subject is required";
    if (!formData.schedule.trim()) newErrors.schedule = "Schedule is required";
    if (!formData.level) newErrors.level = "Level is required";
    if (formData.price < 0) newErrors.price = "Price must be positive";
    if (formData.capacity < 1) newErrors.capacity = "Capacity must be at least 1";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setFormData({
      name: "",
      subject: "",
      level: "",
      schedule: "",
      price: 25,
      capacity: 20
    });
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Starting classroom creation...');

    // Check authentication first
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to create a classroom. Please log in and try again.",
        variant: "destructive",
      });
      return;
    }

    console.log('User authenticated:', user.id);

    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form",
        variant: "destructive",
      });
      return;
    }
    
    try {
      console.log('Submitting classroom data:', formData);
      await createClassroom.mutateAsync({
        name: formData.name,
        description: `Learn ${formData.subject} at ${formData.level} level`,
        subject: formData.subject,
        schedule: formData.schedule,
        level: formData.level,
        price: formData.price,
        capacity: formData.capacity
      });

      console.log('Classroom created successfully');
      resetForm();
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to create classroom:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create classroom. Please try again.",
        variant: "destructive",
      });
    }
  };

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-900 border-white/20 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Create Classroom
          </DialogTitle>
          <DialogDescription className="text-gray-300">
            Set up a new classroom quickly with just the essentials.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-white">
                Classroom Name <span className="text-red-400">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Piano Fundamentals"
                className={`bg-white/10 border-white/20 text-white placeholder:text-gray-400 ${
                  errors.name ? 'border-red-500' : ''
                }`}
              />
              {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="subject" className="text-white">
                  Subject <span className="text-red-400">*</span>
                </Label>
                <Select value={formData.subject} onValueChange={(value) => setFormData({ ...formData, subject: value })}>
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
                <Select value={formData.level} onValueChange={(value) => setFormData({ ...formData, level: value })}>
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
                onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                placeholder="e.g., Mon, Wed, Fri - 4:00 PM"
                className={`bg-white/10 border-white/20 text-white placeholder:text-gray-400 ${
                  errors.schedule ? 'border-red-500' : ''
                }`}
              />
              {errors.schedule && <p className="text-red-400 text-sm mt-1">{errors.schedule}</p>}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price" className="text-white">
                  Price per Session ($) <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
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
                  Max Students <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 20 })}
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

          <div className="flex gap-3 pt-6 border-t border-white/10">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => {
                resetForm();
                onOpenChange(false);
              }}
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
