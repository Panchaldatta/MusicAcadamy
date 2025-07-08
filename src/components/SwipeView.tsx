
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Clock, Award, Shield, Heart, X, RotateCcw } from "lucide-react";
import { useTeachers } from "@/hooks/useTeachers";
import { useCreateSwipe, useUserSwipes } from "@/hooks/useUserSwipes";
import SwipeableCard from "./SwipeableCard";
import { useToast } from "@/hooks/use-toast";

const SwipeView = () => {
  const { data: teachers, isLoading } = useTeachers();
  const { data: userSwipes } = useUserSwipes();
  const createSwipe = useCreateSwipe();
  const { toast } = useToast();
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [availableTeachers, setAvailableTeachers] = useState<any[]>([]);

  // Filter out already swiped teachers
  useEffect(() => {
    if (teachers && teachers.length > 0) {
      const swipedTeacherIds = userSwipes?.map(swipe => swipe.teacher_id) || [];
      const unswipedTeachers = teachers.filter(teacher => !swipedTeacherIds.includes(teacher.id));
      setAvailableTeachers(unswipedTeachers);
      setCurrentIndex(0);
    }
  }, [teachers, userSwipes]);

  const handleSwipe = async (direction: 'left' | 'right') => {
    const currentTeacher = availableTeachers[currentIndex];
    if (!currentTeacher) return;

    try {
      await createSwipe.mutateAsync({
        teacher_id: currentTeacher.id,
        swipe_direction: direction,
      });

      if (direction === 'right') {
        toast({
          title: "Teacher Liked! ❤️",
          description: `You liked ${currentTeacher.name}. Check your swipe history to see all liked teachers.`,
        });
      }

      // Move to next teacher
      setCurrentIndex(prev => prev + 1);
    } catch (error) {
      console.error('Error saving swipe:', error);
      toast({
        title: "Error",
        description: "Failed to save your swipe. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUndo = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (!availableTeachers || availableTeachers.length === 0) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="text-center max-w-md mx-auto">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="h-8 w-8 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No More Teachers</h2>
          <p className="text-gray-600 mb-4">
            You've swiped on all available teachers! Check back later for new profiles.
          </p>
          <Button onClick={() => window.location.href = '/swipe-history'} className="bg-orange-600 hover:bg-orange-700">
            View Swipe History
          </Button>
        </div>
      </div>
    );
  }

  if (currentIndex >= availableTeachers.length) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="text-center max-w-md mx-auto">
          <div className="w-16 h-16 bg-green-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">All Done!</h2>
          <p className="text-gray-600 mb-4">
            You've swiped through all available teachers. Great job!
          </p>
          <Button onClick={() => window.location.href = '/swipe-history'} className="bg-orange-600 hover:bg-orange-700">
            View Your Matches
          </Button>
        </div>
      </div>
    );
  }

  const teacher = availableTeachers[currentIndex];

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Your Perfect Teacher</h1>
        <p className="text-gray-600">
          {availableTeachers.length - currentIndex} teachers remaining
        </p>
      </div>

      <div className="max-w-md mx-auto">
        <SwipeableCard
          key={teacher.id}
          onSwipeLeft={() => handleSwipe('left')}
          onSwipeRight={() => handleSwipe('right')}
          className="w-full"
        >
          <Card className="w-full overflow-hidden shadow-xl">
            <CardContent className="p-0">
              {/* Teacher Image */}
              <div className="relative">
                <img
                  src={teacher.image_url || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&crop=face"}
                  alt={teacher.name}
                  className="w-full h-80 object-cover"
                />
                
                {teacher.verified && (
                  <Badge className="absolute top-4 right-4 bg-green-500 text-white">
                    <Shield className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                )}
                
                {/* Price */}
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm text-orange-600 px-3 py-2 rounded-full text-lg font-bold">
                  ₹{teacher.price}/hr
                </div>
              </div>

              {/* Teacher Info */}
              <div className="p-6">
                <div className="mb-4">
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">
                    {teacher.name}
                  </h2>
                  <p className="text-orange-600 font-semibold text-xl">
                    {teacher.subject}
                  </p>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`h-5 w-5 ${i < Math.floor(teacher.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                    ))}
                  </div>
                  <span className="font-bold text-lg">{teacher.rating}</span>
                  <span className="text-gray-500">({teacher.reviews} reviews)</span>
                </div>

                {/* Details */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-3 text-gray-600">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    <span>{teacher.location}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <Clock className="h-5 w-5 text-green-600" />
                    <span>Responds in {teacher.response_time}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <Award className="h-5 w-5 text-purple-600" />
                    <span>{teacher.experience} of experience</span>
                  </div>
                </div>

                {/* Languages */}
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Languages:</p>
                  <div className="flex flex-wrap gap-2">
                    {teacher.languages?.map((lang, idx) => (
                      <Badge key={idx} variant="outline" className="text-sm">
                        {lang}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Specialties */}
                <div className="mb-6">
                  <p className="text-sm font-medium text-gray-700 mb-2">Specialties:</p>
                  <div className="flex flex-wrap gap-2">
                    {teacher.specialties?.map((specialty, idx) => (
                      <Badge key={idx} variant="secondary" className="text-sm">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </SwipeableCard>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mt-6">
          <Button
            variant="outline"
            size="lg"
            onClick={() => handleSwipe('left')}
            className="w-16 h-16 rounded-full border-red-500 text-red-500 hover:bg-red-50"
          >
            <X className="h-8 w-8" />
          </Button>
          
          {currentIndex > 0 && (
            <Button
              variant="outline"
              size="lg"
              onClick={handleUndo}
              className="w-16 h-16 rounded-full border-gray-400 text-gray-600 hover:bg-gray-50"
            >
              <RotateCcw className="h-6 w-6" />
            </Button>
          )}
          
          <Button
            variant="outline"
            size="lg"
            onClick={() => handleSwipe('right')}
            className="w-16 h-16 rounded-full border-green-500 text-green-500 hover:bg-green-50"
          >
            <Heart className="h-8 w-8" />
          </Button>
        </div>

        <p className="text-center text-gray-500 text-sm mt-4">
          Swipe right to like • Swipe left to pass
        </p>
      </div>
    </div>
  );
};

export default SwipeView;
