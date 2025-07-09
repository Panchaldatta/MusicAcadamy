
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useTeachers } from "@/hooks/useTeachers";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import FilterBar from "@/components/FilterBar";
import TeacherGrid from "@/components/TeacherGrid";

const BrowseTeachers = () => {
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || "");
  const [selectedSubject, setSelectedSubject] = useState(searchParams.get('subject') || "all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [sortBy, setSortBy] = useState("rating");
  const { toast } = useToast();
  const { data: teachers = [], isLoading, error } = useTeachers();

  // Initialize search term from URL params
  useEffect(() => {
    const searchParam = searchParams.get('search');
    const subjectParam = searchParams.get('subject');
    const locationParam = searchParams.get('location');
    
    if (searchParam) setSearchTerm(searchParam);
    if (subjectParam) setSelectedSubject(subjectParam);
    if (locationParam) setSelectedLocation(locationParam);
    
    if (searchParam || subjectParam || locationParam) {
      toast({
        title: "Search Applied",
        description: `Showing results for your search criteria`,
      });
    }
  }, [searchParams, toast]);

  const filteredTeachers = teachers.filter(teacher => {
    const matchesSearch = searchTerm === "" || 
                         teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         teacher.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         teacher.specialties.some(specialty => 
                           specialty.toLowerCase().includes(searchTerm.toLowerCase())
                         );
    
    const matchesSubject = selectedSubject === "all" || teacher.subject === selectedSubject;
    const matchesLocation = selectedLocation === "all" || teacher.location === selectedLocation;
    
    const matchesPrice = priceRange === "all" || (() => {
      const [min, max] = priceRange.split('-').map(p => p.replace('+', ''));
      if (priceRange.includes('+')) {
        return teacher.price >= parseInt(min);
      }
      return teacher.price >= parseInt(min) && teacher.price <= parseInt(max);
    })();
    
    return matchesSearch && matchesSubject && matchesLocation && matchesPrice;
  });

  // Sort teachers
  const sortedTeachers = [...filteredTeachers].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'experience':
        return b.experience.localeCompare(a.experience);
      default:
        return b.rating - a.rating;
    }
  });

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedSubject("all");
    setSelectedLocation("all");
    setPriceRange("all");
    setSortBy("rating");
    toast({
      title: "Filters Cleared",
      description: "All search filters have been reset",
    });
  };

  if (isLoading) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 pt-20 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-600 mx-auto mb-6"></div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Loading Teachers...</h3>
            <p className="text-gray-600">Finding the best music gurus for you</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 pt-20 flex items-center justify-center">
          <div className="text-center">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-red-600 text-4xl">⚠️</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Teachers</h3>
            <p className="text-red-600 mb-6">Failed to load teachers. Please try again later.</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-6 py-3 rounded-lg"
            >
              Retry
            </button>
          </div>
        </div>
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
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedSubject={selectedSubject}
            onSubjectChange={setSelectedSubject}
            selectedLocation={selectedLocation}
            onLocationChange={setSelectedLocation}
            priceRange={priceRange}
            onPriceRangeChange={setPriceRange}
            sortBy={sortBy}
            onSortByChange={setSortBy}
            onClearFilters={handleClearFilters}
            resultCount={sortedTeachers.length}
            showLocation={true}
          />

          {/* Teachers Grid */}
          <TeacherGrid teachers={sortedTeachers} />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BrowseTeachers;
