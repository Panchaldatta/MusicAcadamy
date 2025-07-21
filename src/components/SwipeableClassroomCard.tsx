
import React, { useState } from 'react';
import { motion, useMotionValue, useTransform, PanInfo, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Users, Star, DollarSign, Heart, X, Play, Calendar, BookOpen } from "lucide-react";
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
        return 'bg-green-500 text-white';
      case 'intermediate':
        return 'bg-yellow-500 text-white';
      case 'advanced':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
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
      className="relative cursor-grab active:cursor-grabbing max-w-sm mx-auto"
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
      <Card className="bg-white border border-gray-200 shadow-lg rounded-2xl overflow-hidden h-[600px] relative">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <div className="text-2xl bg-gray-50 rounded-full p-2">
                {getSubjectIcon(classroom.subject)}
              </div>
              <Badge className={`${getLevelColor(classroom.level)} px-2 py-1 text-xs font-medium`}>
                {classroom.level}
              </Badge>
            </div>
            <div className="flex items-center gap-1 bg-gray-50 rounded-full px-2 py-1">
              <Star className="h-3 w-3 text-yellow-500 fill-current" />
              <span className="text-gray-900 text-xs font-bold">4.8</span>
            </div>
          </div>
          
          <CardTitle className="text-gray-900 text-lg font-bold line-clamp-2 leading-tight mb-1">
            {classroom.name}
          </CardTitle>
          <p className="text-orange-600 font-semibold text-sm">
            {classroom.subject} Class
          </p>
        </CardHeader>
        
        <CardContent className="flex flex-col justify-between h-full pb-6">
          <div className="space-y-4">
            <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
              {classroom.description || `Master ${classroom.subject} with expert guidance and personalized attention.`}
            </p>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="flex items-center gap-1 text-blue-700 mb-1">
                  <Users className="h-3 w-3" />
                  <span className="text-xs font-medium">Students</span>
                </div>
                <span className="text-sm font-bold text-blue-900">{classroom.capacity}</span>
              </div>
              
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="flex items-center gap-1 text-green-700 mb-1">
                  <DollarSign className="h-3 w-3" />
                  <span className="text-xs font-medium">Price</span>
                </div>
                <span className="text-sm font-bold text-green-900">₹{classroom.price}</span>
              </div>
              
              <div className="bg-purple-50 p-3 rounded-lg">
                <div className="flex items-center gap-1 text-purple-700 mb-1">
                  <Clock className="h-3 w-3" />
                  <span className="text-xs font-medium">Schedule</span>
                </div>
                <span className="text-xs font-medium text-purple-900">{classroom.schedule}</span>
              </div>
              
              <div className="bg-orange-50 p-3 rounded-lg">
                <div className="flex items-center gap-1 text-orange-700 mb-1">
                  <BookOpen className="h-3 w-3" />
                  <span className="text-xs font-medium">Duration</span>
                </div>
                <span className="text-xs font-medium text-orange-900">{classroom.duration_weeks}w</span>
              </div>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-xs text-gray-600 space-y-1">
                <div className="flex items-center gap-2">
                  <Calendar className="h-3 w-3" />
                  <span>{classroom.sessions_per_week} sessions/week • {classroom.session_duration_minutes}min each</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <Button 
              className="w-full bg-orange-600 hover:bg-orange-700 text-white rounded-lg py-3 font-semibold"
              onClick={() => onJoin(classroom)}
            >
              <Play className="h-4 w-4 mr-2" />
              Join Class
            </Button>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="lg"
                className="flex-1 border border-red-200 hover:bg-red-50 text-red-600 rounded-lg"
                onClick={() => handleButtonSwipe('left')}
              >
                <X className="h-4 w-4 mr-1" />
                Pass
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                className="flex-1 border border-green-200 hover:bg-green-50 text-green-600 rounded-lg"
                onClick={() => handleButtonSwipe('right')}
              >
                <Heart className="h-4 w-4 mr-1" />
                Like
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Swipe Indicators */}
      <AnimatePresence>
        {dragDirection === 'right' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-30"
          >
            <div className="bg-green-500 text-white px-6 py-3 rounded-xl font-bold text-xl shadow-xl border-2 border-white transform rotate-12">
              <Heart className="inline h-5 w-5 mr-2 fill-current" />
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
            <div className="bg-red-500 text-white px-6 py-3 rounded-xl font-bold text-xl shadow-xl border-2 border-white transform -rotate-12">
              <X className="inline h-5 w-5 mr-2" />
              PASS
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SwipeableClassroomCard;
