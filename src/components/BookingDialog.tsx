import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, CreditCard, User } from "lucide-react";
import { Teacher } from "@/hooks/useTeachers";
import { BookingService } from "@/services/bookingService";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface BookingDialogProps {
  teacher: Teacher;
  isOpen: boolean;
  onClose: () => void;
  onBookingComplete: () => void;
}

const BookingDialog = ({ teacher, isOpen, onClose, onBookingComplete }: BookingDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    lesson_date: "",
    lesson_time: "",
    lesson_duration: 60,
    notes: ""
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Combine date and time
      const lessonDateTime = new Date(`${formData.lesson_date}T${formData.lesson_time}`).toISOString();
      
      // Get current user ID (in a real app, this would come from auth context)
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please log in to book a lesson.",
          variant: "destructive",
        });
        return;
      }

      await BookingService.createBooking({
        student_id: user.id,
        teacher_id: teacher.id,
        lesson_date: lessonDateTime,
        lesson_duration: formData.lesson_duration,
        price: teacher.price,
        status: 'pending',
        notes: formData.notes || undefined
      });

      toast({
        title: "Lesson Booked Successfully! 🎉",
        description: `Your ${formData.lesson_duration}-minute lesson with ${teacher.name} has been booked for ${new Date(lessonDateTime).toLocaleDateString()}.`,
      });

      onBookingComplete();
      onClose();
      
      // Reset form
      setFormData({
        lesson_date: "",
        lesson_time: "",
        lesson_duration: 60,
        notes: ""
      });

    } catch (error) {
      console.error('Booking error:', error);
      toast({
        title: "Booking Failed",
        description: "There was an error booking your lesson. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            Book a Lesson with {teacher.name}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Teacher Info */}
          <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-xl border border-orange-100">
            <div className="flex items-center gap-3 mb-2">
              <User className="h-4 w-4 text-orange-600" />
              <span className="font-semibold text-gray-900">{teacher.name}</span>
            </div>
            <p className="text-sm text-gray-600 mb-2">{teacher.subject} • {teacher.location}</p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Price per lesson:</span>
              <span className="font-bold text-orange-600">₹{teacher.price}</span>
            </div>
          </div>

          {/* Date Selection */}
          <div className="space-y-2">
            <Label htmlFor="lesson_date" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Lesson Date
            </Label>
            <Input
              id="lesson_date"
              type="date"
              min={minDate}
              value={formData.lesson_date}
              onChange={(e) => setFormData(prev => ({ ...prev, lesson_date: e.target.value }))}
              required
              className="w-full"
            />
          </div>

          {/* Time Selection */}
          <div className="space-y-2">
            <Label htmlFor="lesson_time" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Lesson Time
            </Label>
            <Input
              id="lesson_time"
              type="time"
              value={formData.lesson_time}
              onChange={(e) => setFormData(prev => ({ ...prev, lesson_time: e.target.value }))}
              required
              className="w-full"
            />
          </div>

          {/* Duration Selection */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Lesson Duration
            </Label>
            <Select 
              value={formData.lesson_duration.toString()} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, lesson_duration: parseInt(value) }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="60">60 minutes</SelectItem>
                <SelectItem value="90">90 minutes</SelectItem>
                <SelectItem value="120">120 minutes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Any specific requirements or topics you'd like to focus on..."
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
            />
          </div>

          {/* Total Price */}
          <div className="bg-gray-50 p-4 rounded-xl border">
            <div className="flex items-center justify-between">
              <span className="font-semibold">Total Amount:</span>
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-gray-600" />
                <span className="text-xl font-bold text-gray-900">
                  ₹{(teacher.price * (formData.lesson_duration / 60)).toFixed(0)}
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {formData.lesson_duration} minutes × ₹{teacher.price}/hour
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Booking...
                </div>
              ) : (
                `Book Lesson - ₹${(teacher.price * (formData.lesson_duration / 60)).toFixed(0)}`
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BookingDialog;
