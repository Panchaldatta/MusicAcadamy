
import React, { useState, useMemo } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, RotateCcw, Heart, X, TrendingUp } from "lucide-react";
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

  // Filter classrooms based on keywords and exclude already swiped ones
  const filteredClassrooms = useMemo(() => {
    const swipedIds = getSwipedClassroomIds();
    let filtered = classrooms.filter(classroom => !swipedIds.includes(classroom.id));
    
    if (searchKeywords.length > 0) {
      filtered = filterClassroomsByKeywords(filtered, searchKeywords);
    }
    
    return filtered;
  }, [classrooms, searchKeywords, swipeHistory]);

  const currentClassroom = filteredClassrooms[currentIndex];

  // Popular keywords based on available subjects
  const popularKeywords = Object.keys(CLASSROOM_KEYWORDS).slice(0, 6);

  const handleSwipeLeftAction = (classroom: Classroom) => {
    handleSwipeLeft(classroom);
    setCurrentIndex(prev => prev + 1);
  };

  const handleSwipeRightAction = (classroom: Classroom) => {
    handleSwipeRight(classroom);
    setCurrentIndex(prev => prev + 1);
  };

  const handleJoinClassroom = (classroom: Classroom) => {
    toast({
      title: "Classroom Joined!",
      description: `You've successfully joined "${classroom.name}". Check your email for further instructions.`,
    });
    handleSwipeRightAction(classroom); // Automatically like when joining
  };

  const addKeyword = (keyword: string) => {
    if (!searchKeywords.includes(keyword)) {
      setSearchKeywords(prev => [...prev, keyword]);
      setCurrentIndex(0); // Reset to first card when keywords change
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

  const resetFilters = () => {
    setSearchKeywords([]);
    setCurrentIndex(0);
  };

  if (!currentClassroom && filteredClassrooms.length === 0) {
    return (
      <div className="text-center py-16 max-w-md mx-auto">
        <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Heart className="h-12 w-12 text-orange-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {searchKeywords.length > 0 ? "No matching classrooms!" : "No more classrooms!"}
        </h3>
        <p className="text-gray-600 mb-6">
          {searchKeywords.length > 0 
            ? "Try different keywords or clear your filters to see more classrooms."
            : "You've seen all available classrooms. Check back later for new additions!"
          }
        </p>
        
        {searchKeywords.length > 0 && (
          <Button onClick={resetFilters} variant="outline">
            <RotateCcw className="h-4 w-4 mr-2" />
            Clear Filters
          </Button>
        )}
        
        {swipeHistory.length > 0 && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Your Activity</h4>
            <div className="flex justify-center gap-4 text-sm">
              <span className="flex items-center gap-1">
                <Heart className="h-4 w-4 text-green-500" />
                {likedClassrooms.length} Liked
              </span>
              <span className="flex items-center gap-1">
                <X className="h-4 w-4 text-red-500" />
                {passedClassrooms.length} Passed
              </span>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto space-y-6">
      {/* Keyword Search */}
      <div className="space-y-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Add keywords (e.g., vocals, tabla, classical)"
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleKeywordInputSubmit()}
              className="pl-10"
            />
          </div>
          <Button onClick={handleKeywordInputSubmit} size="sm">
            Add
          </Button>
        </div>

        {/* Active Keywords */}
        {searchKeywords.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {searchKeywords.map((keyword) => (
              <Badge
                key={keyword}
                variant="secondary"
                className="cursor-pointer hover:bg-red-100"
                onClick={() => removeKeyword(keyword)}
              >
                {keyword} ×
              </Badge>
            ))}
          </div>
        )}

        {/* Popular Keywords */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <TrendingUp className="h-4 w-4" />
            <span>Popular subjects:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {popularKeywords.map((keyword) => (
              <Badge
                key={keyword}
                variant="outline"
                className="cursor-pointer hover:bg-orange-50 hover:border-orange-300"
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

      {/* Progress Indicator */}
      <div className="text-center">
        <p className="text-gray-500 text-sm">
          {currentIndex + 1} of {filteredClassrooms.length} classrooms
          {searchKeywords.length > 0 && ` (filtered by: ${searchKeywords.join(', ')})`}
        </p>
        
        {swipeHistory.length > 0 && (
          <div className="mt-2 flex justify-center gap-4 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <Heart className="h-3 w-3 text-green-500" />
              {likedClassrooms.length}
            </span>
            <span className="flex items-center gap-1">
              <X className="h-3 w-3 text-red-500" />
              {passedClassrooms.length}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SwipeableClassroomView;
