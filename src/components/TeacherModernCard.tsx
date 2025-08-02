
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Clock, Calendar, Award, Users, Heart } from "lucide-react";
import { Teacher } from "@/hooks/useTeachers";
import PaymentDialog from "./PaymentDialog";

interface TeacherModernCardProps {
  teacher: Teacher;
  onBookLesson?: () => void;
}

const TeacherModernCard = ({ teacher, onBookLesson }: TeacherModernCardProps) => {
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);

  const handleBookLesson = () => {
    setIsPaymentDialogOpen(true);
    onBookLesson?.();
  };

  const handlePaymentComplete = () => {
    console.log('Payment completed for teacher:', teacher.name);
  };

  return (
    <>
      <Card className="group overflow-hidden bg-white rounded-2xl shadow-lg border-0 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative">
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 via-red-50/50 to-pink-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <CardContent className="relative p-4 sm:p-6">
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 items-start">
            {/* Teacher Image - Mobile: Full width, Desktop: Fixed width */}
            <div className="flex-shrink-0 relative w-full lg:w-48">
              <div className="w-full h-48 sm:h-40 lg:w-48 lg:h-36 rounded-2xl overflow-hidden bg-gradient-to-br from-orange-400 via-red-500 to-pink-500 shadow-lg relative group/image">
                {teacher.image_url ? (
                  <img
                    src={teacher.image_url}
                    alt={teacher.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover/image:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-orange-400 via-red-500 to-pink-500 flex items-center justify-center relative">
                    <div className="text-4xl sm:text-5xl font-bold text-white drop-shadow-lg">
                      {teacher.name.charAt(0)}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>
                )}
                
                {/* Verified badge overlay */}
                {teacher.verified && (
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-1.5 shadow-lg">
                    <Award className="h-4 w-4 text-yellow-500" />
                  </div>
                )}
                
                {/* Floating heart icon */}
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-full p-1.5 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer hover:bg-red-50">
                  <Heart className="h-4 w-4 text-gray-600 hover:text-red-500 transition-colors" />
                </div>
              </div>
            </div>

            {/* Teacher Info - Responsive layout */}
            <div className="flex-1 space-y-3 lg:space-y-4 w-full">
              {/* Subject Badge and Student Count */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 sm:px-4 py-1.5 rounded-full text-sm font-semibold shadow-lg w-fit">
                  {teacher.subject}
                </Badge>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Users className="h-3 w-3" />
                  <span>{teacher.reviews} students</span>
                </div>
              </div>

              {/* Teacher Name */}
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight mb-1 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-orange-600 group-hover:to-red-600 group-hover:bg-clip-text transition-all duration-300">
                  {teacher.name}
                </h3>
                <p className="text-gray-600 text-sm sm:text-base">Music Teacher & Mentor</p>
              </div>

              {/* Rating and Reviews */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`h-4 w-4 transition-colors duration-200 ${i < Math.floor(teacher.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                    ))}
                  </div>
                  <span className="font-bold text-base sm:text-lg text-gray-900">{teacher.rating}</span>
                </div>
                <span className="text-gray-500 bg-gray-100 px-2 py-1 rounded-full text-xs w-fit">
                  {teacher.reviews} reviews
                </span>
              </div>
              
              {/* Info grid - Responsive */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
                <div className="flex items-center gap-2 text-gray-600">
                  <div className="bg-orange-100 p-1.5 rounded-full">
                    <MapPin className="h-3 w-3 text-orange-600" />
                  </div>
                  <span className="text-sm font-medium">{teacher.location}</span>
                </div>
                
                <div className="flex items-center gap-2 text-gray-600">
                  <div className="bg-blue-100 p-1.5 rounded-full">
                    <Clock className="h-3 w-3 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium">{teacher.experience} experience</span>
                </div>

                <div className="flex items-center gap-2 text-gray-600 sm:col-span-2 lg:col-span-1">
                  <div className="bg-green-100 p-1.5 rounded-full">
                    <Calendar className="h-3 w-3 text-green-600" />
                  </div>
                  <span className="text-sm font-medium">Response: {teacher.response_time}</span>
                </div>
              </div>

              {/* Price and Action Buttons - Mobile friendly */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-3 sm:pt-4 border-t border-gray-100 gap-3 sm:gap-0">
                <div className="space-y-1 text-center sm:text-left">
                  <div className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                    ₹{teacher.price}
                  </div>
                  <div className="text-xs text-gray-500 font-medium">per hour</div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <Button 
                    variant="outline"
                    size="sm"
                    className="border-2 border-orange-200 text-orange-600 hover:bg-orange-50 px-4 py-2 rounded-full font-semibold transition-all duration-300 w-full sm:w-auto"
                  >
                    VIEW PROFILE
                  </Button>
                  <Button 
                    onClick={handleBookLesson}
                    size="sm"
                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-2 rounded-full font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 w-full sm:w-auto"
                  >
                    PAY & BOOK
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <PaymentDialog
        teacher={teacher}
        isOpen={isPaymentDialogOpen}
        onClose={() => setIsPaymentDialogOpen(false)}
        onPaymentComplete={handlePaymentComplete}
      />
    </>
  );
};

export default TeacherModernCard;
