
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
        return 'bg-emerald-500/10 text-emerald-700 border-emerald-200';
      case 'intermediate':
        return 'bg-amber-500/10 text-amber-700 border-amber-200';
      case 'advanced':
        return 'bg-rose-500/10 text-rose-700 border-rose-200';
      default:
        return 'bg-gray-500/10 text-gray-700 border-gray-200';
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
      className="relative cursor-grab active:cursor-grabbing max-w-sm mx-auto"
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
      <Card className="bg-white border-0 shadow-xl rounded-3xl overflow-hidden h-[480px] relative">
        {/* Header Section */}
        <CardHeader className="pb-4 px-6 pt-8 bg-gradient-to-br from-slate-50 to-white">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
              <div className="text-2xl bg-white rounded-2xl p-3 shadow-sm border border-gray-100">
                {getSubjectIcon(classroom.subject)}
              </div>
              <div className="flex flex-col gap-2">
                <Badge className={`${getLevelColor(classroom.level)} px-3 py-1 text-sm font-semibold border rounded-full w-fit`}>
                  {classroom.level}
                </Badge>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-amber-400 fill-current" />
                  <span className="text-sm font-bold text-gray-700">4.8</span>
                  <span className="text-xs text-gray-500">(124)</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-bold text-xl text-gray-900 line-clamp-2 leading-tight">
              {classroom.name}
            </h3>
            <p className="text-primary font-semibold text-base">
              {classroom.subject} Class
            </p>
          </div>
        </CardHeader>
        
        <CardContent className="px-6 pb-6 flex flex-col justify-between h-full">
          <div className="space-y-5">
            <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
              {classroom.description || `Master ${classroom.subject} with expert guidance and personalized learning.`}
            </p>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50/70 p-4 rounded-2xl border border-blue-100/50">
                <div className="flex items-center gap-2 text-blue-600 mb-2">
                  <Users className="h-4 w-4" />
                  <span className="text-sm font-semibold">Students</span>
                </div>
                <span className="text-lg font-bold text-blue-700">{classroom.capacity}</span>
              </div>
              
              <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-100/50">
                <div className="flex items-center gap-2 text-emerald-600 mb-2">
                  <DollarSign className="h-4 w-4" />
                  <span className="text-sm font-semibold">Price</span>
                </div>
                <span className="text-lg font-bold text-emerald-700">₹{classroom.price}</span>
              </div>
            </div>

            {/* Schedule Info */}
            <div className="bg-purple-50/70 p-4 rounded-2xl border border-purple-100/50">
              <div className="flex items-center gap-2 text-purple-600 mb-2">
                <Calendar className="h-4 w-4" />
                <span className="text-sm font-semibold">Schedule</span>
              </div>
              <span className="text-sm font-semibold text-purple-700">{classroom.schedule}</span>
            </div>

            {/* Session Details */}
            <div className="bg-gray-50/70 p-4 rounded-2xl border border-gray-100/50">
              <div className="text-sm text-gray-600 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span className="font-medium">{classroom.sessions_per_week} sessions/week • {classroom.session_duration_minutes}min each</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 space-y-3">
            <Button 
              className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white h-12 font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200"
              onClick={() => onJoin(classroom)}
            >
              <Play className="h-5 w-5 mr-2" />
              Join Class
            </Button>
            
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="lg"
                className="flex-1 border-2 border-red-200 hover:bg-red-50 text-red-600 h-11 rounded-2xl font-semibold transition-all duration-200"
                onClick={() => handleButtonSwipe('left')}
              >
                <X className="h-4 w-4 mr-1" />
                Pass
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                className="flex-1 border-2 border-emerald-200 hover:bg-emerald-50 text-emerald-600 h-11 rounded-2xl font-semibold transition-all duration-200"
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
            <div className="bg-emerald-500 text-white px-6 py-3 rounded-2xl font-bold text-xl shadow-2xl border-4 border-white transform rotate-12">
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
            <div className="bg-red-500 text-white px-6 py-3 rounded-2xl font-bold text-xl shadow-2xl border-4 border-white transform -rotate-12">
              <X className="inline h-5 w-5 mr-2" />
              PASS
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CompactClassroomCard;
