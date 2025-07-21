
import React, { useState } from 'react';
import { Heart, X, Star, MapPin, Clock, Languages, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTeachers } from '@/hooks/useTeachers';
import { useCreateSwipe } from '@/hooks/useUserSwipes';
import { useToast } from '@/hooks/use-toast';

const TeacherSwipeCards = () => {
  const { data: teachers = [], isLoading } = useTeachers();
  const createSwipe = useCreateSwipe();
  const { toast } = useToast();
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleSwipe = async (direction: 'left' | 'right') => {
    if (!teachers[currentIndex]) return;

    try {
      await createSwipe.mutateAsync({
        teacher_id: teachers[currentIndex].id,
        swipe_direction: direction
      });

      toast({
        title: direction === 'right' ? "Teacher Liked!" : "Teacher Passed",
        description: direction === 'right' 
          ? `You liked ${teachers[currentIndex].name}. They'll be notified!`
          : `You passed on ${teachers[currentIndex].name}.`,
      });

      setCurrentIndex(prev => prev + 1);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save your choice. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-400"></div>
      </div>
    );
  }

  if (!teachers.length || currentIndex >= teachers.length) {
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Heart className="h-12 w-12 text-orange-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No more teachers!</h3>
        <p className="text-gray-600">You've seen all available teachers. Check back later for new additions!</p>
      </div>
    );
  }

  const currentTeacher = teachers[currentIndex];

  return (
    <div className="max-w-sm mx-auto">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
        {/* Teacher Image */}
        <div className="relative h-80 bg-gradient-to-br from-orange-100 to-red-100">
          {currentTeacher.image_url ? (
            <img 
              src={currentTeacher.image_url} 
              alt={currentTeacher.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-6xl text-orange-600">🎼</div>
            </div>
          )}
          
          {/* Verified Badge */}
          {currentTeacher.verified && (
            <div className="absolute top-4 right-4">
              <Badge className="bg-green-500 text-white">
                <Award className="h-3 w-3 mr-1" />
                Verified
              </Badge>
            </div>
          )}
        </div>

        {/* Teacher Info */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-2xl font-bold text-gray-900">{currentTeacher.name}</h3>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="text-gray-900 font-medium">{currentTeacher.rating}</span>
              <span className="text-gray-500 text-sm">({currentTeacher.reviews})</span>
            </div>
          </div>

          <p className="text-orange-600 font-semibold text-lg mb-4">{currentTeacher.subject}</p>

          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="h-4 w-4" />
              <span className="text-sm">{currentTeacher.location}</span>
            </div>
            
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="h-4 w-4" />
              <span className="text-sm">Responds in {currentTeacher.response_time}</span>
            </div>
            
            <div className="flex items-center gap-2 text-gray-600">
              <Languages className="h-4 w-4" />
              <span className="text-sm">{currentTeacher.languages.join(', ')}</span>
            </div>
          </div>

          {/* Specialties */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {currentTeacher.specialties.map((specialty, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {specialty}
                </Badge>
              ))}
            </div>
          </div>

          {/* Price and Experience */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <p className="text-2xl font-bold text-gray-900">₹{currentTeacher.price}</p>
              <p className="text-gray-500 text-sm">per session</p>
            </div>
            <div className="text-right">
              <p className="text-gray-900 font-medium">{currentTeacher.experience}</p>
              <p className="text-gray-500 text-sm">experience</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              variant="outline"
              size="lg"
              className="flex-1 border-red-200 hover:bg-red-50 hover:border-red-300"
              onClick={() => handleSwipe('left')}
              disabled={createSwipe.isPending}
            >
              <X className="h-5 w-5 text-red-500 mr-2" />
              Pass
            </Button>
            
            <Button
              size="lg"
              className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
              onClick={() => handleSwipe('right')}
              disabled={createSwipe.isPending}
            >
              <Heart className="h-5 w-5 mr-2" />
              Like
            </Button>
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="mt-4 text-center">
        <p className="text-gray-500 text-sm">
          {currentIndex + 1} of {teachers.length} teachers
        </p>
      </div>
    </div>
  );
};

export default TeacherSwipeCards;
