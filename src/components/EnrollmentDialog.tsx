import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, Users, MapPin, CreditCard, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Database } from "@/integrations/supabase/types";

type Classroom = Database['public']['Tables']['classrooms']['Row'];

interface EnrollmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  classroom: Classroom | null;
}

const EnrollmentDialog: React.FC<EnrollmentDialogProps> = ({
  isOpen,
  onClose,
  classroom
}) => {
  const { toast } = useToast();

  if (!classroom) return null;

  const handleEnrollment = () => {
    // Simulate enrollment process
    toast({
      title: "Enrollment Successful! 🎉",
      description: `You have been enrolled in "${classroom.name}". Check your email for details.`,
    });
    onClose();
  };

  const handlePayment = () => {
    // Simulate payment process
    toast({
      title: "Processing Payment...",
      description: "Redirecting to secure payment gateway...",
    });
    
    // Simulate payment completion after 2 seconds
    setTimeout(() => {
      handleEnrollment();
    }, 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            Enroll in Class
          </DialogTitle>
          <DialogDescription>
            Complete your enrollment in this amazing class
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Class Info */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-2">{classroom.name}</h3>
              <p className="text-muted-foreground text-sm mb-3">
                {classroom.description || "Learn amazing musical skills in this comprehensive class"}
              </p>
              
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{classroom.duration_weeks} weeks</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{classroom.session_duration_minutes}min sessions</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>Max {classroom.capacity} students</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{classroom.schedule}</span>
                </div>
              </div>

              {/* Level Badge */}
              <div className="mt-3">
                <Badge variant="secondary" className="capitalize">
                  {classroom.level} Level
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Cost</p>
                  <p className="text-2xl font-bold text-primary">₹{classroom.price}</p>
                  <p className="text-xs text-muted-foreground">
                    For {classroom.duration_weeks} weeks • {classroom.sessions_per_week}x per week
                  </p>
                </div>
                <CreditCard className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          {/* Payment Options */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Payment Options</p>
            <div className="grid gap-2">
              <Button
                onClick={handlePayment}
                className="w-full bg-primary hover:bg-primary/90"
              >
                Pay Full Amount (₹{classroom.price})
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  toast({
                    title: "Installment Option",
                    description: "Contact us for installment payment plans",
                  });
                  onClose();
                }}
                className="w-full"
              >
                Pay in Installments
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handlePayment} className="bg-green-600 hover:bg-green-700">
            Enroll Now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EnrollmentDialog;