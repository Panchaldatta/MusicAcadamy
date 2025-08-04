import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Classroom = Database['public']['Tables']['classrooms']['Row'];

interface LikedClassroom {
  id: string;
  classroom: Classroom;
  created_at: string;
}

interface LikedClassroomsSectionProps {
  likedClassrooms: LikedClassroom[];
  onEnrollmentComplete: () => void;
}

const LikedClassroomsSection = ({ likedClassrooms, onEnrollmentComplete }: LikedClassroomsSectionProps) => {
  const [enrollingClassroom, setEnrollingClassroom] = useState<string | null>(null);
  const { toast } = useToast();

  const handleEnrollment = async (classroom: Classroom) => {
    setEnrollingClassroom(classroom.id);
    
    try {
      // Get current user session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Authentication Required",
          description: "Please log in to enroll in classes.",
          variant: "destructive",
        });
        return;
      }

      // Check if already enrolled
      const { data: existingEnrollment } = await supabase
        .from('classroom_enrollments')
        .select('id')
        .eq('classroom_id', classroom.id)
        .eq('student_id', session.user.id)
        .single();

      if (existingEnrollment) {
        toast({
          title: "Already Enrolled",
          description: `You're already enrolled in "${classroom.name}".`,
        });
        return;
      }

      // Create enrollment record
      const { error: enrollmentError } = await supabase
        .from('classroom_enrollments')
        .insert({
          classroom_id: classroom.id,
          student_id: session.user.id,
          status: 'active'
        });

      if (enrollmentError) throw enrollmentError;

      toast({
        title: "🎉 Enrollment Successful!",
        description: `You've been enrolled in "${classroom.name}". Check your email for class details.`,
      });

      onEnrollmentComplete();
      
    } catch (error) {
      console.error('Enrollment error:', error);
      toast({
        title: "Enrollment Failed",
        description: "There was an error processing your enrollment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setEnrollingClassroom(null);
    }
  };

  if (likedClassrooms.length === 0) return null;

  return (
    <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-blue-800 text-lg">
          💙 Your Liked Classes ({likedClassrooms.length})
        </h3>
        <Badge className="bg-blue-600 text-white">Ready to Enroll</Badge>
      </div>
      <p className="text-blue-700 text-sm mb-4">
        Great choices! These are the classes you've liked. You can now enroll and start your learning journey.
      </p>
      
      <div className="grid gap-4">
        {likedClassrooms.map(({ classroom }) => (
          <Card key={classroom.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{classroom.name}</h4>
                    <Badge className="bg-blue-500 text-white flex items-center gap-1 ml-2">
                      <Heart className="h-3 w-3" />
                      Liked
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">
                    {classroom.description || `Learn ${classroom.subject} with expert guidance`}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-3">
                    <span className="bg-gray-100 px-2 py-1 rounded">📅 {classroom.duration_weeks} weeks</span>
                    <span className="bg-gray-100 px-2 py-1 rounded">👥 Max {classroom.capacity} students</span>
                    <span className="bg-gray-100 px-2 py-1 rounded">📊 {classroom.level}</span>
                    <span className="bg-gray-100 px-2 py-1 rounded">🎵 {classroom.subject}</span>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <span className="text-xl font-bold text-blue-600">₹{classroom.price}</span>
                    <span className="text-sm text-gray-500">
                      ({classroom.sessions_per_week}x per week)
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2 w-full sm:w-auto">
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
                    onClick={() => handleEnrollment(classroom)}
                    disabled={enrollingClassroom === classroom.id}
                  >
                    {enrollingClassroom === classroom.id ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        Enrolling...
                      </div>
                    ) : (
                      `✨ Enroll Now (₹${classroom.price})`
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-blue-200 text-blue-600 hover:bg-blue-50 w-full sm:w-auto"
                  >
                    📋 View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="mt-4 p-3 bg-blue-100 rounded-lg">
        <p className="text-sm text-blue-800 text-center">
          💡 <strong>Total Value:</strong> ₹{likedClassrooms.reduce((sum, { classroom }) => sum + classroom.price, 0)} for {likedClassrooms.length} course{likedClassrooms.length !== 1 ? 's' : ''}
        </p>
      </div>
    </div>
  );
};

export default LikedClassroomsSection;