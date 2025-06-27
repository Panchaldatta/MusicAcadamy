
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Users, Clock, Star, DollarSign, Heart, MapPin, Award, CheckCircle } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useTeachers, Teacher } from "@/hooks/useTeachers";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const BrowseTeachers = () => {
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || "");
  const [selectedSubject, setSelectedSubject] = useState(searchParams.get('subject') || "all");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [sortBy, setSortBy] = useState("rating");
  const [favorites, setFavorites] = useState<string[]>([]);
  const { toast } = useToast();
  const { data: teachers = [], isLoading, error } = useTeachers();

  const subjects = ["Sitar", "Tabla", "Vocals", "Flute", "Harmonium", "Violin", "Veena", "Sarod"];
  const levels = ["Beginner", "Intermediate", "Advanced"];
  const locations = ["Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata", "Pune", "Hyderabad"];
  const priceRanges = [
    { label: "Under ₹1000", value: "0-1000" },
    { label: "₹1000 - ₹2000", value: "1000-2000" },
    { label: "₹2000 - ₹3000", value: "2000-3000" },
    { label: "Above ₹3000", value: "3000+" }
  ];

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

  const handleBookLesson = (teacherId: string, teacherName: string) => {
    toast({
      title: "Lesson Booked!",
      description: `You've successfully booked a lesson with ${teacherName}. Check your email for confirmation.`,
    });
  };

  const toggleFavorite = (teacherId: string) => {
    setFavorites(prev => {
      const newFavorites = prev.includes(teacherId) 
        ? prev.filter(id => id !== teacherId)
        : [...prev, teacherId];
      
      toast({
        title: prev.includes(teacherId) ? "Removed from Favorites" : "Added to Favorites",
        description: prev.includes(teacherId) 
          ? "Teacher removed from your favorites" 
          : "Teacher added to your favorites",
      });
      
      return newFavorites;
    });
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedSubject("all");
    setSelectedLocation("all");
    setSelectedLevel("all");
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
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading teachers...</p>
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
            <p className="text-red-600 mb-4">Error loading teachers. Please try again later.</p>
            <Button onClick={() => window.location.reload()}>
              Retry
            </Button>
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
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Find Your Perfect Music Teacher</h1>
            <p className="text-gray-600 text-lg">Connect with expert gurus and master Indian classical music</p>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search teachers, instruments, or specialties..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 border-orange-200 focus:border-orange-500"
                />
              </div>
              
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger className="w-full lg:w-48 h-12 border-orange-200 focus:border-orange-500">
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

              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger className="w-full lg:w-48 h-12 border-orange-200 focus:border-orange-500">
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

              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger className="w-full lg:w-48 h-12 border-orange-200 focus:border-orange-500">
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
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48 border-orange-200 focus:border-orange-500">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="experience">Most Experienced</SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  variant="outline" 
                  onClick={handleClearFilters}
                  className="border-orange-200 hover:bg-orange-50"
                >
                  Clear Filters
                </Button>
              </div>
              
              <div className="text-gray-600">
                Showing {sortedTeachers.length} teacher{sortedTeachers.length !== 1 ? 's' : ''}
              </div>
            </div>
          </div>

          {/* Teachers Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedTeachers.map((teacher) => (
              <Card key={teacher.id} className="bg-white border-orange-200 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                <CardHeader>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-xl">
                          {teacher.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900">{teacher.name}</h3>
                          {teacher.verified && (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          )}
                        </div>
                        <p className="text-orange-600 font-medium">{teacher.subject}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleFavorite(teacher.id)}
                      className={`p-2 rounded-full transition-colors ${
                        favorites.includes(teacher.id) 
                          ? 'text-red-500 hover:text-red-600' 
                          : 'text-gray-400 hover:text-red-500'
                      }`}
                    >
                      <Heart className={`h-5 w-5 ${favorites.includes(teacher.id) ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-gray-900 text-sm font-medium">{teacher.rating}</span>
                      <span className="text-gray-500 text-sm">({teacher.reviews} reviews)</span>
                    </div>
                    <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200">
                      {teacher.experience}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <MapPin className="h-4 w-4" />
                      <span>{teacher.location}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <Clock className="h-4 w-4" />
                      <span>Responds in {teacher.response_time}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <DollarSign className="h-4 w-4" />
                      <span>₹{teacher.price}/lesson</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-900 mb-2">Specialties:</p>
                    <div className="flex flex-wrap gap-1">
                      {teacher.specialties.slice(0, 3).map((specialty, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                      {teacher.specialties.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{teacher.specialties.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-900 mb-2">Languages:</p>
                    <div className="flex flex-wrap gap-1">
                      {teacher.languages.map((language, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {language}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button 
                    className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white"
                    onClick={() => handleBookLesson(teacher.id, teacher.name)}
                  >
                    Book Lesson
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {sortedTeachers.length === 0 && (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="h-12 w-12 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No teachers found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your search criteria or filters.</p>
              <Button 
                onClick={handleClearFilters}
                className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white"
              >
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BrowseTeachers;
