
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCreateClassroom } from "@/hooks/useClassrooms";

interface CreateClassroomDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateClassroomDialog = ({ open, onOpenChange }: CreateClassroomDialogProps) => {
  const createClassroom = useCreateClassroom();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    subject: "",
    schedule: "",
    level: "",
    price: 0,
    capacity: 20,
    prerequisites: "",
    duration_weeks: 12,
    sessions_per_week: 2,
    session_duration_minutes: 60
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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

      // Reset form and close dialog
      setFormData({
        name: "",
        description: "",
        subject: "",
        schedule: "",
        level: "",
        price: 0,
        capacity: 20,
        prerequisites: "",
        duration_weeks: 12,
        sessions_per_week: 2,
        session_duration_minutes: 60
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to create classroom:', error);
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
          <DialogTitle>Create New Classroom</DialogTitle>
          <DialogDescription className="text-gray-300">
            Set up a new classroom to start teaching students online.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="name">Classroom Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Piano Fundamentals"
                className="bg-white/10 border-white/20 text-white"
                required
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe what students will learn in this classroom..."
                className="bg-white/10 border-white/20 text-white"
                rows={3}
                required
              />
            </div>

            <div>
              <Label htmlFor="subject">Subject</Label>
              <Select value={formData.subject} onValueChange={(value) => setFormData({ ...formData, subject: value })}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="level">Level</Label>
              <Select value={formData.level} onValueChange={(value) => setFormData({ ...formData, level: value })}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  {levels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-2">
              <Label htmlFor="schedule">Schedule</Label>
              <Input
                id="schedule"
                value={formData.schedule}
                onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                placeholder="e.g., Mon, Wed, Fri - 4:00 PM"
                className="bg-white/10 border-white/20 text-white"
                required
              />
            </div>

            <div>
              <Label htmlFor="price">Price per Session ($)</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                placeholder="25"
                className="bg-white/10 border-white/20 text-white"
                min="0"
                required
              />
            </div>

            <div>
              <Label htmlFor="capacity">Maximum Students</Label>
              <Input
                id="capacity"
                type="number"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 20 })}
                placeholder="20"
                className="bg-white/10 border-white/20 text-white"
                min="1"
                max="100"
                required
              />
            </div>

            <div>
              <Label htmlFor="duration_weeks">Duration (weeks)</Label>
              <Input
                id="duration_weeks"
                type="number"
                value={formData.duration_weeks}
                onChange={(e) => setFormData({ ...formData, duration_weeks: parseInt(e.target.value) || 12 })}
                placeholder="12"
                className="bg-white/10 border-white/20 text-white"
                min="1"
                required
              />
            </div>

            <div>
              <Label htmlFor="sessions_per_week">Sessions per Week</Label>
              <Input
                id="sessions_per_week"
                type="number"
                value={formData.sessions_per_week}
                onChange={(e) => setFormData({ ...formData, sessions_per_week: parseInt(e.target.value) || 2 })}
                placeholder="2"
                className="bg-white/10 border-white/20 text-white"
                min="1"
                max="7"
                required
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="prerequisites">Prerequisites (optional)</Label>
              <Textarea
                id="prerequisites"
                value={formData.prerequisites}
                onChange={(e) => setFormData({ ...formData, prerequisites: e.target.value })}
                placeholder="Any requirements or prior knowledge needed..."
                className="bg-white/10 border-white/20 text-white"
                rows={2}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
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
