
import React, { useState } from 'react';
import { motion, useMotionValue, useTransform, PanInfo, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Users, Star, DollarSign, Heart, X, Play, Calendar } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type Classroom = Database['public']['Tables']['classrooms']['Row'];

interface CompactClassroomCardProps {
  classroom: Classroom;
  onSwipeLeft: (classroom: Classroom) => void;
  onSwipeRight: (classroom: Classroom) => void;
  onJoin: (classroom: Classroom) => void;
}

const CompactClassroomCard: React.FC<CompactClassroomCardProps> = ({
  classroom,
  onSwipeLeft,
  onSwipeRight,
  onJoin
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const [dragDirection, setDragDirection] = useState<'left' | 'right' | null>(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const rotate = useTransform(x, [-150, 0, 150], [-12, 0, 12]);
  const opacity = useTransform(x, [-150, -75, 0, 75, 150], [0.6, 0.8, 1, 0.8, 0.6]);
  const scale = useTransform(x, [-150, 0, 150], [0.96, 1, 0.96]);
  
  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'advanced':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getSubjectIcon = (subject: string) => {
    const icons: Record<string, string> = {
      'Sitar': '🎸', 'Tabla': '🥁', 'Vocals': '🎤', 'Flute': '🎵',
      'Harmonium': '🎹', 'Violin': '🎻', 'Guitar': '🎸', 'Piano': '🎹', 'Drums': '🥁'
    };
    return icons[subject] || '🎵';
  };

  const handleDrag = (event: any, info: PanInfo) => {
    const threshold = 40;
    if (Math.abs(info.offset.x) > threshold) {
      setDragDirection(info.offset.x > 0 ? 'right' : 'left');
    } else {
      setDragDirection(null);
    }
  };

  const handleDragEnd = (event: any, info: PanInfo) => {
    const threshold = 80;
    const { offset, velocity } = info;
    
    if (Math.abs(offset.x) > threshold || Math.abs(velocity.x) > 400) {
      const direction = offset.x > 0 ? 'right' : 'left';
      const exitX = direction === 'right' ? 800 : -800;
      
      setIsExiting(true);
      x.set(exitX);
      
      setTimeout(() => {
        if (direction === 'left') {
          onSwipeLeft(classroom);
        } else {
          onSwipeRight(classroom);
        }
        setIsVisible(false);
      }, 150);
    } else {
      x.set(0);
      y.set(0);
      setDragDirection(null);
    }
  };

  const handleButtonSwipe = (direction: 'left' | 'right') => {
    const exitX = direction === 'right' ? 800 : -800;
    setIsExiting(true);
    x.set(exitX);
    
    setTimeout(() => {
      if (direction === 'left') {
        onSwipeLeft(classroom);
      } else {
        onSwipeRight(classroom);
      }
      setIsVisible(false);
    }, 150);
  };

  if (!isVisible) return null;

  return (
    <motion.div
      className="relative cursor-grab active:cursor-grabbing max-w-xs mx-auto"
      style={{ x, y, rotate, opacity, scale }}
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.15}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      whileTap={{ scale: 1.02 }}
      animate={{ 
        scale: isVisible && !isExiting ? 1 : 0,
        opacity: isVisible && !isExiting ? 1 : 0
      }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      <Card className="bg-card border-border shadow-md overflow-hidden h-[420px] relative">
        <CardHeader className="pb-3 px-4 pt-4">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-2">
              <div className="text-xl bg-muted rounded-lg p-1.5">
                {getSubjectIcon(classroom.subject)}
              </div>
              <Badge className={`${getLevelColor(classroom.level)} px-2 py-0.5 text-xs font-medium border`}>
                {classroom.level}
              </Badge>
            </div>
            <div className="flex items-center gap-1 bg-muted rounded-full px-2 py-0.5">
              <Star className="h-3 w-3 text-yellow-500 fill-current" />
              <span className="text-xs font-semibold">4.8</span>
            </div>
          </div>
          
          <h3 className="font-bold text-base line-clamp-2 leading-tight mb-1">
            {classroom.name}
          </h3>
          <p className="text-primary font-medium text-sm">
            {classroom.subject} Class
          </p>
        </CardHeader>
        
        <CardContent className="px-4 pb-4 flex flex-col justify-between h-full">
          <div className="space-y-3">
            <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">
              {classroom.description || `Master ${classroom.subject} with expert guidance.`}
            </p>
            
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-blue-50 p-2 rounded-lg border border-blue-100">
                <div className="flex items-center gap-1 text-blue-600 mb-0.5">
                  <Users className="h-3 w-3" />
                  <span className="text-xs font-medium">Students</span>
                </div>
                <span className="text-sm font-bold text-blue-700">{classroom.capacity}</span>
              </div>
              
              <div className="bg-green-50 p-2 rounded-lg border border-green-100">
                <div className="flex items-center gap-1 text-green-600 mb-0.5">
                  <DollarSign className="h-3 w-3" />
                  <span className="text-xs font-medium">Price</span>
                </div>
                <span className="text-sm font-bold text-green-700">₹{classroom.price}</span>
              </div>
              
              <div className="bg-purple-50 p-2 rounded-lg border border-purple-100 col-span-2">
                <div className="flex items-center gap-1 text-purple-600 mb-0.5">
                  <Calendar className="h-3 w-3" />
                  <span className="text-xs font-medium">Schedule</span>
                </div>
                <span className="text-xs font-medium text-purple-700">{classroom.schedule}</span>
              </div>
            </div>

            <div className="bg-muted/50 p-2 rounded-lg border">
              <div className="text-xs text-muted-foreground flex items-center gap-2">
                <Clock className="h-3 w-3" />
                <span>{classroom.sessions_per_week} sessions/week • {classroom.session_duration_minutes}min each</span>
              </div>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <Button 
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-9 font-medium"
              onClick={() => onJoin(classroom)}
            >
              <Play className="h-4 w-4 mr-2" />
              Join Class
            </Button>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 border-red-200 hover:bg-red-50 text-red-600 h-8"
                onClick={() => handleButtonSwipe('left')}
              >
                <X className="h-3 w-3 mr-1" />
                Pass
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                className="flex-1 border-green-200 hover:bg-green-50 text-green-600 h-8"
                onClick={() => handleButtonSwipe('right')}
              >
                <Heart className="h-3 w-3 mr-1" />
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
            <div className="bg-green-500 text-white px-4 py-2 rounded-xl font-bold text-lg shadow-xl border-2 border-white transform rotate-12">
              <Heart className="inline h-4 w-4 mr-1 fill-current" />
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
            <div className="bg-red-500 text-white px-4 py-2 rounded-xl font-bold text-lg shadow-xl border-2 border-white transform -rotate-12">
              <X className="inline h-4 w-4 mr-1" />
              PASS
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CompactClassroomCard;
