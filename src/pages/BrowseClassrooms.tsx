
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import FilterBar from "@/components/FilterBar";
import ClassroomGrid from "@/components/ClassroomGrid";

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
  const { toast } = useToast();

  const classrooms: Classroom[] = [
    {
      id: "1",
      name: "Sitar Basics for Beginners",
      description: "Learn the fundamentals of sitar playing with traditional Indian ragas and proper finger techniques. Master the art of string manipulation and understand the cultural significance of this beautiful instrument.",
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
      description: "Master complex tabla compositions and traditional Indian percussion techniques. Dive deep into classical talas and learn to accompany various musical forms.",
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
      description: "Develop your voice with classical Indian vocal techniques, breathing exercises, and ragas. Learn traditional compositions and improvisation skills.",
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
      description: "Explore melodic patterns and advanced breathing techniques for Indian classical flute. Focus on ornamentation and emotional expression through music.",
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
      description: "Learn to play harmonium with basic chord progressions and classical accompaniment. Perfect for beginners wanting to understand Indian classical music.",
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
      description: "Master South Indian classical violin techniques with traditional compositions. Learn the unique bowing styles and melodic approaches of Carnatic music.",
      subject: "Violin",
      teacher: "Vidwan Lalgudi Jayaraman",
      studentsCount: 10,
      schedule: "Tue, Fri - 3:00 PM IST",
      level: "Intermediate",
      price: 2200,
      rating: 4.8
    }
  ];

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
            <h1 className="text-5xl font-bold text-gray-900 mb-6">Browse Music Classrooms</h1>
            <p className="text-gray-600 text-xl max-w-3xl mx-auto leading-relaxed">
              Discover amazing Indian classical music classes taught by expert gurus. Join a community of passionate learners and master your chosen instrument.
            </p>
          </div>

          {/* Filters */}
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

          {/* Classrooms Grid */}
          <ClassroomGrid classrooms={sortedClassrooms} />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BrowseClassrooms;
