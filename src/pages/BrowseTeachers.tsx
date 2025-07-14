
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useTeachers } from "@/hooks/useTeachers";
import { useTeacherFilters } from "@/hooks/useTeacherFilters";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import FilterBar from "@/components/FilterBar";
import TeacherGrid from "@/components/TeacherGrid";
import LoadingState from "@/components/common/LoadingState";
import ErrorState from "@/components/common/ErrorState";
import { Search, Users, Star, MapPin } from "lucide-react";

const BrowseTeachers = () => {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { data: teachers = [], isLoading, error } = useTeachers();
  const { filters, filteredAndSortedTeachers, updateFilter, clearFilters } = useTeacherFilters(teachers);

  // Initialize search from URL params
  useEffect(() => {
    const searchParam = searchParams.get('search');
    const subjectParam = searchParams.get('subject');
    const locationParam = searchParams.get('location');
    
    if (searchParam) updateFilter('searchTerm', searchParam);
    if (subjectParam) updateFilter('selectedSubject', subjectParam);
    if (locationParam) updateFilter('selectedLocation', locationParam);
    
    if (searchParam || subjectParam || locationParam) {
      toast({
        title: "Search Applied",
        description: `Showing results for your search criteria`,
      });
    }
  }, [searchParams, toast, updateFilter]);

  const handleClearFilters = () => {
    clearFilters();
    toast({
      title: "Filters Cleared",
      description: "All search filters have been reset",
    });
  };

  if (isLoading) {
    return (
      <>
        <Navigation />
        <LoadingState message="Finding the best music gurus for you" />
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navigation />
        <ErrorState 
          title="Error Loading Teachers"
          message="Failed to load teachers. Please try again later."
          onRetry={() => window.location.reload()}
        />
        <Footer />
      </>
    );
  }

  // Calculate stats for the hero section
  const totalTeachers = teachers.length;
  const averageRating = teachers.length > 0 
    ? (teachers.reduce((sum, teacher) => sum + teacher.rating, 0) / teachers.length).toFixed(1)
    : "0";
  const uniqueSubjects = [...new Set(teachers.map(t => t.subject))].length;
  const uniqueLocations = [...new Set(teachers.map(t => t.location))].length;

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50">
        {/* Enhanced Hero Section */}
        <div className="relative pt-20 pb-16 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-600/10 to-red-600/10"></div>
          <div className="relative container mx-auto px-6">
            <div className="text-center mb-12">
              <h1 className="text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Discover Your Perfect
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600">
                  Music Guru
                </span>
              </h1>
              <p className="text-gray-600 text-xl max-w-4xl mx-auto leading-relaxed mb-8">
                Connect with expert teachers and master Indian classical music. Our verified instructors offer personalized lessons tailored to your learning style and musical goals.
              </p>
              
              {/* Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-8">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-orange-100">
                  <div className="flex items-center justify-center mb-2">
                    <Users className="h-8 w-8 text-orange-600" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900">{totalTeachers}+</div>
                  <div className="text-gray-600 text-sm">Expert Teachers</div>
                </div>
                
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-orange-100">
                  <div className="flex items-center justify-center mb-2">
                    <Star className="h-8 w-8 text-yellow-500" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900">{averageRating}</div>
                  <div className="text-gray-600 text-sm">Average Rating</div>
                </div>
                
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-orange-100">
                  <div className="flex items-center justify-center mb-2">
                    <Search className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900">{uniqueSubjects}</div>
                  <div className="text-gray-600 text-sm">Instruments</div>
                </div>
                
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-orange-100">
                  <div className="flex items-center justify-center mb-2">
                    <MapPin className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900">{uniqueLocations}</div>
                  <div className="text-gray-600 text-sm">Cities</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="container mx-auto px-6 pb-16">
          {/* Enhanced Filters */}
          <div className="mb-8">
            <FilterBar
              searchTerm={filters.searchTerm}
              onSearchChange={(value) => updateFilter('searchTerm', value)}
              selectedSubject={filters.selectedSubject}
              onSubjectChange={(value) => updateFilter('selectedSubject', value)}
              selectedLocation={filters.selectedLocation}
              onLocationChange={(value) => updateFilter('selectedLocation', value)}
              priceRange={filters.priceRange}
              onPriceRangeChange={(value) => updateFilter('priceRange', value)}
              sortBy={filters.sortBy}
              onSortByChange={(value) => updateFilter('sortBy', value)}
              onClearFilters={handleClearFilters}
              resultCount={filteredAndSortedTeachers.length}
              showLocation={true}
            />
          </div>

          {/* Results Summary */}
          {filteredAndSortedTeachers.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                {filteredAndSortedTeachers.length} Teachers Found
              </h2>
              <p className="text-gray-600">
                {filters.searchTerm && `Results for "${filters.searchTerm}" • `}
                {filters.selectedSubject !== "all" && `${filters.selectedSubject} • `}
                {filters.selectedLocation !== "all" && `${filters.selectedLocation} • `}
                Sorted by {filters.sortBy === 'rating' ? 'highest rated' : filters.sortBy}
              </p>
            </div>
          )}

          {/* Teachers Grid */}
          <TeacherGrid teachers={filteredAndSortedTeachers} />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BrowseTeachers;
