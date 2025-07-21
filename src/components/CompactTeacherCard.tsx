
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Clock, CheckCircle, Heart, MessageCircle, Video } from "lucide-react";
import { useState } from "react";
import { Teacher } from "@/hooks/useTeachers";
import BookingDialog from "./BookingDialog";
import { useToast } from "@/hooks/use-toast";

interface CompactTeacherCardProps {
  teacher: Teacher;
}

const CompactTeacherCard = ({ teacher }: CompactTeacherCardProps) => {
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const { toast } = useToast();

  const handleBookingComplete = () => {
    toast({
      title: "Booking Confirmed! 🎉",
      description: "Your lesson has been successfully booked. You'll receive a confirmation email shortly.",
    });
  };

  const toggleFavorite = () => {
    setIsFavorite(prev => !prev);
    toast({
      title: isFavorite ? "Removed from Favorites" : "Added to Favorites ❤️",
      description: isFavorite 
        ? "Teacher removed from your favorites" 
        : "Teacher added to your favorites",
    });
  };

  const handleVideoCall = () => {
    toast({
      title: "Video Call Requested 📹",
      description: `Request sent to ${teacher.name} for a video consultation.`,
    });
  };

  const handleMessage = () => {
    toast({
      title: "Message Sent 💬",
      description: `Your message has been sent to ${teacher.name}.`,
    });
  };

  return (
    <>
      <Card className="group bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] rounded-xl overflow-hidden">
        <CardContent className="p-4">
          {/* Header */}
          <div className="flex items-start gap-3 mb-3">
            <div className="relative">
              {teacher.image_url ? (
                <img
                  src={teacher.image_url}
                  alt={teacher.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
                />
              ) : (
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md border-2 border-white">
                  {teacher.name.charAt(0)}
                </div>
              )}
              
              {teacher.verified && (
                <div className="absolute -bottom-1 -right-1">
                  <div className="bg-green-500 rounded-full p-1 border-2 border-white">
                    <CheckCircle className="h-3 w-3 text-white" />
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-bold text-lg text-gray-900 group-hover:text-orange-600 transition-colors truncate">
                  {teacher.name}
                </h3>
                <button
                  onClick={toggleFavorite}
                  className={`p-1 rounded-full transition-all duration-300 ${
                    isFavorite 
                      ? 'text-red-500 bg-red-50 scale-110' 
                      : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                  }`}
                >
                  <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
                </button>
              </div>
              
              <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs mb-2">
                {teacher.subject}
              </Badge>
              
              <div className="flex items-center gap-1 mb-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-3 w-3 ${i < Math.floor(teacher.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                  ))}
                </div>
                <span className="text-gray-900 text-xs font-bold ml-1">{teacher.rating}</span>
                <span className="text-gray-500 text-xs">({teacher.reviews})</span>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-gray-600 text-sm">
              <MapPin className="h-3 w-3" />
              <span className="truncate">{teacher.location}</span>
            </div>
            
            <div className="flex items-center gap-2 text-gray-600 text-sm">
              <Clock className="h-3 w-3" />
              <span>{teacher.experience}</span>
            </div>
          </div>

          {/* Price */}
          <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-3 rounded-lg mb-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xl font-bold">₹{teacher.price}</span>
                <span className="text-orange-100 ml-1 text-sm">/lesson</span>
              </div>
              <div className="text-xs text-orange-100">
                {teacher.response_time}
              </div>
            </div>
          </div>

          {/* Specialties */}
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {teacher.specialties.slice(0, 2).map((specialty, index) => (
                <Badge key={index} variant="outline" className="text-xs border-orange-200 text-orange-700 bg-orange-50">
                  {specialty}
                </Badge>
              ))}
              {teacher.specialties.length > 2 && (
                <Badge variant="outline" className="text-xs border-orange-200 text-orange-700 bg-orange-50">
                  +{teacher.specialties.length - 2}
                </Badge>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                className="flex-1 border-blue-200 hover:bg-blue-50 text-blue-600 rounded-lg text-xs"
                onClick={handleVideoCall}
              >
                <Video className="h-3 w-3 mr-1" />
                Video
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="flex-1 border-green-200 hover:bg-green-50 text-green-600 rounded-lg text-xs"
                onClick={handleMessage}
              >
                <MessageCircle className="h-3 w-3 mr-1" />
                Message
              </Button>
            </div>
            
            <Button 
              size="sm"
              className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white rounded-lg font-semibold"
              onClick={() => setShowBookingDialog(true)}
            >
              Book Lesson
            </Button>
          </div>
        </CardContent>
      </Card>

      <BookingDialog
        teacher={teacher}
        isOpen={showBookingDialog}
        onClose={() => setShowBookingDialog(false)}
        onBookingComplete={handleBookingComplete}
      />
    </>
  );
};

export default CompactTeacherCard;
