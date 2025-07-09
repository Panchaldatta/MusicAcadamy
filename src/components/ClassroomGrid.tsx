
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Users, Star, DollarSign, Heart, Calendar, Play } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface Classroom {
  id: string;
  name: string;
  description: string;
  subject: string;
  teacher: string;
  studentsCount: number;
  schedule: string;
  level: string;
  price: number;
  rating: number;
  image?: string;
}

interface ClassroomGridProps {
  classrooms: Classroom[];
}

const ClassroomGrid = ({ classrooms }: ClassroomGridProps) => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const { toast } = useToast();

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner':
        return 'bg-green-500 hover:bg-green-600';
      case 'intermediate':
        return 'bg-yellow-500 hover:bg-yellow-600';
      case 'advanced':
        return 'bg-red-500 hover:bg-red-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  const handleJoinClassroom = (classroomId: string, classroomName: string) => {
    toast({
      title: "Classroom Joined!",
      description: `You've successfully joined "${classroomName}". Check your email for further instructions.`,
    });
  };

  const toggleFavorite = (classroomId: string) => {
    setFavorites(prev => {
      const newFavorites = prev.includes(classroomId) 
        ? prev.filter(id => id !== classroomId)
        : [...prev, classroomId];
      
      toast({
        title: prev.includes(classroomId) ? "Removed from Favorites" : "Added to Favorites",
        description: prev.includes(classroomId) 
          ? "Classroom removed from your favorites" 
          : "Classroom added to your favorites",
      });
      
      return newFavorites;
    });
  };

  if (classrooms.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Calendar className="h-12 w-12 text-orange-600" />
        </div>
        <h3 className="text-2xl font-semibold text-gray-900 mb-4">No classrooms found</h3>
        <p className="text-gray-600 text-lg mb-8">Try adjusting your search criteria or filters to find the perfect classroom for you.</p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {classrooms.map((classroom) => (
        <Card key={classroom.id} className="group bg-white border-orange-200 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 rounded-xl overflow-hidden">
          <CardHeader className="pb-4">
            <div className="flex justify-between items-start mb-3">
              <Badge className={`${getLevelColor(classroom.level)} text-white transition-colors`}>
                {classroom.level}
              </Badge>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleFavorite(classroom.id)}
                  className={`p-2 rounded-full transition-colors ${
                    favorites.includes(classroom.id) 
                      ? 'text-red-500 hover:text-red-600' 
                      : 'text-gray-400 hover:text-red-500'
                  }`}
                >
                  <Heart className={`h-5 w-5 ${favorites.includes(classroom.id) ? 'fill-current' : ''}`} />
                </button>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-gray-900 text-sm font-medium">{classroom.rating}</span>
                </div>
              </div>
            </div>
            
            <CardTitle className="text-gray-900 text-xl group-hover:text-orange-600 transition-colors line-clamp-2">
              {classroom.name}
            </CardTitle>
            <CardDescription className="text-orange-600 font-medium text-lg">
              by {classroom.teacher}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <p className="text-gray-600 text-sm mb-6 line-clamp-3">{classroom.description}</p>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between text-gray-600 text-sm">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-500" />
                  <span>{classroom.studentsCount} students enrolled</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-green-500" />
                  <span className="font-semibold">₹{classroom.price}/month</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-gray-600 text-sm">
                <Clock className="h-4 w-4 text-purple-500" />
                <span>{classroom.schedule}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button 
                variant="outline"
                className="flex-1 border-orange-200 hover:bg-orange-50 rounded-lg"
              >
                <Play className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button 
                className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white rounded-lg"
                onClick={() => handleJoinClassroom(classroom.id, classroom.name)}
              >
                Join Now
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ClassroomGrid;
