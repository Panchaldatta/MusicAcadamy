
import React, { useState, useMemo } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, RotateCcw, Heart, X, TrendingUp, Undo2, Filter, SlidersHorizontal } from "lucide-react";
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
  const popularKeywords = Object.keys(CLASSROOM_KEYWORDS).slice(0, 8);

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

  const handleUndo = () => {
    if (swipeHistory.length > 0 && currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      toast({
        title: "Undone!",
        description: "Went back to previous classroom",
      });
    }
  };

  const handleJoinClassroom = (classroom: Classroom) => {
    toast({
      title: "Classroom Joined!",
      description: `You've successfully joined "${classroom.name}". Check your email for further instructions.`,
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

  const getPriceFilterColor = (filter: string) => {
    switch (filter) {
      case 'low': return 'bg-green-100 text-green-700 border-green-300';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'high': return 'bg-red-100 text-red-700 border-red-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getLevelFilterColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-emerald-100 text-emerald-700 border-emerald-300';
      case 'intermediate': return 'bg-amber-100 text-amber-700 border-amber-300';
      case 'advanced': return 'bg-rose-100 text-rose-700 border-rose-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  if (!currentClassroom && filteredClassrooms.length === 0) {
    return (
      <div className="text-center py-16 max-w-md mx-auto">
        <div className="w-24 h-24 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
          <Heart className="h-12 w-12 text-orange-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {searchKeywords.length > 0 || priceFilter !== 'all' || levelFilter !== 'all' 
            ? "No matching classrooms!" 
            : "No more classrooms!"
          }
        </h3>
        <p className="text-gray-600 mb-6">
          {searchKeywords.length > 0 || priceFilter !== 'all' || levelFilter !== 'all'
            ? "Try adjusting your filters to see more classrooms."
            : "You've seen all available classrooms. Check back later for new additions!"
          }
        </p>
        
        <div className="space-y-3">
          {(searchKeywords.length > 0 || priceFilter !== 'all' || levelFilter !== 'all') && (
            <Button onClick={resetAllFilters} variant="outline" className="w-full">
              <RotateCcw className="h-4 w-4 mr-2" />
              Clear All Filters
            </Button>
          )}
          
          {swipeHistory.length > 0 && (
            <Button onClick={clearHistory} variant="outline" className="w-full">
              <X className="h-4 w-4 mr-2" />
              Clear History
            </Button>
          )}
        </div>
        
        {swipeHistory.length > 0 && (
          <div className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border">
            <h4 className="font-medium text-gray-900 mb-3">Your Activity</h4>
            <div className="flex justify-center gap-6 text-sm">
              <span className="flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full">
                <Heart className="h-4 w-4 text-green-500 fill-current" />
                <span className="font-medium">{likedClassrooms.length} Liked</span>
              </span>
              <span className="flex items-center gap-2 bg-red-50 px-3 py-1 rounded-full">
                <X className="h-4 w-4 text-red-500" />
                <span className="font-medium">{passedClassrooms.length} Passed</span>
              </span>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto space-y-6">
      {/* Enhanced Search and Filters */}
      <div className="space-y-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Add keywords (e.g., vocals, tabla, classical)"
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleKeywordInputSubmit()}
              className="pl-10 bg-white border-2 border-gray-200 focus:border-orange-300 rounded-xl"
            />
          </div>
          <Button 
            onClick={handleKeywordInputSubmit} 
            size="sm"
            className="bg-orange-600 hover:bg-orange-700 rounded-xl"
          >
            Add
          </Button>
          <Button
            onClick={() => setShowFilters(!showFilters)}
            variant="outline"
            size="sm"
            className="rounded-xl border-2"
          >
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="p-4 bg-gray-50 rounded-xl border-2 border-gray-200 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Price Range</label>
              <div className="flex gap-2 flex-wrap">
                {[
                  { key: 'all', label: 'All Prices' },
                  { key: 'low', label: '≤ ₹500' },
                  { key: 'medium', label: '₹500-1500' },
                  { key: 'high', label: '> ₹1500' }
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setPriceFilter(key as any)}
                    className={`px-3 py-1 text-xs rounded-full border-2 transition-all ${
                      priceFilter === key 
                        ? getPriceFilterColor(key) + ' border-current'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Level</label>
              <div className="flex gap-2 flex-wrap">
                {[
                  { key: 'all', label: 'All Levels' },
                  { key: 'beginner', label: 'Beginner' },
                  { key: 'intermediate', label: 'Intermediate' },
                  { key: 'advanced', label: 'Advanced' }
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setLevelFilter(key as any)}
                    className={`px-3 py-1 text-xs rounded-full border-2 transition-all ${
                      levelFilter === key 
                        ? getLevelFilterColor(key) + ' border-current'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
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
          <div className="flex flex-wrap gap-2">
            {searchKeywords.map((keyword) => (
              <Badge
                key={keyword}
                variant="secondary"
                className="cursor-pointer hover:bg-red-100 hover:text-red-700 transition-colors bg-orange-100 text-orange-700 border border-orange-200 rounded-full"
                onClick={() => removeKeyword(keyword)}
              >
                {keyword} ×
              </Badge>
            ))}
          </div>
        )}

        {/* Popular Keywords */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <TrendingUp className="h-4 w-4" />
            <span>Popular subjects:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {popularKeywords.map((keyword) => (
              <Badge
                key={keyword}
                variant="outline"
                className="cursor-pointer hover:bg-orange-50 hover:border-orange-300 hover:text-orange-700 transition-all rounded-full border-2"
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
        <div className="relative">
          <SwipeableClassroomCard
            classroom={currentClassroom}
            onSwipeLeft={handleSwipeLeftAction}
            onSwipeRight={handleSwipeRightAction}
            onJoin={handleJoinClassroom}
          />
          
          {/* Undo Button */}
          {currentIndex > 0 && (
            <Button
              onClick={handleUndo}
              variant="outline"
              size="sm"
              className="absolute -top-2 -right-2 rounded-full w-10 h-10 p-0 bg-white shadow-lg border-2 hover:bg-gray-50"
            >
              <Undo2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}

      {/* Enhanced Progress Indicator */}
      <div className="text-center space-y-3">
        <div className="flex justify-center items-center gap-2">
          <div className="h-2 bg-gray-200 rounded-full flex-1 max-w-40 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / filteredClassrooms.length) * 100}%` }}
            />
          </div>
          <span className="text-xs text-gray-500 font-medium min-w-fit">
            {currentIndex + 1} / {filteredClassrooms.length}
          </span>
        </div>
        
        <p className="text-gray-500 text-sm">
          {filteredClassrooms.length} classrooms available
          {(searchKeywords.length > 0 || priceFilter !== 'all' || levelFilter !== 'all') && 
            <span className="text-orange-600"> (filtered)</span>
          }
        </p>
        
        {swipeHistory.length > 0 && (
          <div className="flex justify-center gap-4 text-xs">
            <span className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-full">
              <Heart className="h-3 w-3 text-green-500 fill-current" />
              <span className="font-medium">{likedClassrooms.length}</span>
            </span>
            <span className="flex items-center gap-1 bg-red-50 px-2 py-1 rounded-full">
              <X className="h-3 w-3 text-red-500" />
              <span className="font-medium">{passedClassrooms.length}</span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SwipeableClassroomView;
