
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

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 pt-20">
        <div className="container mx-auto px-6 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">Find Your Perfect Music Teacher</h1>
            <p className="text-gray-600 text-xl max-w-3xl mx-auto leading-relaxed">
              Connect with expert gurus and master Indian classical music. Our verified teachers offer personalized lessons tailored to your learning style and goals.
            </p>
          </div>

          {/* Filters */}
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

          {/* Teachers Grid */}
          <TeacherGrid teachers={filteredAndSortedTeachers} />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BrowseTeachers;
