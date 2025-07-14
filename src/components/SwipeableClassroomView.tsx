
import React, { useState, useMemo } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, RotateCcw, Heart, X, Filter, SlidersHorizontal } from "lucide-react";
import SwipeableClassroomCard from './SwipeableClassroomCard';
import { useClassroomSwipes } from '@/hooks/useClassroomSwipes';
import { filterClassroomsByKeywords, CLASSROOM_KEYWORDS } from '@/utils/classroomKeywords';
import { useToast } from '@/hooks/use-toast';
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
    getSwipedClassroomIds,
    clearHistory
  } = useClassroomSwipes();

  // Enhanced filtering with price and level
  const filteredClassrooms = useMemo(() => {
    const swipedIds = getSwipedClassroomIds();
    let filtered = classrooms.filter(classroom => !swipedIds.includes(classroom.id));
    
    // Apply keyword filter
    if (searchKeywords.length > 0) {
      filtered = filterClassroomsByKeywords(filtered, searchKeywords);
    }
    
    // Apply price filter
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
    
    // Apply level filter
    if (levelFilter !== 'all') {
      filtered = filtered.filter(classroom => classroom.level.toLowerCase() === levelFilter);
    }
    
    return filtered;
  }, [classrooms, searchKeywords, priceFilter, levelFilter, swipeHistory]);

  const currentClassroom = filteredClassrooms[currentIndex];
  const popularKeywords = Object.keys(CLASSROOM_KEYWORDS).slice(0, 6);

  const handleSwipeLeftAction = (classroom: Classroom) => {
    handleSwipeLeft(classroom);
    moveToNext();
  };

  const handleSwipeRightAction = (classroom: Classroom) => {
    handleSwipeRight(classroom);
    moveToNext();
  };

  const moveToNext = () => {
    setCurrentIndex(prev => Math.min(prev + 1, filteredClassrooms.length - 1));
  };

  const handleJoinClassroom = (classroom: Classroom) => {
    toast({
      title: "Amazing choice!",
      description: `Welcome to "${classroom.name}". Check your email for next steps.`,
    });
    handleSwipeRightAction(classroom);
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
      <div className="text-center py-16 max-w-sm mx-auto">
        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl">🎵</span>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {searchKeywords.length > 0 || priceFilter !== 'all' || levelFilter !== 'all' 
            ? "No matches found" 
            : "All done!"
          }
        </h3>
        <p className="text-gray-600 mb-6">
          {searchKeywords.length > 0 || priceFilter !== 'all' || levelFilter !== 'all'
            ? "Try adjusting your filters to discover more classes."
            : "You've explored all available classes. New ones are added regularly!"
          }
        </p>
        
        <div className="space-y-3">
          {(searchKeywords.length > 0 || priceFilter !== 'all' || levelFilter !== 'all') && (
            <Button onClick={resetAllFilters} variant="outline" className="w-full">
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset Filters
            </Button>
          )}
          
          {swipeHistory.length > 0 && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-900 mb-2">Your activity:</p>
              <div className="flex justify-center gap-4 text-sm">
                <span className="flex items-center gap-1">
                  <Heart className="h-4 w-4 text-green-500 fill-current" />
                  <span>{likedClassrooms.length} liked</span>
                </span>
                <span className="flex items-center gap-1">
                  <X className="h-4 w-4 text-red-500" />
                  <span>{passedClassrooms.length} passed</span>
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-sm mx-auto space-y-6">
      {/* Compact Search */}
      <div className="space-y-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search subjects..."
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleKeywordInputSubmit()}
              className="pl-10 border-gray-200 focus:border-orange-300 rounded-lg"
            />
          </div>
          <Button 
            onClick={handleKeywordInputSubmit} 
            size="sm"
            className="bg-orange-600 hover:bg-orange-700 rounded-lg"
          >
            Add
          </Button>
          <Button
            onClick={() => setShowFilters(!showFilters)}
            variant="outline"
            size="sm"
            className="rounded-lg"
          >
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="p-4 bg-gray-50 rounded-lg space-y-3">
            <div>
              <label className="text-xs font-medium text-gray-700 mb-2 block">Price</label>
              <div className="flex gap-1 flex-wrap">
                {[
                  { key: 'all', label: 'All' },
                  { key: 'low', label: '≤₹500' },
                  { key: 'medium', label: '₹500-1500' },
                  { key: 'high', label: '>₹1500' }
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setPriceFilter(key as any)}
                    className={`px-2 py-1 text-xs rounded-md transition-colors ${
                      priceFilter === key 
                        ? 'bg-orange-600 text-white'
                        : 'bg-white text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-700 mb-2 block">Level</label>
              <div className="flex gap-1 flex-wrap">
                {[
                  { key: 'all', label: 'All' },
                  { key: 'beginner', label: 'Beginner' },
                  { key: 'intermediate', label: 'Intermediate' },
                  { key: 'advanced', label: 'Advanced' }
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setLevelFilter(key as any)}
                    className={`px-2 py-1 text-xs rounded-md transition-colors ${
                      levelFilter === key 
                        ? 'bg-orange-600 text-white'
                        : 'bg-white text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Active Keywords */}
        {searchKeywords.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {searchKeywords.map((keyword) => (
              <Badge
                key={keyword}
                variant="secondary"
                className="cursor-pointer hover:bg-red-50 hover:text-red-700 text-xs bg-orange-50 text-orange-700 border border-orange-200"
                onClick={() => removeKeyword(keyword)}
              >
                {keyword} ×
              </Badge>
            ))}
          </div>
        )}

        {/* Popular Keywords */}
        <div>
          <p className="text-xs text-gray-500 mb-2">Popular:</p>
          <div className="flex flex-wrap gap-1">
            {popularKeywords.map((keyword) => (
              <Badge
                key={keyword}
                variant="outline"
                className="cursor-pointer hover:bg-orange-50 hover:border-orange-300 text-xs"
                onClick={() => addKeyword(keyword)}
              >
                {keyword}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Current Classroom Card */}
      {currentClassroom && (
        <SwipeableClassroomCard
          classroom={currentClassroom}
          onSwipeLeft={handleSwipeLeftAction}
          onSwipeRight={handleSwipeRightAction}
          onJoin={handleJoinClassroom}
        />
      )}

      {/* Simple Progress */}
      <div className="text-center space-y-2">
        <div className="w-full bg-gray-200 rounded-full h-1">
          <div 
            className="bg-orange-600 h-1 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / filteredClassrooms.length) * 100}%` }}
          />
        </div>
        
        <p className="text-xs text-gray-500">
          {currentIndex + 1} of {filteredClassrooms.length}
          {(searchKeywords.length > 0 || priceFilter !== 'all' || levelFilter !== 'all') && 
            <span className="text-orange-600"> (filtered)</span>
          }
        </p>
      </div>
    </div>
  );
};

export default SwipeableClassroomView;
