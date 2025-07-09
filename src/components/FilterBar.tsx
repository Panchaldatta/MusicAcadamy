
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Filter, X } from "lucide-react";

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

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-orange-100">
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search by name, subject, or specialty..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 h-12 border-orange-200 focus:border-orange-500 rounded-lg"
          />
        </div>
        
        <Select value={selectedSubject} onValueChange={onSubjectChange}>
          <SelectTrigger className="w-full lg:w-48 h-12 border-orange-200 focus:border-orange-500 rounded-lg">
            <SelectValue placeholder="All Subjects" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Subjects</SelectItem>
            {subjects.map((subject) => (
              <SelectItem key={subject} value={subject}>
                {subject}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {showLocation && onLocationChange && (
          <Select value={selectedLocation} onValueChange={onLocationChange}>
            <SelectTrigger className="w-full lg:w-48 h-12 border-orange-200 focus:border-orange-500 rounded-lg">
              <SelectValue placeholder="All Locations" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              {locations.map((location) => (
                <SelectItem key={location} value={location}>
                  {location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {showLevel && onLevelChange && (
          <Select value={selectedLevel} onValueChange={onLevelChange}>
            <SelectTrigger className="w-full lg:w-48 h-12 border-orange-200 focus:border-orange-500 rounded-lg">
              <SelectValue placeholder="All Levels" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              {levels.map((level) => (
                <SelectItem key={level} value={level}>
                  {level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <Select value={priceRange} onValueChange={onPriceRangeChange}>
          <SelectTrigger className="w-full lg:w-48 h-12 border-orange-200 focus:border-orange-500 rounded-lg">
            <SelectValue placeholder="All Prices" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Prices</SelectItem>
            {priceRanges.map((range) => (
              <SelectItem key={range.value} value={range.value}>
                {range.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Select value={sortBy} onValueChange={onSortByChange}>
            <SelectTrigger className="w-48 border-orange-200 focus:border-orange-500 rounded-lg">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="students">Most Students</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            variant="outline" 
            onClick={onClearFilters}
            className="border-orange-200 hover:bg-orange-50 rounded-lg"
          >
            <X className="h-4 w-4 mr-2" />
            Clear Filters
          </Button>
        </div>
        
        <div className="flex items-center gap-2 text-gray-600">
          <Filter className="h-4 w-4" />
          <span>Showing {resultCount} results</span>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
