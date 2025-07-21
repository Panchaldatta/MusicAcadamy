
import React from 'react';
import { Heart, X, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SwipeProgressProps {
  currentIndex: number;
  totalClassrooms: number;
  isFiltered: boolean;
  likedCount: number;
  passedCount: number;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
}

const SwipeProgress: React.FC<SwipeProgressProps> = ({
  currentIndex,
  totalClassrooms,
  isFiltered,
  likedCount,
  passedCount,
  onResetFilters,
  hasActiveFilters
}) => {
  return (
    <div className="text-center space-y-3">
      {/* Progress Bar */}
      <div className="w-full bg-muted rounded-full h-1.5">
        <div 
          className="bg-primary h-1.5 rounded-full transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / totalClassrooms) * 100}%` }}
        />
      </div>
      
      {/* Progress Text */}
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground">
          {currentIndex + 1} of {totalClassrooms} classes
          {isFiltered && <span className="text-primary"> (filtered)</span>}
        </p>
        
        {/* Activity Summary */}
        {(likedCount > 0 || passedCount > 0) && (
          <div className="flex justify-center gap-4 text-xs">
            <span className="flex items-center gap-1">
              <Heart className="h-3 w-3 text-green-500 fill-current" />
              <span className="text-muted-foreground">{likedCount} liked</span>
            </span>
            <span className="flex items-center gap-1">
              <X className="h-3 w-3 text-red-500" />
              <span className="text-muted-foreground">{passedCount} passed</span>
            </span>
          </div>
        )}
        
        {/* Reset Filters Button */}
        {hasActiveFilters && (
          <Button 
            onClick={onResetFilters} 
            variant="ghost" 
            size="sm"
            className="h-7 px-3 text-xs"
          >
            <RotateCcw className="h-3 w-3 mr-1" />
            Reset Filters
          </Button>
        )}
      </div>
    </div>
  );
};

export default SwipeProgress;
