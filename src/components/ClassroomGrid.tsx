import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Users, Star, DollarSign, Heart, Calendar, Play } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import type { Database } from "@/integrations/supabase/types";
import SwipeableClassroomView from './SwipeableClassroomView';

type Classroom = Database['public']['Tables']['classrooms']['Row'];

interface ClassroomGridProps {
  classrooms: Classroom[];
}

const ClassroomGrid = ({ classrooms }: ClassroomGridProps) => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [viewMode, setViewMode<'grid' | 'swipe'>>('grid');
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

  const getSubjectIcon = (subject: string) => {
    const icons: Record<string, string> = {
      'Sitar': '🎸',
      'Tabla': '🥁', 
      'Vocals': '🎤',
      'Flute': '🎵',
      'Harmonium': '🎹',
      'Violin': '🎻',
      'Guitar': '🎸',
      'Piano': '🎹',
      'Drums': '🥁'
    };
    return icons[subject] || '🎵';
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

  return (
    <div className="space-y-6">
      {/* View Mode Toggle */}
      <div className="flex justify-center">
        <div className="bg-white rounded-lg p-1 shadow-sm border">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('grid')}
            className="text-sm"
          >
            Grid View
          </Button>
          <Button
            variant={viewMode === 'swipe' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('swipe')}
            className="text-sm"
          >
            Swipe View
          </Button>
        </div>
      </div>

      {viewMode === 'swipe' ? (
        <SwipeableClassroomView classrooms={classrooms} />
      ) : (
        <>
          {classrooms.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar className="h-12 w-12 text-orange-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">No classrooms found</h3>
              <p className="text-gray-600 text-lg mb-8">Try adjusting your search criteria or filters to find the perfect classroom for you.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {classrooms.map((classroom) => (
                <Card key={classroom.id} className="group bg-white border-orange-200 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 rounded-xl overflow-hidden">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{getSubjectIcon(classroom.subject)}</span>
                        <Badge className={`${getLevelColor(classroom.level)} text-white transition-colors`}>
                          {classroom.level}
                        </Badge>
                      </div>
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
                          <span className="text-gray-900 text-sm font-medium">4.8</span>
                        </div>
                      </div>
                    </div>
                    
                    <CardTitle className="text-gray-900 text-xl group-hover:text-orange-600 transition-colors line-clamp-2">
                      {classroom.name}
                    </CardTitle>
                    <CardDescription className="text-orange-600 font-medium text-lg">
                      {classroom.subject} Class
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-gray-600 text-sm mb-6 line-clamp-3">{classroom.description || `Learn ${classroom.subject} with expert guidance and structured curriculum.`}</p>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center justify-between text-gray-600 text-sm">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-blue-500" />
                          <span>{classroom.capacity} max students</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-green-500" />
                          <span className="font-semibold">₹{classroom.price}/session</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <Clock className="h-4 w-4 text-purple-500" />
                        <span>{classroom.schedule}</span>
                      </div>

                      <div className="text-xs text-gray-500 space-y-1">
                        <div>Duration: {classroom.duration_weeks} weeks</div>
                        <div>Sessions: {classroom.sessions_per_week}/week, {classroom.session_duration_minutes}min each</div>
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
          )}
        </>
      )}
    </div>
  );
};

export default ClassroomGrid;
