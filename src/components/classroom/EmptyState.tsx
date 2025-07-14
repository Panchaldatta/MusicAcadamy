
import React from 'react';
import { Button } from "@/components/ui/button";
import { RotateCcw, Heart, X } from "lucide-react";

interface EmptyStateProps {
  hasFilters: boolean;
  likedCount: number;
  passedCount: number;
  onResetFilters: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  hasFilters,
  likedCount,
  passedCount,
  onResetFilters
}) => {
  return (
    <div className="text-center py-12 max-w-sm mx-auto">
      <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
        <span className="text-2xl">🎵</span>
      </div>
      
      <h3 className="text-lg font-semibold mb-2">
        {hasFilters ? "No matches found" : "All done!"}
      </h3>
      
      <p className="text-muted-foreground text-sm mb-6">
        {hasFilters
          ? "Try adjusting your filters to discover more classes."
          : "You've explored all available classes. New ones are added regularly!"
        }
      </p>
      
      <div className="space-y-3">
        {hasFilters && (
          <Button onClick={onResetFilters} variant="outline" className="w-full">
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset Filters
          </Button>
        )}
        
        {(likedCount > 0 || passedCount > 0) && (
          <div className="p-3 bg-muted/30 rounded-lg border">
            <p className="text-sm font-medium mb-2">Your activity:</p>
            <div className="flex justify-center gap-4 text-sm">
              <span className="flex items-center gap-1">
                <Heart className="h-4 w-4 text-green-500 fill-current" />
                <span>{likedCount} liked</span>
              </span>
              <span className="flex items-center gap-1">
                <X className="h-4 w-4 text-red-500" />
                <span>{passedCount} passed</span>
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmptyState;
