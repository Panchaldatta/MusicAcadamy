
import React, { useState, useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useClassroomSwipes } from '@/hooks/useClassroomSwipes';
import { ClassroomService } from '@/services/classroomService';
import { filterClassroomsByKeywords, CLASSROOM_KEYWORDS } from '@/utils/classroomKeywords';
import SearchFilters from './classroom/SearchFilters';
import CompactClassroomCard from './classroom/CompactClassroomCard';
import SwipeProgress from './classroom/SwipeProgress';
import EmptyState from './classroom/EmptyState';
import type { Database } from "@/integrations/supabase/types";

type Classroom = Database['public']['Tables']['classrooms']['Row'];

interface SwipeableClassroomViewProps {
  classrooms: Classroom[];
}

const SwipeableClassroomView: React.FC<SwipeableClassroomViewProps> = ({ classrooms }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchKeywords, setSearchKeywords] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [priceFilter, setPriceFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all');
  const [levelFilter, setLevelFilter] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');
  const { toast } = useToast();
  
  const {
    swipeHistory,
    likedClassrooms,
    passedClassrooms,
    handleSwipeLeft,
    handleSwipeRight,
    getSwipedClassroomIds
  } = useClassroomSwipes();

  const filteredClassrooms = useMemo(() => {
    const swipedIds = getSwipedClassroomIds();
    let filtered = classrooms.filter(classroom => !swipedIds.includes(classroom.id));
    
    if (searchKeywords.length > 0) {
      filtered = filterClassroomsByKeywords(filtered, searchKeywords);
    }
    
    if (priceFilter !== 'all') {
      filtered = filtered.filter(classroom => {
        switch (priceFilter) {
          case 'low': return classroom.price <= 500;
          case 'medium': return classroom.price > 500 && classroom.price <= 1500;
          case 'high': return classroom.price > 1500;
          default: return true;
        }
      });
    }
    
    if (levelFilter !== 'all') {
      filtered = filtered.filter(classroom => classroom.level.toLowerCase() === levelFilter);
    }
    
    return filtered;
  }, [classrooms, searchKeywords, priceFilter, levelFilter, swipeHistory]);

  const currentClassroom = filteredClassrooms[currentIndex];
  const popularKeywords = Object.keys(CLASSROOM_KEYWORDS).slice(0, 6);
  const hasActiveFilters = searchKeywords.length > 0 || priceFilter !== 'all' || levelFilter !== 'all';

  const handleSwipeLeftAction = async (classroom: Classroom) => {
    try {
      // Record swipe in database
      await ClassroomService.recordSwipe(classroom.id, 'left');
      
      // Update local state
      handleSwipeLeft(classroom);
      moveToNext();
      
      toast({
        title: "Passed",
        description: `You passed on "${classroom.name}"`,
      });
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
      // Record swipe in database
      await ClassroomService.recordSwipe(classroom.id, 'right');
      
      // Update local state
      handleSwipeRight(classroom);
      moveToNext();
      
      toast({
        title: "Liked!",
        description: `You liked "${classroom.name}"`,
      });
    } catch (error) {
      console.error('Error recording swipe:', error);
      toast({
        title: "Error",
        description: "Failed to record your swipe. Please try again.",
        variant: "destructive"
      });
    }
  };

  const moveToNext = () => {
    setCurrentIndex(prev => Math.min(prev + 1, filteredClassrooms.length - 1));
  };

  const handleJoinClassroom = async (classroom: Classroom) => {
    try {
      // Record swipe in database
      await ClassroomService.recordSwipe(classroom.id, 'right');
      
      toast({
        title: "Amazing choice!",
        description: `Welcome to "${classroom.name}". Check your email for next steps.`,
      });
      
      // Update local state
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

  const addKeyword = (keyword: string) => {
    if (!searchKeywords.includes(keyword)) {
      setSearchKeywords(prev => [...prev, keyword]);
      setCurrentIndex(0);
    }
  };

  const removeKeyword = (keyword: string) => {
    setSearchKeywords(prev => prev.filter(k => k !== keyword));
    setCurrentIndex(0);
  };

  const handleKeywordInputSubmit = () => {
    if (keywordInput.trim()) {
      addKeyword(keywordInput.trim());
      setKeywordInput('');
    }
  };

  const resetAllFilters = () => {
    setSearchKeywords([]);
    setPriceFilter('all');
    setLevelFilter('all');
    setCurrentIndex(0);
    setShowFilters(false);
  };

  if (!currentClassroom && filteredClassrooms.length === 0) {
    return (
      <>
        <div className="max-w-sm mx-auto mb-6">
          <SearchFilters
            keywordInput={keywordInput}
            setKeywordInput={setKeywordInput}
            searchKeywords={searchKeywords}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            priceFilter={priceFilter}
            setPriceFilter={setPriceFilter}
            levelFilter={levelFilter}
            setLevelFilter={setLevelFilter}
            onAddKeyword={handleKeywordInputSubmit}
            onRemoveKeyword={removeKeyword}
            onAddPopularKeyword={addKeyword}
            onResetFilters={resetAllFilters}
            popularKeywords={popularKeywords}
          />
        </div>
        <EmptyState
          hasFilters={hasActiveFilters}
          likedCount={likedClassrooms.length}
          passedCount={passedClassrooms.length}
          onResetFilters={resetAllFilters}
        />
      </>
    );
  }

  return (
    <div className="max-w-sm mx-auto space-y-4">
      <SearchFilters
        keywordInput={keywordInput}
        setKeywordInput={setKeywordInput}
        searchKeywords={searchKeywords}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        priceFilter={priceFilter}
        setPriceFilter={setPriceFilter}
        levelFilter={levelFilter}
        setLevelFilter={setLevelFilter}
        onAddKeyword={handleKeywordInputSubmit}
        onRemoveKeyword={removeKeyword}
        onAddPopularKeyword={addKeyword}
        onResetFilters={resetAllFilters}
        popularKeywords={popularKeywords}
      />

      {currentClassroom && (
        <div className="py-2">
          <CompactClassroomCard
            classroom={currentClassroom}
            onSwipeLeft={handleSwipeLeftAction}
            onSwipeRight={handleSwipeRightAction}
            onJoin={handleJoinClassroom}
          />
        </div>
      )}

      <SwipeProgress
        currentIndex={currentIndex}
        totalClassrooms={filteredClassrooms.length}
        isFiltered={hasActiveFilters}
        likedCount={likedClassrooms.length}
        passedCount={passedClassrooms.length}
        onResetFilters={resetAllFilters}
        hasActiveFilters={hasActiveFilters}
      />
    </div>
  );
};

export default SwipeableClassroomView;
