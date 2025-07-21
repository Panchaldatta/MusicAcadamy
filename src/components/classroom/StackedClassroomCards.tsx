
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { useClassroomSwipes } from '@/hooks/useClassroomSwipes';
import { ClassroomService } from '@/services/classroomService';
import CompactClassroomCard from './CompactClassroomCard';
import type { Database } from "@/integrations/supabase/types";

type Classroom = Database['public']['Tables']['classrooms']['Row'];

interface StackedClassroomCardsProps {
  classrooms: Classroom[];
  maxVisible?: number;
}

const StackedClassroomCards: React.FC<StackedClassroomCardsProps> = ({ 
  classrooms, 
  maxVisible = 3 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { toast } = useToast();
  
  const {
    handleSwipeLeft,
    handleSwipeRight,
    getSwipedClassroomIds
  } = useClassroomSwipes();

  const filteredClassrooms = useMemo(() => {
    const swipedIds = getSwipedClassroomIds();
    return classrooms.filter(classroom => !swipedIds.includes(classroom.id));
  }, [classrooms, getSwipedClassroomIds]);

  const visibleClassrooms = useMemo(() => {
    return filteredClassrooms.slice(currentIndex, currentIndex + maxVisible);
  }, [filteredClassrooms, currentIndex, maxVisible]);

  const handleSwipeLeftAction = async (classroom: Classroom) => {
    try {
      await ClassroomService.recordSwipe(classroom.id, 'left');
      handleSwipeLeft(classroom);
      moveToNext();
    } catch (error) {
      console.error('Error recording swipe:', error);
      toast({
        title: "Error",
        description: "Failed to record your swipe. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleSwipeRightAction = async (classroom: Classroom) => {
    try {
      await ClassroomService.recordSwipe(classroom.id, 'right');
      handleSwipeRight(classroom);
      moveToNext();
    } catch (error) {
      console.error('Error recording swipe:', error);
      toast({
        title: "Error",
        description: "Failed to record your swipe. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleJoinClassroom = async (classroom: Classroom) => {
    try {
      await ClassroomService.recordSwipe(classroom.id, 'right');
      toast({
        title: "Amazing choice!",
        description: `Welcome to "${classroom.name}". Check your email for next steps.`,
      });
      handleSwipeRight(classroom);
      moveToNext();
    } catch (error) {
      console.error('Error joining classroom:', error);
      toast({
        title: "Error",
        description: "Failed to join classroom. Please try again.",
        variant: "destructive"
      });
    }
  };

  const moveToNext = () => {
    setCurrentIndex(prev => Math.min(prev + 1, filteredClassrooms.length - 1));
  };

  if (visibleClassrooms.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
          <span className="text-2xl">🎉</span>
        </div>
        <h3 className="text-lg font-semibold mb-2">All caught up!</h3>
        <p className="text-muted-foreground">You've viewed all available classrooms.</p>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-sm mx-auto h-[500px] flex items-center justify-center">
      <AnimatePresence mode="popLayout">
        {visibleClassrooms.map((classroom, index) => {
          const isTop = index === 0;
          const zIndex = maxVisible - index;
          const scale = 1 - (index * 0.05);
          const yOffset = index * 8;
          const opacity = 1 - (index * 0.2);

          return (
            <motion.div
              key={classroom.id}
              className="absolute inset-0"
              style={{
                zIndex,
              }}
              initial={{
                scale: 0.8,
                opacity: 0,
                y: 100,
              }}
              animate={{
                scale,
                opacity,
                y: yOffset,
              }}
              exit={{
                scale: 0.8,
                opacity: 0,
                x: -300,
                transition: { duration: 0.3 }
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 25,
              }}
            >
              <div 
                className={`w-full h-full ${!isTop ? 'pointer-events-none' : ''}`}
                style={{
                  filter: !isTop ? 'blur(1px)' : 'none',
                }}
              >
                <CompactClassroomCard
                  classroom={classroom}
                  onSwipeLeft={handleSwipeLeftAction}
                  onSwipeRight={handleSwipeRightAction}
                  onJoin={handleJoinClassroom}
                />
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
      
      {/* Progress indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-1">
        {Array.from({ length: Math.min(maxVisible, visibleClassrooms.length) }).map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === 0 ? 'bg-primary' : 'bg-muted'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default StackedClassroomCards;
