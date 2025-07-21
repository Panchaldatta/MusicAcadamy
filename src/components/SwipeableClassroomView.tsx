
import React, { useState, useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useClassroomSwipes } from '@/hooks/useClassroomSwipes';
import { filterClassroomsByKeywords, CLASSROOM_KEYWORDS } from '@/utils/classroomKeywords';
import SearchFilters from './classroom/SearchFilters';
import StackedClassroomCards from './classroom/StackedClassroomCards';
import SwipeProgress from './classroom/SwipeProgress';
import EmptyState from './classroom/EmptyState';
import type { Database } from "@/integrations/supabase/types";

type Classroom = Database['public']['Tables']['classrooms']['Row'];

interface SwipeableClassroomViewProps {
  classrooms: Classroom[];
}

const SwipeableClassroomView: React.FC<SwipeableClassroomViewProps> = ({ classrooms }) => {
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

  const popularKeywords = Object.keys(CLASSROOM_KEYWORDS).slice(0, 6);
  const hasActiveFilters = searchKeywords.length > 0 || priceFilter !== 'all' || levelFilter !== 'all';

  const addKeyword = (keyword: string) => {
    if (!searchKeywords.includes(keyword)) {
      setSearchKeywords(prev => [...prev, keyword]);
    }
  };

  const removeKeyword = (keyword: string) => {
    setSearchKeywords(prev => prev.filter(k => k !== keyword));
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
    setShowFilters(false);
  };

  if (filteredClassrooms.length === 0) {
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
    <div className="max-w-sm mx-auto space-y-6">
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

      <StackedClassroomCards 
        classrooms={filteredClassrooms}
        maxVisible={3}
      />

      <SwipeProgress
        currentIndex={0}
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
