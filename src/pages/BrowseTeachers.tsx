
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useTeachers } from "@/hooks/useTeachers";
import { useTeacherFilters } from "@/hooks/useTeacherFilters";
import { useLenis } from "@/hooks/useLenis";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import FilterBar from "@/components/FilterBar";
import TeacherGrid from "@/components/TeacherGrid";
import LoadingState from "@/components/common/LoadingState";
import ErrorState from "@/components/common/ErrorState";
import { Button } from "@/components/ui/button";
import { ArrowUp, Sparkles, TrendingUp, Star, CheckCircle, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const BrowseTeachers = () => {
  const [searchParams] = useSearchParams();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { toast } = useToast();
  const { scrollToTop } = useLenis();
  const { data: teachers = [], isLoading, error } = useTeachers();
  const { filters, filteredAndSortedTeachers, updateFilter, clearFilters } = useTeacherFilters(teachers);

  // Handle payment success/failure notifications
  useEffect(() => {
    const paymentStatus = searchParams.get('payment');
    const sessionId = searchParams.get('session_id');

    if (paymentStatus === 'success' && sessionId) {
      // Verify payment and update booking status
      supabase.functions.invoke('verify-payment', {
        body: { sessionId }
      }).then(({ data, error }) => {
        if (error) {
          console.error('Payment verification error:', error);
        } else {
          toast({
            title: "🎉 Payment Successful!",
            description: "Your lesson has been booked successfully. You'll receive a confirmation email shortly.",
          });
        }
      });
    } else if (paymentStatus === 'cancelled') {
      toast({
        title: "Payment Cancelled",
        description: "Your lesson booking was cancelled. You can try again whenever you're ready.",
        variant: "destructive",
      });
    }
  }, [searchParams, toast]);

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
        title: "Search Applied ✨",
        description: `Showing results for your search criteria`,
      });
    }
  }, [searchParams, toast, updateFilter]);

  // Scroll to top functionality
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollToTop = () => {
    scrollToTop({ duration: 1.5 });
  };

  const handleClearFilters = () => {
    clearFilters();
    toast({
      title: "Filters Cleared 🧹",
      description: "All search filters have been reset",
    });
  };

  if (isLoading) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 pt-20">
          <LoadingState message="Finding the best music gurus for you..." />
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 pt-20">
          <ErrorState 
            title="Error Loading Teachers"
            message="Failed to load teachers. Please try again later."
            onRetry={() => window.location.reload()}
          />
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 pt-20">
        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {/* Enhanced Header */}
          <div className="text-center mb-12 sm:mb-16 relative animate-fade-in-down">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-red-400/20 rounded-3xl blur-3xl"></div>
            <div className="relative">
              <div className="flex justify-center mb-4 sm:mb-6">
                <div className="p-3 sm:p-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-full animate-scale-in">
                  <Sparkles className="h-8 sm:h-12 w-8 sm:w-12 text-white" />
                </div>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent px-4">
                Find Your Perfect Music Teacher
              </h1>
              <p className="text-gray-600 text-base sm:text-lg lg:text-xl max-w-4xl mx-auto leading-relaxed mb-6 sm:mb-8 px-4">
                Connect with expert gurus and master Indian classical music. Our verified teachers offer personalized lessons tailored to your learning style and musical goals.
              </p>
              
              {/* Stats */}
              <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-8 mb-6 sm:mb-8 animate-fade-in-up px-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Star className="h-4 sm:h-5 w-4 sm:w-5 text-yellow-400 fill-current" />
                    <span className="text-xl sm:text-2xl font-bold text-gray-900">{teachers.length}+</span>
                  </div>
                  <p className="text-gray-600 text-sm sm:text-base">Expert Teachers</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <TrendingUp className="h-4 sm:h-5 w-4 sm:w-5 text-green-500" />
                    <span className="text-xl sm:text-2xl font-bold text-gray-900">98%</span>
                  </div>
                  <p className="text-gray-600 text-sm sm:text-base">Success Rate</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Sparkles className="h-4 sm:h-5 w-4 sm:w-5 text-purple-500" />
                    <span className="text-xl sm:text-2xl font-bold text-gray-900">5000+</span>
                  </div>
                  <p className="text-gray-600 text-sm sm:text-base">Happy Students</p>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Filters */}
          <div className="animate-fade-in-up">
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

          {/* Teachers Grid */}
          <div className="relative animate-fade-in-up">
            <TeacherGrid teachers={filteredAndSortedTeachers} />
          </div>

          {/* No Results Enhancement */}
          {filteredAndSortedTeachers.length === 0 && teachers.length > 0 && (
            <div className="text-center py-16 animate-scale-in">
              <div className="w-32 h-32 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center mx-auto mb-8">
                <Star className="h-16 w-16 text-orange-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">No teachers match your criteria</h3>
              <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
                Try adjusting your search criteria or filters to discover amazing music teachers perfect for your learning journey.
              </p>
              <Button 
                onClick={handleClearFilters}
                className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-8 py-3 rounded-xl font-semibold"
              >
                Clear All Filters
              </Button>
            </div>
          )}
        </div>

        {/* Scroll to Top Button */}
        {showScrollTop && (
          <Button
            onClick={handleScrollToTop}
            className="fixed bottom-8 right-8 z-50 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
            size="lg"
          >
            <ArrowUp className="h-6 w-6" />
          </Button>
        )}
      </div>
      <Footer />
    </>
  );
};

export default BrowseTeachers;
