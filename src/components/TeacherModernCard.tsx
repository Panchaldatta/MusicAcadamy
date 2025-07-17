
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Clock, Calendar, Award, Users, Heart } from "lucide-react";
import { Teacher } from "@/hooks/useTeachers";

interface TeacherModernCardProps {
  teacher: Teacher;
  onBookLesson?: () => void;
}

const TeacherModernCard = ({ teacher, onBookLesson }: TeacherModernCardProps) => {
  return (
    <Card className="group overflow-hidden bg-white rounded-3xl shadow-lg border-0 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 relative">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 via-red-50/50 to-pink-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <CardContent className="relative p-8">
        <div className="flex gap-8 items-start">
          {/* Left side - Enhanced Teacher Image */}
          <div className="flex-shrink-0 relative">
            <div className="w-72 h-56 rounded-3xl overflow-hidden bg-gradient-to-br from-orange-400 via-red-500 to-pink-500 shadow-xl relative group/image">
              {teacher.image_url ? (
                <img
                  src={teacher.image_url}
                  alt={teacher.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover/image:scale-105"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-orange-400 via-red-500 to-pink-500 flex items-center justify-center relative">
                  <div className="text-7xl font-bold text-white drop-shadow-lg">
                    {teacher.name.charAt(0)}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
              )}
              
              {/* Verified badge overlay */}
              {teacher.verified && (
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
                  <Award className="h-5 w-5 text-yellow-500" />
                </div>
              )}
              
              {/* Floating heart icon */}
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer hover:bg-red-50">
                <Heart className="h-5 w-5 text-gray-600 hover:text-red-500 transition-colors" />
              </div>
            </div>
          </div>

          {/* Right side - Enhanced Teacher Info */}
          <div className="flex-1 space-y-7">
            {/* Subject Badge with improved styling */}
            <div className="flex items-center gap-3">
              <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-5 py-2 rounded-full text-sm font-semibold shadow-lg hover:shadow-xl transition-shadow">
                {teacher.subject}
              </Badge>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Users className="h-4 w-4" />
                <span>{teacher.reviews} students</span>
              </div>
            </div>

            {/* Teacher Name with enhanced typography */}
            <div>
              <h3 className="text-4xl font-bold text-gray-900 leading-tight mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-orange-600 group-hover:to-red-600 group-hover:bg-clip-text transition-all duration-300">
                {teacher.name}
              </h3>
              <p className="text-gray-600 text-lg">Music Teacher & Mentor</p>
            </div>

            {/* Enhanced Details with better visual hierarchy */}
            <div className="space-y-4">
              {/* Rating row with improved styling */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`h-5 w-5 transition-colors duration-200 ${i < Math.floor(teacher.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                    ))}
                  </div>
                  <span className="font-bold text-xl text-gray-900">{teacher.rating}</span>
                </div>
                <span className="text-gray-500 bg-gray-100 px-3 py-1 rounded-full text-sm">
                  {teacher.reviews} reviews
                </span>
              </div>
              
              {/* Info grid with consistent spacing */}
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center gap-3 text-gray-600 hover:text-gray-800 transition-colors">
                  <div className="bg-orange-100 p-2 rounded-full">
                    <MapPin className="h-4 w-4 text-orange-600" />
                  </div>
                  <span className="font-medium">{teacher.location}</span>
                </div>
                
                <div className="flex items-center gap-3 text-gray-600 hover:text-gray-800 transition-colors">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Clock className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="font-medium">{teacher.experience} experience</span>
                </div>

                <div className="flex items-center gap-3 text-gray-600 hover:text-gray-800 transition-colors">
                  <div className="bg-green-100 p-2 rounded-full">
                    <Calendar className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="font-medium">Response: {teacher.response_time}</span>
                </div>
              </div>
            </div>

            {/* Enhanced Price and Book Button section */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-100">
              <div className="space-y-1">
                <div className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  ₹{teacher.price}
                </div>
                <div className="text-sm text-gray-500 font-medium">per lesson</div>
              </div>
              
              <div className="flex gap-3">
                <Button 
                  variant="outline"
                  className="border-2 border-orange-200 text-orange-600 hover:bg-orange-50 px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:border-orange-300"
                >
                  VIEW PROFILE
                </Button>
                <Button 
                  onClick={onBookLesson}
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-3 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 relative overflow-hidden group/btn"
                >
                  <span className="relative z-10">BOOK LESSON</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TeacherModernCard;
