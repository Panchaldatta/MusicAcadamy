
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { Database } from "@/integrations/supabase/types";

type Classroom = Database['public']['Tables']['classrooms']['Row'];

interface SwipeRecord {
  classroom: Classroom;
  direction: 'left' | 'right';
  timestamp: Date;
}

export const useClassroomSwipes = () => {
  const [swipeHistory, setSwipeHistory] = useState<SwipeRecord[]>([]);
  const [likedClassrooms, setLikedClassrooms] = useState<Classroom[]>([]);
  const [passedClassrooms, setPassedClassrooms] = useState<Classroom[]>([]);
  const { toast } = useToast();

  const handleSwipeLeft = (classroom: Classroom) => {
    const record: SwipeRecord = {
      classroom,
      direction: 'left',
      timestamp: new Date()
    };
    
    setSwipeHistory(prev => [...prev, record]);
    setPassedClassrooms(prev => [...prev, classroom]);
    
    toast({
      title: "Classroom Passed",
      description: `You passed on "${classroom.name}"`,
    });
  };

  const handleSwipeRight = (classroom: Classroom) => {
    const record: SwipeRecord = {
      classroom,
      direction: 'right',
      timestamp: new Date()
    };
    
    setSwipeHistory(prev => [...prev, record]);
    setLikedClassrooms(prev => [...prev, classroom]);
    
    toast({
      title: "Classroom Liked!",
      description: `You liked "${classroom.name}". Great choice!`,
    });
  };

  const getSwipedClassroomIds = () => {
    return swipeHistory.map(record => record.classroom.id);
  };

  const clearHistory = () => {
    setSwipeHistory([]);
    setLikedClassrooms([]);
    setPassedClassrooms([]);
  };

  return {
    swipeHistory,
    likedClassrooms,
    passedClassrooms,
    handleSwipeLeft,
    handleSwipeRight,
    getSwipedClassroomIds,
    clearHistory
  };
};
