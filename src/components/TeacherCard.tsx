
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Clock, Award, Shield, Heart, MessageCircle } from "lucide-react";
import { Teacher } from "@/hooks/useTeachers";

interface TeacherCardProps {
  teacher: Teacher;
}

const TeacherCard = ({ teacher }: TeacherCardProps) => {
  return (
    <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer group h-full">
      <CardContent className="p-0 flex flex-col h-full">
        {/* Teacher Image */}
        <div className="relative">
          <img
            src={teacher.image_url || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"}
            alt={teacher.name}
            className="w-full h-40 sm:h-44 md:h-48 object-cover rounded-t-lg"
          />
          {teacher.verified && (
            <Badge className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-green-500 text-white text-xs">
              <Shield className="h-2 w-2 sm:h-3 sm:w-3 mr-1" />
              Verified
            </Badge>
          )}
          <div className="absolute bottom-2 left-2 right-2 sm:bottom-3 sm:left-3 sm:right-3 flex gap-1 sm:gap-2">
            {teacher.specialties.slice(0, 2).map((specialty, idx) => (
              <Badge key={idx} variant="secondary" className="text-[10px] sm:text-xs bg-white/90 text-gray-700">
                {specialty}
              </Badge>
            ))}
          </div>
        </div>

        {/* Teacher Info */}
        <div className="p-4 sm:p-5 flex flex-col flex-grow">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-base sm:text-lg text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
              {teacher.name}
            </h3>
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-red-500 p-1 flex-shrink-0">
              <Heart className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>

          <p className="text-blue-600 font-medium mb-2 sm:mb-3 text-sm sm:text-base">{teacher.subject}</p>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-2 sm:mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`h-3 w-3 sm:h-4 sm:w-4 ${i < Math.floor(teacher.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
              ))}
            </div>
            <span className="font-semibold text-xs sm:text-sm">{teacher.rating}</span>
            <span className="text-gray-500 text-xs sm:text-sm">({teacher.reviews})</span>
          </div>

          {/* Details */}
          <div className="space-y-1.5 sm:space-y-2 mb-3 sm:mb-4">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
              <MapPin className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
              <span className="line-clamp-1">{teacher.location}</span>
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
              <Clock className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
              <span className="line-clamp-1">Responds in {teacher.response_time}</span>
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
              <Award className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
              <span className="line-clamp-1">{teacher.experience}</span>
            </div>
          </div>

          {/* Languages */}
          <div className="flex flex-wrap gap-1 mb-3 sm:mb-4">
            {teacher.languages.map((lang, idx) => (
              <Badge key={idx} variant="outline" className="text-[10px] sm:text-xs">
                {lang}
              </Badge>
            ))}
          </div>

          {/* Price and CTA */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 mt-auto">
            <div>
              <span className="text-xl sm:text-2xl font-bold text-gray-900">₹{teacher.price}</span>
              <span className="text-gray-500 text-sm sm:text-base">/hour</span>
            </div>
            <Button variant="outline" size="sm" className="text-blue-600 border-blue-600 hover:bg-blue-50 text-xs sm:text-sm w-full sm:w-auto">
              <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              Message
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TeacherCard;
