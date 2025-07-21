import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Music, Guitar, Mic, Piano, Clock, Users, Star, Search, Play } from "lucide-react";
import { useState } from "react";
import Navigation from "@/components/Navigation";

const CourseCatalog = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const courses = [
    {
      id: 1,
      title: "Beginner Guitar Fundamentals",
      instructor: "Sarah Johnson",
      category: "guitar",
      level: "Beginner",
      duration: "8 weeks",
      students: 1250,
      rating: 4.9,
      price: "Free",
      image: "/placeholder.svg",
      description: "Learn the basics of guitar playing from chord progressions to strumming patterns.",
      features: ["Chord charts", "Video lessons", "Practice tracks"]
    },
    {
      id: 2,
      title: "Vocal Technique Mastery",
      instructor: "Michael Chen",
      category: "vocal",
      level: "Intermediate",
      duration: "12 weeks",
      students: 890,
      rating: 4.8,
      price: "$49",
      image: "/placeholder.svg",
      description: "Advanced vocal techniques including breath control, range extension, and performance skills.",
      features: ["Breathing exercises", "Range building", "Performance tips"]
    },
    {
      id: 3,
      title: "Piano for Complete Beginners",
      instructor: "Emma Rodriguez",
      category: "piano",
      level: "Beginner",
      duration: "10 weeks",
      students: 2100,
      rating: 4.7,
      price: "$29",
      image: "/placeholder.svg",
      description: "Start your piano journey with proper technique and musical foundation.",
      features: ["Hand positioning", "Music theory", "Popular songs"]
    },
    {
      id: 4,
      title: "Jazz Improvisation Basics",
      instructor: "David Williams",
      category: "theory",
      level: "Advanced",
      duration: "16 weeks",
      students: 350,
      rating: 4.9,
      price: "$89",
      image: "/placeholder.svg",
      description: "Learn the fundamentals of jazz improvisation and develop your own musical voice.",
      features: ["Scale theory", "Chord progressions", "Solo techniques"]
    },
    {
      id: 5,
      title: "Songwriting & Composition",
      instructor: "Lisa Park",
      category: "theory",
      level: "Intermediate",
      duration: "14 weeks",
      students: 670,
      rating: 4.8,
      price: "$69",
      image: "/placeholder.svg",
      description: "Create compelling songs with strong melodies, harmonies, and lyrical content.",
      features: ["Lyric writing", "Melody creation", "Song structure"]
    },
    {
      id: 6,
      title: "Live Performance Confidence",
      instructor: "Robert Taylor",
      category: "performance",
      level: "Intermediate",
      duration: "6 weeks",
      students: 540,
      rating: 4.6,
      price: "$39",
      image: "/placeholder.svg",
      description: "Overcome stage fright and deliver powerful live performances.",
      features: ["Stage presence", "Audience engagement", "Performance anxiety"]
    }
  ];

  const categories = [
    { id: "all", name: "All Courses", icon: Music },
    { id: "guitar", name: "Guitar", icon: Guitar },
    { id: "vocal", name: "Vocals", icon: Mic },
    { id: "piano", name: "Piano", icon: Piano },
    { id: "theory", name: "Music Theory", icon: Music },
    { id: "performance", name: "Performance", icon: Users }
  ];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner": return "bg-green-600";
      case "Intermediate": return "bg-yellow-600";
      case "Advanced": return "bg-red-600";
      default: return "bg-gray-600";
    }
  };

  return (
    <>
      <Navigation />
      <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 min-h-screen pt-20">
        <div className="max-w-7xl mx-auto p-6 space-y-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">Course Catalog</h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Discover our comprehensive collection of music courses taught by industry professionals
            </p>
          </div>

          {/* Search and Filters */}
          <div className="space-y-6">
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search courses or instructors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-500"
              />
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`${
                    selectedCategory === category.id
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                      : "border-white/30 text-gray-300 hover:bg-white/10 hover:text-white"
                  } px-4 py-2 rounded-xl transition-all duration-300`}
                >
                  <category.icon className="h-4 w-4 mr-2" />
                  {category.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Course Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <Card key={course.id} className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-105 hover:shadow-xl overflow-hidden">
                <div className="relative">
                  <div className="h-48 bg-gradient-to-br from-purple-500/30 to-pink-500/30 flex items-center justify-center">
                    <Music className="h-16 w-16 text-white/50" />
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge className={`${getLevelColor(course.level)} text-white`}>
                      {course.level}
                    </Badge>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <Button size="sm" className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm">
                      <Play className="h-4 w-4 mr-1" />
                      Preview
                    </Button>
                  </div>
                </div>
                
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-lg line-clamp-2">{course.title}</CardTitle>
                  <CardDescription className="text-gray-300">
                    by {course.instructor}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-gray-300 text-sm line-clamp-2">{course.description}</p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {course.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {course.students.toLocaleString()}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-white font-medium">{course.rating}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-white">{course.price}</span>
                      {course.price !== "Free" && <span className="text-gray-400 text-sm">/course</span>}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-gray-400 text-xs font-medium">Includes:</p>
                    <div className="flex flex-wrap gap-1">
                      {course.features.map((feature, index) => (
                        <Badge key={index} variant="outline" className="border-white/20 text-gray-300 text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl transition-all duration-300">
                    {course.price === "Free" ? "Start Free Course" : "Enroll Now"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredCourses.length === 0 && (
            <div className="text-center py-12">
              <Music className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-white mb-2">No courses found</h3>
              <p className="text-gray-400">Try adjusting your search terms or category filters</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CourseCatalog;
