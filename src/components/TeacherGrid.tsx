
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Clock, CheckCircle, Heart, MessageCircle, Video, Calendar, Award, Users, Zap } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Teacher } from "@/hooks/useTeachers";

interface TeacherGridProps {
  teachers: Teacher[];
}

const TeacherGrid = ({ teachers }: TeacherGridProps) => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [bookingLoading, setBookingLoading] = useState<string | null>(null);
  const { toast } = useToast();

  const handleBookLesson = async (teacherId: string, teacherName: string) => {
    setBookingLoading(teacherId);
    
    // Simulate booking process
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setBookingLoading(null);
    toast({
      title: "Lesson Booked Successfully! 🎉",
      description: `Your lesson with ${teacherName} has been confirmed. Check your email for details.`,
    });
  };

  const toggleFavorite = (teacherId: string) => {
    setFavorites(prev => {
      const newFavorites = prev.includes(teacherId) 
        ? prev.filter(id => id !== teacherId)
        : [...prev, teacherId];
      
      toast({
        title: prev.includes(teacherId) ? "Removed from Favorites" : "Added to Favorites ❤️",
        description: prev.includes(teacherId) 
          ? "Teacher removed from your favorites" 
          : "Teacher added to your favorites",
      });
      
      return newFavorites;
    });
  };

  const handleVideoCall = (teacherId: string, teacherName: string) => {
    toast({
      title: "Video Call Requested 📹",
      description: `Request sent to ${teacherName} for a video consultation. They'll contact you soon!`,
    });
  };

  const handleMessage = (teacherId: string, teacherName: string) => {
    toast({
      title: "Message Sent 💬",
      description: `Your message has been sent to ${teacherName}. They'll respond shortly!`,
    });
  };

  if (teachers.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-32 h-32 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center mx-auto mb-8">
          <Star className="h-16 w-16 text-orange-600" />
        </div>
        <h3 className="text-3xl font-bold text-gray-900 mb-4">No teachers found</h3>
        <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
          Try adjusting your search criteria or filters to discover amazing music teachers perfect for your learning journey.
        </p>
        <Button className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700">
          Clear All Filters
        </Button>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {teachers.map((teacher) => (
        <Card key={teacher.id} className="group bg-white border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02] rounded-2xl overflow-hidden relative">
          {/* Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 opacity-60"></div>
          
          <CardHeader className="relative pb-4 pt-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="relative">
                {teacher.image_url ? (
                  <img
                    src={teacher.image_url}
                    alt={teacher.name}
                    className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                ) : (
                  <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg border-4 border-white">
                    {teacher.name.charAt(0)}
                  </div>
                )}
                
                {teacher.verified && (
                  <div className="absolute -bottom-1 -right-1">
                    <div className="bg-green-500 rounded-full p-1 border-2 border-white">
                      <CheckCircle className="h-4 w-4 text-white" />
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-xl text-gray-900 group-hover:text-orange-600 transition-colors leading-tight">
                    {teacher.name}
                  </h3>
                  <button
                    onClick={() => toggleFavorite(teacher.id)}
                    className={`p-2 rounded-full transition-all duration-300 ${
                      favorites.includes(teacher.id) 
                        ? 'text-red-500 bg-red-50 scale-110' 
                        : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                    }`}
                  >
                    <Heart className={`h-5 w-5 ${favorites.includes(teacher.id) ? 'fill-current' : ''}`} />
                  </button>
                </div>
                
                <div className="flex items-center gap-2 mb-3">
                  <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 text-sm font-medium px-3 py-1">
                    {teacher.subject}
                  </Badge>
                  {teacher.verified && (
                    <Badge className="bg-green-100 text-green-800 text-xs">
                      <Award className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center gap-1 mb-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`h-4 w-4 ${i < Math.floor(teacher.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                    ))}
                  </div>
                  <span className="text-gray-900 text-sm font-bold ml-1">{teacher.rating}</span>
                  <span className="text-gray-500 text-sm">({teacher.reviews} reviews)</span>
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="relative">
            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3 text-gray-700">
                <div className="p-2 bg-blue-50 rounded-full">
                  <MapPin className="h-4 w-4 text-blue-600" />
                </div>
                <span className="text-sm font-medium">{teacher.location}</span>
              </div>
              
              <div className="flex items-center gap-3 text-gray-700">
                <div className="p-2 bg-purple-50 rounded-full">
                  <Clock className="h-4 w-4 text-purple-600" />
                </div>
                <span className="text-sm font-medium">Responds in {teacher.response_time}</span>
              </div>
              
              <div className="flex items-center gap-3 text-gray-700">
                <div className="p-2 bg-green-50 rounded-full">
                  <Users className="h-4 w-4 text-green-600" />
                </div>
                <span className="text-sm font-medium">{teacher.experience}</span>
              </div>
              
              <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-3xl font-bold">₹{teacher.price}</span>
                    <span className="text-orange-100 ml-2">/lesson</span>
                  </div>
                  <div className="p-2 bg-white/20 rounded-full">
                    <Zap className="h-5 w-5" />
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-sm font-semibold text-gray-900 mb-3">Specialties:</p>
              <div className="flex flex-wrap gap-2">
                {teacher.specialties.slice(0, 3).map((specialty, index) => (
                  <Badge key={index} variant="outline" className="text-xs border-orange-200 text-orange-700 bg-orange-50 hover:bg-orange-100">
                    {specialty}
                  </Badge>
                ))}
                {teacher.specialties.length > 3 && (
                  <Badge variant="outline" className="text-xs border-orange-200 text-orange-700 bg-orange-50">
                    +{teacher.specialties.length - 3} more
                  </Badge>
                )}
              </div>
            </div>

            <div className="mb-6">
              <p className="text-sm font-semibold text-gray-900 mb-3">Languages:</p>
              <div className="flex flex-wrap gap-2">
                {teacher.languages.map((language, index) => (
                  <Badge key={index} variant="outline" className="text-xs border-gray-200 text-gray-600 bg-gray-50">
                    {language}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex-1 border-blue-200 hover:bg-blue-50 text-blue-600 rounded-xl transition-all duration-300"
                  onClick={() => handleVideoCall(teacher.id, teacher.name)}
                >
                  <Video className="h-4 w-4 mr-2" />
                  Video Call
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex-1 border-green-200 hover:bg-green-50 text-green-600 rounded-xl transition-all duration-300"
                  onClick={() => handleMessage(teacher.id, teacher.name)}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Message
                </Button>
              </div>
              
              <Button 
                size="lg"
                className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white rounded-xl font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => handleBookLesson(teacher.id, teacher.name)}
                disabled={bookingLoading === teacher.id}
              >
                {bookingLoading === teacher.id ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Booking...
                  </div>
                ) : (
                  <>
                    <Calendar className="h-5 w-5 mr-2" />
                    Book Lesson Now
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default TeacherGrid;
