
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, X } from "lucide-react";

interface SearchFiltersProps {
  keywordInput: string;
  setKeywordInput: (value: string) => void;
  searchKeywords: string[];
  showFilters: boolean;
  setShowFilters: (value: boolean) => void;
  priceFilter: 'all' | 'low' | 'medium' | 'high';
  setPriceFilter: (value: 'all' | 'low' | 'medium' | 'high') => void;
  levelFilter: 'all' | 'beginner' | 'intermediate' | 'advanced';
  setLevelFilter: (value: 'all' | 'beginner' | 'intermediate' | 'advanced') => void;
  onAddKeyword: () => void;
  onRemoveKeyword: (keyword: string) => void;
  onAddPopularKeyword: (keyword: string) => void;
  onResetFilters: () => void;
  popularKeywords: string[];
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  keywordInput,
  setKeywordInput,
  searchKeywords,
  showFilters,
  setShowFilters,
  priceFilter,
  setPriceFilter,
  levelFilter,
  setLevelFilter,
  onAddKeyword,
  onRemoveKeyword,
  onAddPopularKeyword,
  onResetFilters,
  popularKeywords
}) => {
  return (
    <div className="space-y-3">
      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search subjects..."
            value={keywordInput}
            onChange={(e) => setKeywordInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && onAddKeyword()}
            className="pl-9 h-9 text-sm border-border focus:border-primary/50"
          />
        </div>
        <Button 
          onClick={onAddKeyword} 
          size="sm"
          className="h-9 px-3 bg-primary hover:bg-primary/90"
        >
          Add
        </Button>
        <Button
          onClick={() => setShowFilters(!showFilters)}
          variant="outline"
          size="sm"
          className="h-9 px-3"
        >
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="p-3 bg-muted/30 rounded-lg space-y-3 border">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-medium">Filters</h4>
            <Button
              onClick={onResetFilters}
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs"
            >
              <X className="h-3 w-3 mr-1" />
              Clear
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Price Range</label>
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
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-background text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Skill Level</label>
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
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-background text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
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
              className="cursor-pointer hover:bg-destructive/10 hover:text-destructive text-xs h-6 px-2"
              onClick={() => onRemoveKeyword(keyword)}
            >
              {keyword} <X className="h-3 w-3 ml-1" />
            </Badge>
          ))}
        </div>
      )}

      {/* Popular Keywords */}
      <div>
        <p className="text-xs text-muted-foreground mb-1">Popular subjects:</p>
        <div className="flex flex-wrap gap-1">
          {popularKeywords.map((keyword) => (
            <Badge
              key={keyword}
              variant="outline"
              className="cursor-pointer hover:bg-primary/10 hover:border-primary/30 text-xs h-6 px-2"
              onClick={() => onAddPopularKeyword(keyword)}
            >
              {keyword}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;
