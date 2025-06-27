import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Users, Clock, Star, DollarSign, Heart, BookmarkPlus } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

interface Classroom {
  id: string;
  name: string;
  description: string;
  subject: string;
  teacher: string;
  studentsCount: number;
  schedule: string;
  level: string;
  price: number;
  rating: number;
  image?: string;
}

const BrowseClassrooms = () => {
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || "");
  const [selectedSubject, setSelectedSubject] = useState(searchParams.get('subject') || "all");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [sortBy, setSortBy] = useState("rating");
  const [favorites, setFavorites] = useState<string[]>([]);
  const { toast } = useToast();

  const classrooms: Classroom[] = [
    {
      id: "1",
      name: "Sitar Basics for Beginners",
      description: "Learn the fundamentals of sitar playing with traditional Indian ragas and proper finger techniques.",
      subject: "Sitar",
      teacher: "Pandit Ravi Sharma",
      studentsCount: 15,
      schedule: "Mon, Wed, Fri - 4:00 PM IST",
      level: "Beginner",
      price: 1500,
      rating: 4.8
    },
    {
      id: "2",
      name: "Tabla Advanced Rhythms",
      description: "Master complex tabla compositions and traditional Indian percussion techniques.",
      subject: "Tabla",
      teacher: "Ustad Zakir Khan",
      studentsCount: 8,
      schedule: "Tue, Thu - 6:00 PM IST",
      level: "Advanced",
      price: 2500,
      rating: 4.9
    },
    {
      id: "3",
      name: "Classical Vocals - Hindustani",
      description: "Develop your voice with classical Indian vocal techniques, breathing exercises, and ragas.",
      subject: "Vocals",
      teacher: "Vidushi Parveen Sultana",
      studentsCount: 12,
      schedule: "Mon, Wed - 5:30 PM IST",
      level: "Beginner",
      price: 1800,
      rating: 4.7
    },
    {
      id: "4",
      name: "Flute Intermediate Techniques",
      description: "Explore melodic patterns and advanced breathing techniques for Indian classical flute.",
      subject: "Flute",
      teacher: "Pandit Hariprasad Chaurasia Jr.",
      studentsCount: 6,
      schedule: "Sat - 2:00 PM IST",
      level: "Intermediate",
      price: 2000,
      rating: 4.9
    },
    {
      id: "5",
      name: "Harmonium Basics",
      description: "Learn to play harmonium with basic chord progressions and classical accompaniment.",
      subject: "Harmonium",
      teacher: "Shri Vinod Prasad",
      studentsCount: 20,
      schedule: "Daily - 7:00 PM IST",
      level: "Beginner",
      price: 1200,
      rating: 4.6
    },
    {
      id: "6",
      name: "Violin - Carnatic Style",
      description: "Master South Indian classical violin techniques with traditional compositions.",
      subject: "Violin",
      teacher: "Vidwan Lalgudi Jayaraman",
      studentsCount: 10,
      schedule: "Tue, Fri - 3:00 PM IST",
      level: "Intermediate",
      price: 2200,
      rating: 4.8
    }
  ];

  const subjects = ["Sitar", "Tabla", "Vocals", "Flute", "Harmonium", "Violin", "Veena", "Sarod"];
  const levels = ["Beginner", "Intermediate", "Advanced"];
  const priceRanges = [
    { label: "Under ₹1500", value: "0-1500" },
    { label: "₹1500 - ₹2000", value: "1500-2000" },
    { label: "₹2000 - ₹2500", value: "2000-2500" },
    { label: "Above ₹2500", value: "2500+" }
  ];

  // Initialize search term from URL params
  useEffect(() => {
    const searchParam = searchParams.get('search');
    const subjectParam = searchParams.get('subject');
    const locationParam = searchParams.get('location');
    
    if (searchParam) setSearchTerm(searchParam);
    if (subjectParam) setSelectedSubject(subjectParam);
    
    if (searchParam || subjectParam || locationParam) {
      toast({
        title: "Search Applied",
        description: `Showing results for your search criteria`,
      });
    }
  }, [searchParams, toast]);

  const filteredClassrooms = classrooms.filter(classroom => {
    const matchesSearch = searchTerm === "" || 
                         classroom.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         classroom.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         classroom.teacher.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
        return b.rating - a.rating;
      case 'students':
        return b.studentsCount - a.studentsCount;
      default:
        return b.rating - a.rating;
    }
  });

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner':
        return 'bg-green-500';
      case 'intermediate':
        return 'bg-yellow-500';
      case 'advanced':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const handleJoinClassroom = (classroomId: string, classroomName: string) => {
    toast({
      title: "Classroom Joined!",
      description: `You've successfully joined "${classroomName}". Check your email for further instructions.`,
    });
  };

  const toggleFavorite = (classroomId: string) => {
    setFavorites(prev => {
      const newFavorites = prev.includes(classroomId) 
        ? prev.filter(id => id !== classroomId)
        : [...prev, classroomId];
      
      toast({
        title: prev.includes(classroomId) ? "Removed from Favorites" : "Added to Favorites",
        description: prev.includes(classroomId) 
          ? "Classroom removed from your favorites" 
          : "Classroom added to your favorites",
      });
      
      return newFavorites;
    });
  };

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

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 pt-20">
        <div className="container mx-auto px-6 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Browse Music Classrooms</h1>
            <p className="text-gray-600 text-lg">Discover amazing Indian classical music classes taught by expert gurus</p>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search classrooms, teachers, or instruments..."
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

              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger className="w-full lg:w-48 h-12 border-orange-200 focus:border-orange-500">
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
                    <SelectItem value="students">Most Students</SelectItem>
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
                Showing {sortedClassrooms.length} classroom{sortedClassrooms.length !== 1 ? 's' : ''}
              </div>
            </div>
          </div>

          {/* Classrooms Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedClassrooms.map((classroom) => (
              <Card key={classroom.id} className="bg-white border-orange-200 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge className={`${getLevelColor(classroom.level)} text-white`}>
                      {classroom.level}
                    </Badge>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleFavorite(classroom.id)}
                        className={`p-1 rounded-full transition-colors ${
                          favorites.includes(classroom.id) 
                            ? 'text-red-500 hover:text-red-600' 
                            : 'text-gray-400 hover:text-red-500'
                        }`}
                      >
                        <Heart className={`h-5 w-5 ${favorites.includes(classroom.id) ? 'fill-current' : ''}`} />
                      </button>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-gray-900 text-sm font-medium">{classroom.rating}</span>
                      </div>
                    </div>
                  </div>
                  <CardTitle className="text-gray-900 text-lg">{classroom.name}</CardTitle>
                  <CardDescription className="text-orange-600 font-medium">
                    by {classroom.teacher}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm mb-4">{classroom.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-gray-600 text-sm">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>{classroom.studentsCount} students</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        <span>₹{classroom.price}/month</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <Clock className="h-4 w-4" />
                      <span>{classroom.schedule}</span>
                    </div>
                  </div>

                  <Button 
                    className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white"
                    onClick={() => handleJoinClassroom(classroom.id, classroom.name)}
                  >
                    Join Classroom
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {sortedClassrooms.length === 0 && (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="h-12 w-12 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No classrooms found</h3>
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

export default BrowseClassrooms;
