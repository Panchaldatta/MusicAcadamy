
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, CreditCard, User, Sparkles } from "lucide-react";
import { Teacher } from "@/hooks/useTeachers";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PaymentDialogProps {
  teacher: Teacher;
  isOpen: boolean;
  onClose: () => void;
  onPaymentComplete: () => void;
}

const PaymentDialog = ({ teacher, isOpen, onClose, onPaymentComplete }: PaymentDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    lesson_date: "",
    lesson_time: "",
    lesson_duration: 60,
    notes: ""
  });
  const { toast } = useToast();

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Combine date and time
      const lessonDateTime = new Date(`${formData.lesson_date}T${formData.lesson_time}`).toISOString();
      
      // Get current user session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Authentication Required",
          description: "Please log in to book a lesson.",
          variant: "destructive",
        });
        return;
      }

      // Create payment session
      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: {
          teacherId: teacher.id,
          teacherName: teacher.name,
          price: teacher.price,
          duration: formData.lesson_duration,
          lessonDate: lessonDateTime,
          notes: formData.notes
        }
      });

      if (error) throw error;

      if (data?.url) {
        // Open Stripe checkout in a new tab
        window.open(data.url, '_blank');
        
        toast({
          title: "Payment Window Opened 💳",
          description: "Complete your payment in the new tab to confirm your lesson booking.",
        });

        onPaymentComplete();
        onClose();
        
        // Reset form
        setFormData({
          lesson_date: "",
          lesson_time: "",
          lesson_duration: 60,
          notes: ""
        });
      }

    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again.",
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
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full">
              <CreditCard className="h-5 w-5 text-white" />
            </div>
            Pay & Book Lesson
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handlePayment} className="space-y-5">
          {/* Teacher Info - Compact */}
          <div className="bg-gradient-to-r from-orange-50 to-red-50 p-3 rounded-lg border border-orange-100">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <User className="h-3 w-3 text-orange-600" />
                  <span className="font-semibold text-sm text-gray-900">{teacher.name}</span>
                </div>
                <p className="text-xs text-gray-600">{teacher.subject} • {teacher.location}</p>
              </div>
              <div className="text-right">
                <span className="text-xs text-gray-600">Rate:</span>
                <div className="font-bold text-orange-600">₹{teacher.price}/hr</div>
              </div>
            </div>
          </div>

          {/* Quick Selection Grid */}
          <div className="grid grid-cols-2 gap-3">
            {/* Date */}
            <div className="space-y-1">
              <Label htmlFor="lesson_date" className="text-xs flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Date
              </Label>
              <Input
                id="lesson_date"
                type="date"
                min={minDate}
                value={formData.lesson_date}
                onChange={(e) => setFormData(prev => ({ ...prev, lesson_date: e.target.value }))}
                required
                className="text-sm"
              />
            </div>

            {/* Time */}
            <div className="space-y-1">
              <Label htmlFor="lesson_time" className="text-xs flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Time
              </Label>
              <Input
                id="lesson_time"
                type="time"
                value={formData.lesson_time}
                onChange={(e) => setFormData(prev => ({ ...prev, lesson_time: e.target.value }))}
                required
                className="text-sm"
              />
            </div>
          </div>

          {/* Duration */}
          <div className="space-y-1">
            <Label className="text-xs flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Duration
            </Label>
            <Select 
              value={formData.lesson_duration.toString()} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, lesson_duration: parseInt(value) }))}
            >
              <SelectTrigger className="text-sm">
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
          <div className="space-y-1">
            <Label htmlFor="notes" className="text-xs">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Any specific requirements..."
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={2}
              className="text-sm"
            />
          </div>

          {/* Total Amount */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-3 rounded-lg border">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-sm">Total Amount:</span>
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-orange-500" />
                <span className="text-lg font-bold text-gray-900">
                  ₹{(teacher.price * (formData.lesson_duration / 60)).toFixed(0)}
                </span>
              </div>
            </div>
            <p className="text-xs text-gray-600 mt-1">
              {formData.lesson_duration} min × ₹{teacher.price}/hr
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
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
                  Processing...
                </div>
              ) : (
                `Pay ₹${(teacher.price * (formData.lesson_duration / 60)).toFixed(0)}`
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDialog;
