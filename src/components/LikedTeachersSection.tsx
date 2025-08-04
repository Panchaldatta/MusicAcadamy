import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Star, MapPin, Clock, Award } from "lucide-react";
import PaymentDialog from "./PaymentDialog";
import type { Database } from "@/integrations/supabase/types";

type Teacher = Database['public']['Tables']['teachers']['Row'];

interface LikedTeacher {
  id: string;
  teacher: any; // Use any for flexibility with the teacher data from swipes
  created_at: string;
}

interface LikedTeachersSectionProps {
  likedTeachers: LikedTeacher[];
  onPaymentComplete: () => void;
}

const LikedTeachersSection = ({ likedTeachers, onPaymentComplete }: LikedTeachersSectionProps) => {
  const [selectedTeacher, setSelectedTeacher] = useState<any>(null);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);

  const handleBookLesson = (teacher: any) => {
    // Convert to Teacher type for PaymentDialog
    const teacherForPayment: Teacher = {
      ...teacher,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      image_url: teacher.image_url || null,
      verified: teacher.verified || false
    };
    setSelectedTeacher(teacherForPayment);
    setShowPaymentDialog(true);
  };

  if (likedTeachers.length === 0) return null;

  return (
    <>
      <div className="mt-6 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-green-800 text-lg">
            💚 Your Liked Teachers ({likedTeachers.length})
          </h3>
          <Badge className="bg-green-600 text-white">Ready to Book</Badge>
        </div>
        <p className="text-green-700 text-sm mb-4">
          Great choices! These are the teachers you've liked. You can now book lessons with them.
        </p>
        
        <div className="grid gap-4">
          {likedTeachers.map(({ teacher }) => (
            <Card key={teacher.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row">
                  <div className="relative w-full sm:w-32 h-32">
                    <img
                      src={teacher.image_url || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face"}
                      alt={teacher.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-green-500 text-white flex items-center gap-1">
                        <Heart className="h-3 w-3" />
                        Liked
                      </Badge>
                    </div>
                    <div className="absolute top-2 left-2 bg-white/95 backdrop-blur-sm text-orange-600 px-2 py-1 rounded-full text-sm font-bold">
                      ₹{teacher.price}/hr
                    </div>
                  </div>

                  <div className="flex-1 p-4">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">{teacher.name}</h4>
                        <p className="text-orange-600 font-medium text-sm mb-2">{teacher.subject}</p>
                      </div>
                      {teacher.verified && (
                        <Badge className="bg-emerald-100 text-emerald-700 text-xs">Verified</Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-3 w-3 ${i < Math.floor(teacher.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                        ))}
                      </div>
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">{teacher.rating}</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mb-3 text-xs text-gray-600">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {teacher.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {teacher.response_time}
                      </div>
                      <div className="flex items-center gap-1">
                        <Award className="h-3 w-3" />
                        {teacher.experience}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button 
                        size="sm"
                        className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white flex-1"
                        onClick={() => handleBookLesson(teacher)}
                      >
                        💳 Book Lesson (₹{teacher.price}/hr)
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-orange-200 text-orange-600 hover:bg-orange-50"
                      >
                        👤 View Profile
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-4 p-3 bg-green-100 rounded-lg">
          <p className="text-sm text-green-800 text-center">
            💡 <strong>Ready to learn:</strong> {likedTeachers.length} teacher{likedTeachers.length !== 1 ? 's' : ''} available for booking
          </p>
        </div>
      </div>

      {selectedTeacher && (
        <PaymentDialog
          teacher={selectedTeacher}
          isOpen={showPaymentDialog}
          onClose={() => {
            setShowPaymentDialog(false);
            setSelectedTeacher(null);
          }}
          onPaymentComplete={onPaymentComplete}
        />
      )}
    </>
  );
};

export default LikedTeachersSection;