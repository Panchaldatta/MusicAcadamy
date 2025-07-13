
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import FilterBar from "@/components/FilterBar";
import ClassroomGrid from "@/components/ClassroomGrid";
import { useActiveClassrooms } from "@/hooks/useClassrooms";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const BrowseClassrooms = () => {
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || "");
  const [selectedSubject, setSelectedSubject] = useState(searchParams.get('subject') || "all");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [sortBy, setSortBy] = useState("rating");
  const { toast } = useToast();
  
  const { data: classrooms = [], isLoading, error } = useActiveClassrooms();

  // Initialize search term from URL params
  useEffect(() => {
    const searchParam = searchParams.get('search');
    const subjectParam = searchParams.get('subject');
    
    if (searchParam) setSearchTerm(searchParam);
    if (subjectParam) setSelectedSubject(subjectParam);
    
    if (searchParam || subjectParam) {
      toast({
        title: "Search Applied",
        description: `Showing results for your search criteria`,
      });
    }
  }, [searchParams, toast]);

  const filteredClassrooms = classrooms.filter(classroom => {
    const matchesSearch = searchTerm === "" || 
                         classroom.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         classroom.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         classroom.subject.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSubject = selectedSubject === "all" || classroom.subject === selectedSubject;
    const matchesLevel = selectedLevel === "all" || classroom.level === selectedLevel;
    
    const matchesPrice = priceRange === "all" || (() => {
      const [min, max] = priceRange.split('-').map(p => p.replace('+', ''));
      if (priceRange.includes('+')) {
        return classroom.price >= parseInt(min);
      }
      return classroom.price >= parseInt(min) && classroom.price <= parseInt(max);
    })();
    
    return matchesSearch && matchesSubject && matchesLevel && matchesPrice;
  });

  // Sort classrooms
  const sortedClassrooms = [...filteredClassrooms].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return 4.8 - 4.8; // Default rating until we implement ratings
      case 'students':
        return b.capacity - a.capacity; // Sort by capacity as proxy for popularity
      default:
        return b.capacity - a.capacity;
    }
  });

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedSubject("all");
    setSelectedLevel("all");
    setPriceRange("all");
    setSortBy("rating");
    toast({
      title: "Filters Cleared",
      description: "All search filters have been reset",
    });
  };

  if (error) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 pt-20">
          <div className="container mx-auto px-6 py-8">
            <Card className="bg-red-50 border-red-200">
              <CardContent className="p-6 text-center">
                <h2 className="text-xl font-semibold text-red-800 mb-2">Error Loading Classrooms</h2>
                <p className="text-red-600">There was an issue loading the classrooms. Please try again later.</p>
              </CardContent>
            </Card>
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
            <h1 className="text-5xl font-bold text-gray-900 mb-6">Browse Music Classrooms</h1>
            <p className="text-gray-600 text-xl max-w-3xl mx-auto leading-relaxed">
              Discover amazing Indian classical music classes taught by expert gurus. Join a community of passionate learners and master your chosen instrument.
            </p>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
              <span className="ml-2 text-gray-600">Loading classrooms...</span>
            </div>
          )}

          {/* Filters */}
          {!isLoading && (
            <FilterBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedSubject={selectedSubject}
              onSubjectChange={setSelectedSubject}
              selectedLevel={selectedLevel}
              onLevelChange={setSelectedLevel}
              priceRange={priceRange}
              onPriceRangeChange={setPriceRange}
              sortBy={sortBy}
              onSortByChange={setSortBy}
              onClearFilters={handleClearFilters}
              resultCount={sortedClassrooms.length}
              showLevel={true}
            />
          )}

          {/* Classrooms Grid */}
          {!isLoading && <ClassroomGrid classrooms={sortedClassrooms} />}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BrowseClassrooms;
