
import React, { useState } from 'react';
import { motion, useMotionValue, useTransform, PanInfo, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Clock, Users, Star, DollarSign, Heart, X, Play, Calendar, BookOpen, Award } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Database } from "@/integrations/supabase/types";

type Classroom = Database['public']['Tables']['classrooms']['Row'];

interface SwipeableClassroomCardProps {
  classroom: Classroom;
  onSwipeLeft: (classroom: Classroom) => void;
  onSwipeRight: (classroom: Classroom) => void;
  onJoin: (classroom: Classroom) => void;
}

const SwipeableClassroomCard: React.FC<SwipeableClassroomCardProps> = ({
  classroom,
  onSwipeLeft,
  onSwipeRight,
  onJoin
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const [dragDirection, setDragDirection] = useState<'left' | 'right' | null>(null);
  const { toast } = useToast();
  
  // Motion values for tracking drag
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Transform values for rotation and opacity based on drag
  const rotate = useTransform(x, [-200, 0, 200], [-15, 0, 15]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0.5, 0.8, 1, 0.8, 0.5]);
  const scale = useTransform(x, [-200, 0, 200], [0.95, 1, 0.95]);
  
  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner':
        return 'bg-gradient-to-r from-green-500 to-emerald-600 text-white';
      case 'intermediate':
        return 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white';
      case 'advanced':
        return 'bg-gradient-to-r from-red-500 to-pink-600 text-white';
      default:
        return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white';
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

  const getTeacherName = (subject: string) => {
    const teachers: Record<string, string> = {
      'Sitar': 'Ravi Sharma',
      'Tabla': 'Zakir Khan', 
      'Vocals': 'Asha Patel',
      'Flute': 'Hariprasad Das',
      'Harmonium': 'Shivkumar Singh',
      'Violin': 'Lalgudi Jayaraman',
      'Guitar': 'Vishwa Mohan',
      'Piano': 'Anil Kumar',
      'Drums': 'Taufiq Qureshi'
    };
    return teachers[subject] || 'Expert Teacher';
  };

  const getTeacherImage = (subject: string) => {
    // Using placeholder images that work well for teacher profiles
    const images: Record<string, string> = {
      'Sitar': 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=150&h=150&fit=crop&crop=face',
      'Tabla': 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=150&h=150&fit=crop&crop=face', 
      'Vocals': 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=150&h=150&fit=crop&crop=face',
      'Flute': 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=150&h=150&fit=crop&crop=face',
      'Harmonium': 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=150&h=150&fit=crop&crop=face',
      'Violin': 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=150&h=150&fit=crop&crop=face',
      'Guitar': 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=150&h=150&fit=crop&crop=face',
      'Piano': 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=150&h=150&fit=crop&crop=face',
      'Drums': 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=150&h=150&fit=crop&crop=face'
    };
    return images[subject] || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=150&h=150&fit=crop&crop=face';
  };

  const handleDragStart = () => {
    setDragDirection(null);
  };

  const handleDrag = (event: any, info: PanInfo) => {
    const threshold = 50;
    if (Math.abs(info.offset.x) > threshold) {
      setDragDirection(info.offset.x > 0 ? 'right' : 'left');
    } else {
      setDragDirection(null);
    }
  };

  const handleDragEnd = (event: any, info: PanInfo) => {
    const threshold = 100;
    const { offset, velocity } = info;
    
    if (Math.abs(offset.x) > threshold || Math.abs(velocity.x) > 500) {
      // Determine swipe direction
      const direction = offset.x > 0 ? 'right' : 'left';
      
      // Animate card off screen
      const exitX = direction === 'right' ? 1000 : -1000;
      
      // Set exiting state and animate
      setIsExiting(true);
      x.set(exitX);
      
      // Trigger callbacks after animation
      setTimeout(() => {
        if (direction === 'left') {
          onSwipeLeft(classroom);
        } else {
          onSwipeRight(classroom);
        }
        setIsVisible(false);
      }, 200);
    } else {
      // Snap back to center
      x.set(0);
      y.set(0);
      setDragDirection(null);
    }
  };

  const handleButtonSwipe = (direction: 'left' | 'right') => {
    const exitX = direction === 'right' ? 1000 : -1000;
    setIsExiting(true);
    x.set(exitX);
    
    setTimeout(() => {
      if (direction === 'left') {
        onSwipeLeft(classroom);
      } else {
        onSwipeRight(classroom);
      }
      setIsVisible(false);
    }, 200);
  };

  if (!isVisible) return null;

  return (
    <motion.div
      className="relative cursor-grab active:cursor-grabbing max-w-2xl mx-auto"
      style={{
        x,
        y,
        rotate,
        opacity,
        scale,
      }}
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.2}
      onDragStart={handleDragStart}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      whileTap={{ scale: 1.02 }}
      animate={{ 
        scale: isVisible && !isExiting ? 1 : 0,
        opacity: isVisible && !isExiting ? 1 : 0
      }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 30,
        scale: { duration: 0.2 },
        opacity: { duration: 0.2 }
      }}
    >
      <Card className="bg-white border-2 border-gray-200 shadow-2xl rounded-2xl overflow-hidden h-[400px] relative">
        {/* Gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/5 pointer-events-none z-10" />
        
        <div className="flex h-full relative z-20">
          {/* Left side - Teacher Image */}
          <div className="w-40 bg-gradient-to-br from-orange-100 to-red-100 flex flex-col items-center justify-center p-4">
            <Avatar className="w-24 h-24 mb-3 border-4 border-white shadow-lg">
              <AvatarImage 
                src={getTeacherImage(classroom.subject)} 
                alt={getTeacherName(classroom.subject)}
                className="object-cover"
              />
              <AvatarFallback className="text-lg font-bold bg-orange-200 text-orange-700">
                {getTeacherName(classroom.subject).split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <p className="text-sm font-semibold text-gray-700 text-center leading-tight">
              {getTeacherName(classroom.subject)}
            </p>
            <div className="flex items-center gap-1 mt-1">
              <Star className="h-3 w-3 text-yellow-500 fill-current" />
              <span className="text-xs text-gray-600 font-medium">4.8</span>
            </div>
          </div>

          {/* Right side - Content */}
          <div className="flex-1 flex flex-col">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <div className="text-2xl bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-sm">
                    {getSubjectIcon(classroom.subject)}
                  </div>
                  <Badge className={`${getLevelColor(classroom.level)} px-2 py-1 text-xs font-medium shadow-sm`}>
                    {classroom.level}
                  </Badge>
                </div>
              </div>
              
              <CardTitle className="text-gray-900 text-lg font-bold line-clamp-2 leading-tight">
                {classroom.name}
              </CardTitle>
              <p className="text-orange-600 font-semibold text-base">
                {classroom.subject} Class
              </p>
            </CardHeader>
            
            <CardContent className="flex flex-col justify-between flex-1 pb-4">
              <div className="space-y-3">
                <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
                  {classroom.description || `Master ${classroom.subject} with expert guidance and structured curriculum.`}
                </p>
                
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-blue-50 p-2 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-1 text-blue-700 mb-1">
                      <Users className="h-3 w-3" />
                      <span className="text-xs font-medium">Capacity</span>
                    </div>
                    <span className="text-sm font-bold text-blue-900">{classroom.capacity}</span>
                  </div>
                  
                  <div className="bg-green-50 p-2 rounded-lg border border-green-200">
                    <div className="flex items-center gap-1 text-green-700 mb-1">
                      <DollarSign className="h-3 w-3" />
                      <span className="text-xs font-medium">Price</span>
                    </div>
                    <span className="text-sm font-bold text-green-900">₹{classroom.price}</span>
                  </div>
                </div>

                <div className="bg-gray-50 p-2 rounded-lg border border-gray-200">
                  <div className="text-xs text-gray-600 space-y-1">
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3" />
                      <span>{classroom.schedule}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3" />
                      <span>{classroom.duration_weeks} weeks • {classroom.sessions_per_week}/week</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <Button 
                  className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white rounded-xl py-2 font-semibold text-sm shadow-lg transform transition-transform active:scale-95"
                  onClick={() => onJoin(classroom)}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Join Now
                </Button>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 border-2 border-red-200 hover:bg-red-50 hover:border-red-300 text-red-600 rounded-lg font-medium"
                    onClick={() => handleButtonSwipe('left')}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Pass
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 border-2 border-green-200 hover:bg-green-50 hover:border-green-300 text-green-600 rounded-lg font-medium"
                    onClick={() => handleButtonSwipe('right')}
                  >
                    <Heart className="h-4 w-4 mr-1" />
                    Like
                  </Button>
                </div>
              </div>
            </CardContent>
          </div>
        </div>
      </Card>

      {/* Enhanced Swipe Indicators */}
      <AnimatePresence>
        {dragDirection === 'right' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-30"
          >
            <div className="bg-green-500 text-white px-8 py-4 rounded-2xl font-bold text-2xl shadow-2xl border-4 border-white transform rotate-12">
              <Heart className="inline h-6 w-6 mr-2 fill-current" />
              LIKE
            </div>
          </motion.div>
        )}
        
        {dragDirection === 'left' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-30"
          >
            <div className="bg-red-500 text-white px-8 py-4 rounded-2xl font-bold text-2xl shadow-2xl border-4 border-white transform -rotate-12">
              <X className="inline h-6 w-6 mr-2" />
              PASS
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SwipeableClassroomCard;
