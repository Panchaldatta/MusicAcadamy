
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Clock, CheckCircle, Heart, MessageCircle, Video, Calendar, Award } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Teacher } from "@/hooks/useTeachers";

interface TeacherGridProps {
  teachers: Teacher[];
}

const TeacherGrid = ({ teachers }: TeacherGridProps) => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const { toast } = useToast();

  const handleBookLesson = (teacherId: string, teacherName: string) => {
    toast({
      title: "Lesson Booked!",
      description: `You've successfully booked a lesson with ${teacherName}. Check your email for confirmation.`,
    });
  };

  const toggleFavorite = (teacherId: string) => {
    setFavorites(prev => {
      const newFavorites = prev.includes(teacherId) 
        ? prev.filter(id => id !== teacherId)
        : [...prev, teacherId];
      
      toast({
        title: prev.includes(teacherId) ? "Removed from Favorites" : "Added to Favorites",
        description: prev.includes(teacherId) 
          ? "Teacher removed from your favorites" 
          : "Teacher added to your favorites",
      });
      
      return newFavorites;
    });
  };

  const handleVideoCall = (teacherId: string, teacherName: string) => {
    toast({
      title: "Video Call Requested",
      description: `Request sent to ${teacherName} for a video consultation.`,
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
          Try adjusting your search criteria or filters to find the perfect teacher for your musical journey.
        </p>
        <div className="flex flex-wrap gap-2 justify-center">
          <Badge variant="outline" className="text-sm">Try different subjects</Badge>
          <Badge variant="outline" className="text-sm">Expand location search</Badge>
          <Badge variant="outline" className="text-sm">Adjust price range</Badge>
        </div>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {teachers.map((teacher) => (
        <Card key={teacher.id} className="group bg-white/90 backdrop-blur-sm border-0 hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02] rounded-2xl overflow-hidden relative">
          {/* Gradient Border Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl -z-10"></div>
          <div className="absolute inset-[1px] bg-white rounded-2xl"></div>
          
          <CardHeader className="pb-4 relative">
            <div className="flex items-start gap-4 mb-4">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center text-white font-bold text-3xl shadow-lg">
                  {teacher.name.charAt(0)}
                </div>
                {teacher.verified && (
                  <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 shadow-lg">
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  </div>
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-xl text-gray-900 group-hover:text-orange-600 transition-colors mb-1">
                      {teacher.name}
                    </h3>
                    <p className="text-orange-600 font-semibold text-lg">{teacher.subject}</p>
                  </div>
                  <button
                    onClick={() => toggleFavorite(teacher.id)}
                    className={`p-2 rounded-full transition-all duration-300 ${
                      favorites.includes(teacher.id) 
                        ? 'text-red-500 bg-red-50 hover:bg-red-100' 
                        : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                    }`}
                  >
                    <Heart className={`h-5 w-5 ${favorites.includes(teacher.id) ? 'fill-current' : ''}`} />
                  </button>
                </div>
                
                <div className="flex items-center gap-1 mb-3">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`h-4 w-4 ${i < Math.floor(teacher.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                    ))}
                  </div>
                  <span className="text-gray-900 text-sm font-semibold ml-1">{teacher.rating}</span>
                  <span className="text-gray-500 text-sm">({teacher.reviews})</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200 text-xs font-medium">
                    <Award className="h-3 w-3 mr-1" />
                    {teacher.experience}
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="relative">
            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3 text-gray-600 text-sm">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <MapPin className="h-4 w-4 text-blue-600" />
                </div>
                <span className="font-medium">{teacher.location}</span>
              </div>
              
              <div className="flex items-center gap-3 text-gray-600 text-sm">
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                  <Clock className="h-4 w-4 text-purple-600" />
                </div>
                <span>Responds in {teacher.response_time}</span>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-green-600 font-bold text-sm">₹</span>
                </div>
                <div>
                  <span className="text-2xl font-bold text-gray-900">₹{teacher.price}</span>
                  <span className="text-gray-500 ml-1">/lesson</span>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-sm font-semibold text-gray-900 mb-3">Specializations:</p>
              <div className="flex flex-wrap gap-2">
                {teacher.specialties.slice(0, 3).map((specialty, index) => (
                  <Badge key={index} variant="outline" className="text-xs border-orange-200 hover:bg-orange-50">
                    {specialty}
                  </Badge>
                ))}
                {teacher.specialties.length > 3 && (
                  <Badge variant="outline" className="text-xs border-gray-200 hover:bg-gray-50">
                    +{teacher.specialties.length - 3} more
                  </Badge>
                )}
              </div>
            </div>

            <div className="mb-6">
              <p className="text-sm font-semibold text-gray-900 mb-3">Languages:</p>
              <div className="flex flex-wrap gap-2">
                {teacher.languages.map((language, index) => (
                  <Badge key={index} variant="secondary" className="text-xs bg-gray-100 text-gray-700 hover:bg-gray-200">
                    {language}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                size="sm"
                className="border-orange-200 hover:bg-orange-50 hover:border-orange-300 rounded-xl transition-all duration-300"
                onClick={() => handleVideoCall(teacher.id, teacher.name)}
              >
                <Video className="h-4 w-4 mr-2" />
                Video Call
              </Button>
              <Button 
                size="sm"
                className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => handleBookLesson(teacher.id, teacher.name)}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Book Now
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default TeacherGrid;
