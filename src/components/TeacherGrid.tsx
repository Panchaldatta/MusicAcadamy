
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Clock, CheckCircle, Heart, MessageCircle, Video, Calendar } from "lucide-react";
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
      <div className="text-center py-16">
        <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Star className="h-12 w-12 text-orange-600" />
        </div>
        <h3 className="text-2xl font-semibold text-gray-900 mb-4">No teachers found</h3>
        <p className="text-gray-600 text-lg mb-8">Try adjusting your search criteria or filters to find the perfect teacher for you.</p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {teachers.map((teacher) => (
        <Card key={teacher.id} className="group bg-white border-orange-200 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 rounded-xl overflow-hidden">
          <CardHeader className="pb-4">
            <div className="flex items-start gap-4 mb-4">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                  {teacher.name.charAt(0)}
                </div>
                {teacher.verified && (
                  <div className="absolute -bottom-1 -right-1">
                    <CheckCircle className="h-6 w-6 text-green-500 bg-white rounded-full" />
                  </div>
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-lg text-gray-900 group-hover:text-orange-600 transition-colors">
                    {teacher.name}
                  </h3>
                  <button
                    onClick={() => toggleFavorite(teacher.id)}
                    className={`p-2 rounded-full transition-colors ${
                      favorites.includes(teacher.id) 
                        ? 'text-red-500 hover:text-red-600' 
                        : 'text-gray-400 hover:text-red-500'
                    }`}
                  >
                    <Heart className={`h-5 w-5 ${favorites.includes(teacher.id) ? 'fill-current' : ''}`} />
                  </button>
                </div>
                
                <p className="text-orange-600 font-semibold text-lg mb-2">{teacher.subject}</p>
                
                <div className="flex items-center gap-1 mb-2">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-gray-900 text-sm font-medium">{teacher.rating}</span>
                  <span className="text-gray-500 text-sm">({teacher.reviews} reviews)</span>
                </div>
                
                <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200 text-xs">
                  {teacher.experience}
                </Badge>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2 text-gray-600 text-sm">
                <MapPin className="h-4 w-4 text-blue-500" />
                <span>{teacher.location}</span>
              </div>
              
              <div className="flex items-center gap-2 text-gray-600 text-sm">
                <Clock className="h-4 w-4 text-purple-500" />
                <span>Responds in {teacher.response_time}</span>
              </div>
              
              <div className="flex items-center gap-2 text-gray-600 text-sm">
                <span className="text-2xl font-bold text-gray-900">₹{teacher.price}</span>
                <span>/lesson</span>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-sm font-medium text-gray-900 mb-2">Specialties:</p>
              <div className="flex flex-wrap gap-1">
                {teacher.specialties.slice(0, 3).map((specialty, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {specialty}
                  </Badge>
                ))}
                {teacher.specialties.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{teacher.specialties.length - 3} more
                  </Badge>
                )}
              </div>
            </div>

            <div className="mb-6">
              <p className="text-sm font-medium text-gray-900 mb-2">Languages:</p>
              <div className="flex flex-wrap gap-1">
                {teacher.languages.map((language, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {language}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                className="flex-1 border-orange-200 hover:bg-orange-50 rounded-lg"
                onClick={() => handleVideoCall(teacher.id, teacher.name)}
              >
                <Video className="h-4 w-4 mr-1" />
                Video Call
              </Button>
              <Button 
                size="sm"
                className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white rounded-lg"
                onClick={() => handleBookLesson(teacher.id, teacher.name)}
              >
                <Calendar className="h-4 w-4 mr-1" />
                Book Lesson
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default TeacherGrid;
