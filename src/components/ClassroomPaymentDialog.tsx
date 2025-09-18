import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { CreditCard, Users, Clock, BookOpen, GraduationCap, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { StripeService, PaymentSessionData } from "@/services/payment/stripeService";
import type { Database } from "@/integrations/supabase/types";

type Classroom = Database['public']['Tables']['classrooms']['Row'];

interface ClassroomPaymentDialogProps {
  classroom: Classroom;
  isOpen: boolean;
  onClose: () => void;
  onPaymentComplete: () => void;
}

const ClassroomPaymentDialog = ({ classroom, isOpen, onClose, onPaymentComplete }: ClassroomPaymentDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handlePayment = async () => {
    setIsLoading(true);

    try {
      const paymentData: PaymentSessionData = {
        classroomId: classroom.id,
        classroomName: classroom.name,
        price: classroom.price,
        duration: classroom.duration_weeks,
        type: 'classroom'
      };

      const { url } = await StripeService.createClassroomPayment(paymentData);

      if (url) {
        // Open Stripe checkout in a new tab
        window.open(url, '_blank');
        
        toast({
          title: "Payment Window Opened 💳",
          description: "Complete your payment in the new tab to enroll in the classroom.",
        });

        onPaymentComplete();
        onClose();
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full">
              <CreditCard className="h-5 w-5 text-white" />
            </div>
            Enroll in Classroom
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Classroom Details */}
          <Card className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <div className="flex gap-4">
              <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={classroom.image_url || "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop"}
                  alt={classroom.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-900 mb-1">{classroom.name}</h3>
                <p className="text-blue-600 font-medium mb-2">{classroom.subject}</p>
                <Badge className="bg-blue-100 text-blue-700">{classroom.level}</Badge>
              </div>
            </div>

            {classroom.description && (
              <p className="text-gray-600 text-sm mt-3 leading-relaxed">
                {classroom.description}
              </p>
            )}
          </Card>

          {/* Course Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="p-2 bg-blue-500 rounded-lg">
                <Clock className="h-4 w-4 text-white" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Duration</div>
                <div className="font-semibold">{classroom.duration_weeks} weeks</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="p-2 bg-green-500 rounded-lg">
                <Users className="h-4 w-4 text-white" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Capacity</div>
                <div className="font-semibold">{classroom.capacity} students</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="p-2 bg-purple-500 rounded-lg">
                <BookOpen className="h-4 w-4 text-white" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Sessions</div>
                <div className="font-semibold">{classroom.sessions_per_week}x/week</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="p-2 bg-orange-500 rounded-lg">
                <GraduationCap className="h-4 w-4 text-white" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Level</div>
                <div className="font-semibold">{classroom.level}</div>
              </div>
            </div>
          </div>

          {/* Schedule */}
          {classroom.schedule && (
            <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="text-sm text-gray-600 mb-1">Schedule</div>
              <div className="font-medium text-gray-900">{classroom.schedule}</div>
            </div>
          )}

          {/* Total Amount */}
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-4 rounded-lg text-white">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-300">Total Course Fee:</span>
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-yellow-400" />
                <span className="text-2xl font-bold">₹{classroom.price}</span>
              </div>
            </div>
            <div className="text-sm text-gray-400">
              {classroom.duration_weeks} weeks • {classroom.sessions_per_week} sessions per week
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handlePayment}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Processing...
                </div>
              ) : (
                `Enroll Now - ₹${classroom.price}`
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ClassroomPaymentDialog;