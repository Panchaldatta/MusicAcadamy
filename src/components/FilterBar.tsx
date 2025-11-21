
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Filter, X, SlidersHorizontal, Users } from "lucide-react";

interface FilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedSubject: string;
  onSubjectChange: (value: string) => void;
  selectedLocation?: string;
  onLocationChange?: (value: string) => void;
  selectedLevel?: string;
  onLevelChange?: (value: string) => void;
  priceRange: string;
  onPriceRangeChange: (value: string) => void;
  sortBy: string;
  onSortByChange: (value: string) => void;
  onClearFilters: () => void;
  resultCount: number;
  showLocation?: boolean;
  showLevel?: boolean;
}

const FilterBar = ({ 
  searchTerm, 
  onSearchChange, 
  selectedSubject, 
  onSubjectChange,
  selectedLocation,
  onLocationChange,
  selectedLevel,
  onLevelChange,
  priceRange, 
  onPriceRangeChange,
  sortBy,
  onSortByChange,
  onClearFilters,
  resultCount,
  showLocation = false,
  showLevel = false
}: FilterBarProps) => {
  const subjects = ["Sitar", "Tabla", "Vocals", "Flute", "Harmonium", "Violin", "Veena", "Sarod"];
  const levels = ["Beginner", "Intermediate", "Advanced"];
  const locations = ["Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata", "Pune", "Hyderabad"];
  const priceRanges = [
    { label: "Under ₹1500", value: "0-1500" },
    { label: "₹1500 - ₹2000", value: "1500-2000" },
    { label: "₹2000 - ₹2500", value: "2000-2500" },
    { label: "Above ₹2500", value: "2500+" }
  ];

  const sortOptions = [
    { label: "Highest Rated", value: "rating" },
    { label: "Price: Low to High", value: "price-low" },
    { label: "Price: High to Low", value: "price-high" },
    { label: "Most Reviews", value: "reviews" },
    { label: "Most Experienced", value: "experience" }
  ];

  const hasActiveFilters = searchTerm || selectedSubject !== 'all' || selectedLocation !== 'all' || priceRange !== 'all';

  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 mb-8 sm:mb-10 md:mb-12 border border-orange-100/50">
      {/* Header */}
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        <div className="p-2 sm:p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-full">
          <SlidersHorizontal className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
        </div>
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">Find Your Perfect Teacher</h2>
      </div>

      {/* Search and Filters */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
        {/* Search Input */}
        <div className="relative xl:col-span-2">
          <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
          <Input
            placeholder="Search by name, subject..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 sm:pl-12 h-11 sm:h-12 md:h-14 border-orange-200 focus:border-orange-500 focus:ring-orange-500 rounded-lg sm:rounded-xl text-sm sm:text-base md:text-lg bg-white/80 backdrop-blur-sm"
          />
        </div>
        
        {/* Subject Filter */}
        <Select value={selectedSubject} onValueChange={onSubjectChange}>
          <SelectTrigger className="h-11 sm:h-12 md:h-14 border-orange-200 focus:border-orange-500 rounded-lg sm:rounded-xl bg-white/80 backdrop-blur-sm text-sm sm:text-base">
            <SelectValue placeholder="All Subjects" />
          </SelectTrigger>
          <SelectContent className="rounded-xl bg-white/95 backdrop-blur-lg border-orange-100">
            <SelectItem value="all" className="rounded-lg">All Subjects</SelectItem>
            {subjects.map((subject) => (
              <SelectItem key={subject} value={subject} className="rounded-lg">
                {subject}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Location Filter */}
        {showLocation && onLocationChange && (
          <Select value={selectedLocation} onValueChange={onLocationChange}>
            <SelectTrigger className="h-11 sm:h-12 md:h-14 border-orange-200 focus:border-orange-500 rounded-lg sm:rounded-xl bg-white/80 backdrop-blur-sm text-sm sm:text-base">
              <SelectValue placeholder="All Locations" />
            </SelectTrigger>
            <SelectContent className="rounded-xl bg-white/95 backdrop-blur-lg border-orange-100">
              <SelectItem value="all" className="rounded-lg">All Locations</SelectItem>
              {locations.map((location) => (
                <SelectItem key={location} value={location} className="rounded-lg">
                  {location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {/* Level Filter */}
        {showLevel && onLevelChange && (
          <Select value={selectedLevel} onValueChange={onLevelChange}>
            <SelectTrigger className="h-11 sm:h-12 md:h-14 border-orange-200 focus:border-orange-500 rounded-lg sm:rounded-xl bg-white/80 backdrop-blur-sm text-sm sm:text-base">
              <SelectValue placeholder="All Levels" />
            </SelectTrigger>
            <SelectContent className="rounded-xl bg-white/95 backdrop-blur-lg border-orange-100">
              <SelectItem value="all" className="rounded-lg">All Levels</SelectItem>
              {levels.map((level) => (
                <SelectItem key={level} value={level} className="rounded-lg">
                  {level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {/* Price Range Filter */}
        <Select value={priceRange} onValueChange={onPriceRangeChange}>
          <SelectTrigger className="h-11 sm:h-12 md:h-14 border-orange-200 focus:border-orange-500 rounded-lg sm:rounded-xl bg-white/80 backdrop-blur-sm text-sm sm:text-base">
            <SelectValue placeholder="All Prices" />
          </SelectTrigger>
          <SelectContent className="rounded-xl bg-white/95 backdrop-blur-lg border-orange-100">
            <SelectItem value="all" className="rounded-lg">All Prices</SelectItem>
            {priceRanges.map((range) => (
              <SelectItem key={range.value} value={range.value} className="rounded-lg">
                {range.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Sort and Results */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3 sm:gap-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full lg:w-auto">
          <Select value={sortBy} onValueChange={onSortByChange}>
            <SelectTrigger className="w-full sm:w-48 h-10 sm:h-11 md:h-12 border-orange-200 focus:border-orange-500 rounded-lg sm:rounded-xl bg-white/80 backdrop-blur-sm text-sm sm:text-base">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="rounded-xl bg-white/95 backdrop-blur-lg border-orange-100">
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value} className="rounded-lg text-sm sm:text-base">
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {hasActiveFilters && (
            <Button 
              variant="outline" 
              onClick={onClearFilters}
              className="h-10 sm:h-11 md:h-12 border-orange-200 hover:bg-orange-50 text-orange-600 rounded-lg sm:rounded-xl transition-all duration-300 hover:scale-105 text-sm sm:text-base"
            >
              <X className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
              Clear Filters
            </Button>
          )}
        </div>
        
        <div className="flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-orange-100 to-red-100 px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-lg sm:rounded-xl border border-orange-200 w-full lg:w-auto">
          <div className="p-1.5 sm:p-2 bg-white rounded-full">
            <Users className="h-3 w-3 sm:h-4 sm:w-4 text-orange-600" />
          </div>
          <span className="font-semibold text-gray-900 text-sm sm:text-base">
            {resultCount} {resultCount === 1 ? 'teacher' : 'teachers'} found
          </span>
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-6 pt-6 border-t border-orange-100">
          <p className="text-sm font-medium text-gray-700 mb-3">Active Filters:</p>
          <div className="flex flex-wrap gap-2">
            {searchTerm && (
              <div className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                Search: "{searchTerm}"
              </div>
            )}
            {selectedSubject !== 'all' && (
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                Subject: {selectedSubject}
              </div>
            )}
            {selectedLocation && selectedLocation !== 'all' && (
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                Location: {selectedLocation}
              </div>
            )}
            {priceRange !== 'all' && (
              <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                Price: {priceRanges.find(r => r.value === priceRange)?.label}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterBar;
