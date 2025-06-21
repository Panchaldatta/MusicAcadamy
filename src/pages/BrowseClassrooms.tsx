
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Users, Clock, Star, DollarSign } from "lucide-react";
import Navigation from "@/components/Navigation";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");

  const classrooms: Classroom[] = [
    {
      id: "1",
      name: "Piano Fundamentals",
      description: "Learn the basics of piano playing with proper finger technique and music theory.",
      subject: "Piano",
      teacher: "Sarah Johnson",
      studentsCount: 15,
      schedule: "Mon, Wed, Fri - 4:00 PM",
      level: "Beginner",
      price: 25,
      rating: 4.8
    },
    {
      id: "2",
      name: "Guitar Masterclass",
      description: "Advanced guitar techniques including jazz, classical, and contemporary styles.",
      subject: "Guitar",
      teacher: "Mike Rodriguez",
      studentsCount: 8,
      schedule: "Tue, Thu - 6:00 PM",
      level: "Advanced",
      price: 40,
      rating: 4.9
    },
    {
      id: "3",
      name: "Vocal Training Basics",
      description: "Develop your voice with proper breathing techniques and vocal exercises.",
      subject: "Vocals",
      teacher: "Emma Wilson",
      studentsCount: 12,
      schedule: "Mon, Wed - 5:30 PM",
      level: "Beginner",
      price: 30,
      rating: 4.7
    },
    {
      id: "4",
      name: "Jazz Piano Intermediate",
      description: "Explore jazz harmony, improvisation, and classic jazz standards.",
      subject: "Piano",
      teacher: "David Chen",
      studentsCount: 6,
      schedule: "Sat - 2:00 PM",
      level: "Intermediate",
      price: 35,
      rating: 4.9
    }
  ];

  const subjects = ["Piano", "Guitar", "Vocals", "Drums", "Violin", "Bass"];
  const levels = ["Beginner", "Intermediate", "Advanced"];

  const filteredClassrooms = classrooms.filter(classroom => {
    const matchesSearch = classroom.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         classroom.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         classroom.teacher.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject === "all" || classroom.subject === selectedSubject;
    const matchesLevel = selectedLevel === "all" || classroom.level === selectedLevel;
    
    return matchesSearch && matchesSubject && matchesLevel;
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

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="container mx-auto px-6 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">Browse Classrooms</h1>
            <p className="text-gray-300 text-lg">Discover amazing music classes taught by expert instructors</p>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search classrooms, teachers, or instruments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              />
            </div>
            
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger className="w-full md:w-48 bg-white/10 border-white/20 text-white">
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
              <SelectTrigger className="w-full md:w-48 bg-white/10 border-white/20 text-white">
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
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-gray-300">
              Showing {filteredClassrooms.length} classroom{filteredClassrooms.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Classrooms Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClassrooms.map((classroom) => (
              <Card key={classroom.id} className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-105">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge className={`${getLevelColor(classroom.level)} text-white`}>
                      {classroom.level}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-white text-sm">{classroom.rating}</span>
                    </div>
                  </div>
                  <CardTitle className="text-white text-lg">{classroom.name}</CardTitle>
                  <CardDescription className="text-gray-300">
                    by {classroom.teacher}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 text-sm mb-4">{classroom.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-gray-300 text-sm">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>{classroom.studentsCount} students</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        <span>${classroom.price}/session</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-gray-300 text-sm">
                      <Clock className="h-4 w-4" />
                      <span>{classroom.schedule}</span>
                    </div>
                  </div>

                  <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                    Join Classroom
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredClassrooms.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-300 text-lg">No classrooms found matching your criteria.</p>
              <p className="text-gray-400 mt-2">Try adjusting your search or filters.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default BrowseClassrooms;
