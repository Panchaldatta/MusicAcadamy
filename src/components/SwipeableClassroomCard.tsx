
import React, { useState } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Users, Star, DollarSign, Heart, X, Calendar, Play } from "lucide-react";
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
  const { toast } = useToast();
  
  // Motion values for tracking drag
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Transform values for rotation and opacity based on drag
  const rotate = useTransform(x, [-200, 0, 200], [-30, 0, 30]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 0.5, 1, 0.5, 0]);
  
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
      }, 300);
    } else {
      // Snap back to center
      x.set(0);
      y.set(0);
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
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <motion.div
      className="relative cursor-grab active:cursor-grabbing max-w-sm mx-auto"
      style={{
        x,
        y,
        rotate,
        opacity: isVisible ? opacity : 0,
        scale: isVisible ? 1 : 0,
      }}
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.2}
      onDragEnd={handleDragEnd}
      whileTap={{ scale: 1.05 }}
      animate={{ 
        scale: isVisible && !isExiting ? 1 : 0,
        opacity: isVisible && !isExiting ? 1 : 0
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <Card className="bg-white border-orange-200 shadow-2xl rounded-xl overflow-hidden h-[600px]">
        <CardHeader className="pb-4 relative">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{getSubjectIcon(classroom.subject)}</span>
              <Badge className={`${getLevelColor(classroom.level)} text-white transition-colors`}>
                {classroom.level}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="text-gray-900 text-sm font-medium">4.8</span>
              </div>
            </div>
          </div>
          
          <CardTitle className="text-gray-900 text-xl line-clamp-2">
            {classroom.name}
          </CardTitle>
          <p className="text-orange-600 font-medium text-lg">
            {classroom.subject} Class
          </p>
        </CardHeader>
        
        <CardContent className="flex flex-col justify-between h-full pb-6">
          <div className="space-y-4">
            <p className="text-gray-600 text-sm line-clamp-3">
              {classroom.description || `Learn ${classroom.subject} with expert guidance and structured curriculum.`}
            </p>
            
            <div className="space-y-3">
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
          </div>

          <div className="mt-6 space-y-3">
            <Button 
              className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white rounded-lg"
              onClick={() => onJoin(classroom)}
            >
              <Play className="h-4 w-4 mr-2" />
              Join Now
            </Button>
            
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="lg"
                className="flex-1 border-red-200 hover:bg-red-50 hover:border-red-300"
                onClick={() => handleButtonSwipe('left')}
              >
                <X className="h-5 w-5 text-red-500 mr-2" />
                Pass
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                className="flex-1 border-green-200 hover:bg-green-50 hover:border-green-300"
                onClick={() => handleButtonSwipe('right')}
              >
                <Heart className="h-5 w-5 text-green-500 mr-2" />
                Like
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Swipe indicators */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ opacity: useTransform(x, [50, 150], [0, 1]) }}
      >
        <div className="bg-green-500 text-white px-6 py-3 rounded-full font-bold text-xl shadow-lg">
          LIKE
        </div>
      </motion.div>
      
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ opacity: useTransform(x, [-150, -50], [1, 0]) }}
      >
        <div className="bg-red-500 text-white px-6 py-3 rounded-full font-bold text-xl shadow-lg">
          PASS
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SwipeableClassroomCard;
