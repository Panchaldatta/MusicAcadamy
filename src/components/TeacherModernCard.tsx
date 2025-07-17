
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Clock, Calendar } from "lucide-react";
import { Teacher } from "@/hooks/useTeachers";

interface TeacherModernCardProps {
  teacher: Teacher;
  onBookLesson?: () => void;
}

const TeacherModernCard = ({ teacher, onBookLesson }: TeacherModernCardProps) => {
  return (
    <Card className="overflow-hidden bg-white rounded-3xl shadow-xl border-0 hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]">
      <CardContent className="p-8">
        <div className="flex gap-8 items-start">
          {/* Left side - Teacher Image */}
          <div className="flex-shrink-0">
            <div className="w-64 h-48 rounded-2xl overflow-hidden bg-gradient-to-br from-orange-400 via-red-500 to-pink-500 shadow-lg">
              {teacher.image_url ? (
                <img
                  src={teacher.image_url}
                  alt={teacher.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-orange-400 via-red-500 to-pink-500 flex items-center justify-center">
                  <div className="text-6xl font-bold text-white">
                    {teacher.name.charAt(0)}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right side - Teacher Info */}
          <div className="flex-1 space-y-6">
            {/* Subject Badge */}
            <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
              {teacher.subject}
            </Badge>

            {/* Teacher Name */}
            <h3 className="text-3xl font-bold text-gray-900 leading-tight">
              {teacher.name}
            </h3>

            {/* Details */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-600">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < Math.floor(teacher.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                  ))}
                </div>
                <span className="font-bold text-gray-900">{teacher.rating}</span>
                <span className="text-gray-500">({teacher.reviews} reviews)</span>
              </div>
              
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>{teacher.location}</span>
              </div>
              
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="h-4 w-4" />
                <span>{teacher.experience} experience</span>
              </div>

              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>Response time: {teacher.response_time}</span>
              </div>
            </div>

            {/* Price and Book Button */}
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-gray-900">
                ₹{teacher.price}
                <span className="text-lg text-gray-500 font-normal">/lesson</span>
              </div>
              
              <Button 
                onClick={onBookLesson}
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-3 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                BOOK LESSON
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TeacherModernCard;
