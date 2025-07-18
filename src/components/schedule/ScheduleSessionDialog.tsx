import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface ClassSession {
  id: string;
  classroomId: string;
  classroomName: string;
  date: Date;
  startTime: string;
  endTime: string;
  students: number;
  location: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}

interface Classroom {
  id: string;
  name: string;
  capacity: number;
}

interface ScheduleSessionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  session?: ClassSession;
  selectedDate?: Date;
  classrooms: Classroom[];
  onSave: (session: Omit<ClassSession, 'id'>) => void;
}

const ScheduleSessionDialog = ({
  open,
  onOpenChange,
  session,
  selectedDate,
  classrooms,
  onSave
}: ScheduleSessionDialogProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    classroomId: '',
    classroomName: '',
    date: selectedDate || new Date(),
    startTime: '09:00',
    endTime: '10:00',
    students: 0,
    location: 'Online',
    status: 'scheduled' as 'scheduled' | 'completed' | 'cancelled',
    notes: ''
  });

  useEffect(() => {
    if (session) {
      setFormData({
        classroomId: session.classroomId,
        classroomName: session.classroomName,
        date: session.date,
        startTime: session.startTime,
        endTime: session.endTime,
        students: session.students,
        location: session.location,
        status: session.status,
        notes: session.notes || ''
      });
    } else if (selectedDate) {
      setFormData(prev => ({
        ...prev,
        date: selectedDate,
        classroomId: '',
        classroomName: '',
        startTime: '09:00',
        endTime: '10:00',
        students: 0,
        location: 'Online',
        status: 'scheduled' as 'scheduled' | 'completed' | 'cancelled',
        notes: ''
      }));
    }
  }, [session, selectedDate]);

  const handleClassroomSelect = (classroomId: string) => {
    const classroom = classrooms.find(c => c.id === classroomId);
    if (classroom) {
      setFormData(prev => ({
        ...prev,
        classroomId: classroom.id,
        classroomName: classroom.name,
        students: Math.min(prev.students || classroom.capacity, classroom.capacity)
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.classroomId) {
      toast({
        title: "Error",
        description: "Please select a classroom",
        variant: "destructive"
      });
      return;
    }

    if (formData.startTime >= formData.endTime) {
      toast({
        title: "Error",
        description: "End time must be after start time",
        variant: "destructive"
      });
      return;
    }

    onSave({
      classroomId: formData.classroomId,
      classroomName: formData.classroomName,
      date: formData.date,
      startTime: formData.startTime,
      endTime: formData.endTime,
      students: formData.students,
      location: formData.location,
      status: formData.status,
      notes: formData.notes
    });

    onOpenChange(false);
    
    toast({
      title: "Success",
      description: session ? "Class session updated!" : "Class session scheduled!",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-900 border-white/20 text-white max-w-md">
        <DialogHeader>
          <DialogTitle>
            {session ? 'Edit Class Session' : 'Schedule Class Session'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="classroom">Classroom</Label>
            <Select value={formData.classroomId} onValueChange={handleClassroomSelect}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="Select a classroom" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-white/20">
                {classrooms.map((classroom) => (
                  <SelectItem key={classroom.id} value={classroom.id} className="text-white hover:bg-white/10">
                    {classroom.name} (Capacity: {classroom.capacity})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={format(formData.date, 'yyyy-MM-dd')}
              onChange={(e) => setFormData(prev => ({ ...prev, date: new Date(e.target.value) }))}
              className="bg-white/10 border-white/20 text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                className="bg-white/10 border-white/20 text-white"
              />
            </div>
            <div>
              <Label htmlFor="endTime">End Time</Label>
              <Input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                className="bg-white/10 border-white/20 text-white"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="students">Expected Students</Label>
            <Input
              id="students"
              type="number"
              min="0"
              max={classrooms.find(c => c.id === formData.classroomId)?.capacity || 100}
              value={formData.students}
              onChange={(e) => setFormData(prev => ({ ...prev, students: parseInt(e.target.value) || 0 }))}
              className="bg-white/10 border-white/20 text-white"
            />
          </div>

          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              placeholder="Online, Room 101, etc."
              className="bg-white/10 border-white/20 text-white"
            />
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value: 'scheduled' | 'completed' | 'cancelled') => setFormData(prev => ({ ...prev, status: value }))}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-white/20">
                <SelectItem value="scheduled" className="text-white hover:bg-white/10">Scheduled</SelectItem>
                <SelectItem value="completed" className="text-white hover:bg-white/10">Completed</SelectItem>
                <SelectItem value="cancelled" className="text-white hover:bg-white/10">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Additional notes about this session..."
              className="bg-white/10 border-white/20 text-white"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 border-white/30 text-white hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {session ? 'Update' : 'Schedule'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleSessionDialog;
