
import React, { useState } from 'react';
import { motion, useMotionValue, useTransform, PanInfo, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, X, HelpCircle, Clock, Users, DollarSign, Calendar } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type Classroom = Database['public']['Tables']['classrooms']['Row'];

interface SwapCardProps {
  classroom: Classroom;
  onSwipeLeft: (classroom: Classroom) => void;
  onSwipeRight: (classroom: Classroom) => void;
  onSkip: (classroom: Classroom) => void;
}

const SwapCard: React.FC<SwapCardProps> = ({
  classroom,
  onSwipeLeft,
  onSwipeRight,
  onSkip
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const [dragDirection, setDragDirection] = useState<'left' | 'right' | null>(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const rotate = useTransform(x, [-200, 0, 200], [-15, 0, 15]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0.5, 0.8, 1, 0.8, 0.5]);
  const scale = useTransform(x, [-200, 0, 200], [0.95, 1, 0.95]);

  const getSubjectIcon = (subject: string) => {
    const icons: Record<string, string> = {
      'Sitar': '🎸', 'Tabla': '🥁', 'Vocals': '🎤', 'Flute': '🎵',
      'Harmonium': '🎹', 'Violin': '🎻', 'Guitar': '🎸', 'Piano': '🎹', 'Drums': '🥁'
    };
    return icons[subject] || '🎵';
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
      }, 200);
    } else {
      x.set(0);
      y.set(0);
      setDragDirection(null);
    }
  };

  const handleButtonAction = (action: 'left' | 'right' | 'skip') => {
    if (action === 'skip') {
      onSkip(classroom);
      setIsVisible(false);
      return;
    }

    const exitX = action === 'right' ? 800 : -800;
    setIsExiting(true);
    x.set(exitX);
    
    setTimeout(() => {
      if (action === 'left') {
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
      <Card className="bg-gray-900 border-gray-800 shadow-2xl overflow-hidden h-[600px] relative">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/60 to-transparent p-4">
          <div className="flex justify-between items-center text-white">
            <h2 className="text-lg font-semibold">My Music Class</h2>
            <button className="p-1">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Main Image/Content Area */}
        <div className="relative h-[400px] bg-gradient-to-br from-orange-600 to-orange-800 flex items-center justify-center">
          <div className="text-center text-white p-6">
            <div className="text-6xl mb-4">
              {getSubjectIcon(classroom.subject)}
            </div>
            <h3 className="text-2xl font-bold mb-2 leading-tight">
              {classroom.name}
            </h3>
            <p className="text-orange-200 text-lg font-medium mb-4">
              {classroom.subject} • {classroom.level}
            </p>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3 mt-6">
              <div className="bg-black/20 backdrop-blur-sm rounded-lg p-3">
                <div className="flex items-center justify-center gap-2 text-white/90">
                  <Users className="h-4 w-4" />
                  <span className="text-sm font-medium">{classroom.capacity} students</span>
                </div>
              </div>
              <div className="bg-black/20 backdrop-blur-sm rounded-lg p-3">
                <div className="flex items-center justify-center gap-2 text-white/90">
                  <DollarSign className="h-4 w-4" />
                  <span className="text-sm font-medium">₹{classroom.price}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <CardContent className="p-0">
          {/* Vote Counts */}
          <div className="flex justify-between items-center px-6 py-4 bg-gray-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                <X className="h-4 w-4 text-white" />
              </div>
              <span className="text-white font-semibold">8</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-white font-semibold">6</span>
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <Heart className="h-4 w-4 text-white fill-current" />
              </div>
            </div>
          </div>

          {/* Skip Button */}
          <div className="px-6 py-3 bg-gray-800">
            <Button
              onClick={() => handleButtonAction('skip')}
              variant="ghost"
              className="w-full text-gray-300 hover:text-white hover:bg-gray-700"
            >
              I don't Know
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 p-6 bg-gray-900">
            <Button
              onClick={() => handleButtonAction('left')}
              className="flex-1 bg-gray-700 hover:bg-red-600 text-white font-semibold py-3"
            >
              Done
            </Button>
            <Button
              onClick={() => handleButtonAction('right')}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3"
            >
              Recommend
            </Button>
          </div>

          {/* Additional Info */}
          <div className="px-6 pb-4 bg-gray-900">
            <div className="flex items-center justify-center gap-4 text-gray-400 text-sm">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {classroom.session_duration_minutes}min
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {classroom.sessions_per_week}x/week
              </span>
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
              RECOMMEND
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
              DONE
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SwapCard;
