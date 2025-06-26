
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
    <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer group">
      <CardContent className="p-0">
        {/* Teacher Image */}
        <div className="relative">
          <img
            src={teacher.image_url || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"}
            alt={teacher.name}
            className="w-full h-48 object-cover rounded-t-lg"
          />
          {teacher.verified && (
            <Badge className="absolute top-3 right-3 bg-green-500 text-white">
              <Shield className="h-3 w-3 mr-1" />
              Verified
            </Badge>
          )}
          <div className="absolute bottom-3 left-3 right-3 flex gap-2">
            {teacher.specialties.slice(0, 2).map((specialty, idx) => (
              <Badge key={idx} variant="secondary" className="text-xs bg-white/90 text-gray-700">
                {specialty}
              </Badge>
            ))}
          </div>
        </div>

        {/* Teacher Info */}
        <div className="p-5">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
              {teacher.name}
            </h3>
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-red-500 p-1">
              <Heart className="h-4 w-4" />
            </Button>
          </div>

          <p className="text-blue-600 font-medium mb-3">{teacher.subject}</p>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`h-4 w-4 ${i < Math.floor(teacher.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
              ))}
            </div>
            <span className="font-semibold text-sm">{teacher.rating}</span>
            <span className="text-gray-500 text-sm">({teacher.reviews} reviews)</span>
          </div>

          {/* Details */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4" />
              {teacher.location}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              Responds in {teacher.response_time}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Award className="h-4 w-4" />
              {teacher.experience} of experience
            </div>
          </div>

          {/* Languages */}
          <div className="flex gap-1 mb-4">
            {teacher.languages.map((lang, idx) => (
              <Badge key={idx} variant="outline" className="text-xs">
                {lang}
              </Badge>
            ))}
          </div>

          {/* Price and CTA */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-2xl font-bold text-gray-900">₹{teacher.price}</span>
              <span className="text-gray-500">/hour</span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="text-blue-600 border-blue-600 hover:bg-blue-50">
                <MessageCircle className="h-4 w-4 mr-1" />
                Message
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TeacherCard;
