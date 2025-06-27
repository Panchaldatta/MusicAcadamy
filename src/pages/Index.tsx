
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Music, Search, Star, MapPin, Clock, Users, Award, Play, ArrowRight, Check, Trophy, BookOpen, Target, Guitar, Mic, Piano, Drum, Music2, MessageCircle, Heart, Shield } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import TeacherCard from "@/components/TeacherCard";
import MusicSubjectCard from "@/components/MusicSubjectCard";
import { useTeachers } from "@/hooks/useTeachers";
import { useMusicSubjects } from "@/hooks/useMusicSubjects";
import { useSiteStats } from "@/hooks/useSiteStats";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: teachers = [], isLoading: teachersLoading } = useTeachers();
  const { data: musicSubjects = [], isLoading: subjectsLoading } = useMusicSubjects();
  const { data: stats = [], isLoading: statsLoading } = useSiteStats();

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      toast({
        title: "Search Query Required",
        description: "Please enter what you want to learn",
        variant: "destructive"
      });
      return;
    }
    
    // Navigate to browse page with search parameters
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (locationQuery) params.set('location', locationQuery);
    
    navigate(`/browse-classrooms?${params.toString()}`);
    
    toast({
      title: "Search Started",
      description: `Searching for ${searchQuery} teachers...`
    });
  };

  const handleSubjectSelect = (subjectName: string) => {
    setSelectedSubject(subjectName);
    navigate(`/browse-classrooms?subject=${encodeURIComponent(subjectName)}`);
  };

  const handleFindGuru = () => {
    navigate('/browse-classrooms');
  };

  const handleBecomeTeacher = () => {
    navigate('/teacher-dashboard');
  };

  const handleViewAllGurus = () => {
    navigate('/browse-classrooms');
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-white">
        {/* Hero Section with Search */}
        <section className="bg-gradient-to-br from-orange-50 to-red-100 pt-20 pb-16">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                Learn from India's finest
                <span className="text-orange-600 block">music gurus</span>
              </h1>
              <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
                Master classical Indian music with expert teachers. Over 15,000 qualified gurus available for online and in-person lessons.
              </p>

              {/* Enhanced Search Bar */}
              <div className="bg-white rounded-xl shadow-lg p-2 max-w-3xl mx-auto mb-8">
                <div className="flex flex-col md:flex-row gap-2">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                      placeholder="What do you want to learn? (e.g., Tabla, Sitar, Classical Vocals)"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-12 h-14 text-lg border-0 focus:ring-0"
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                  </div>
                  <div className="flex-1 relative">
                    <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                      placeholder="Where? (Online or City)"
                      value={locationQuery}
                      onChange={(e) => setLocationQuery(e.target.value)}
                      className="pl-12 h-14 text-lg border-0 focus:ring-0"
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                  </div>
                  <Button 
                    size="lg" 
                    className="h-14 px-8 bg-orange-600 hover:bg-orange-700 text-white font-semibold"
                    onClick={handleSearch}
                  >
                    Search
                  </Button>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
                {statsLoading ? (
                  // Loading skeleton
                  [...Array(4)].map((_, index) => (
                    <div key={index} className="text-center animate-pulse">
                      <div className="h-8 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded"></div>
                    </div>
                  ))
                ) : (
                  stats.map((stat) => (
                    <div key={stat.id} className="text-center">
                      <div className="text-2xl md:text-3xl font-bold text-orange-600">{stat.value}</div>
                      <div className="text-gray-600">{stat.label}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Popular Subjects */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Popular Indian Musical Instruments</h2>
              <p className="text-gray-600 text-lg">Discover the rich heritage of Indian classical music</p>
            </div>

            {subjectsLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[...Array(8)].map((_, index) => (
                  <div key={index} className="animate-pulse">
                    <div className="bg-gray-200 rounded-lg h-32"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {musicSubjects.map((subject) => (
                  <MusicSubjectCard
                    key={subject.id}
                    subject={subject}
                    isSelected={selectedSubject === subject.name}
                    onClick={() => handleSubjectSelect(subject.name)}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Featured Teachers */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Music Gurus</h2>
              <p className="text-gray-600 text-lg">Learn from master musicians and acclaimed teachers</p>
            </div>

            {teachersLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="animate-pulse">
                    <div className="bg-gray-200 rounded-lg h-96"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {teachers.slice(0, 4).map((teacher) => (
                  <TeacherCard key={teacher.id} teacher={teacher} />
                ))}
              </div>
            )}

            <div className="text-center mt-10">
              <Button 
                size="lg" 
                variant="outline" 
                className="border-orange-600 text-orange-600 hover:bg-orange-50"
                onClick={handleViewAllGurus}
              >
                View All Gurus
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">How MuseSync Works</h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Begin your musical journey with India's finest teachers
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">1. Find Your Guru</h3>
                <p className="text-gray-600">
                  Browse through our verified music teachers and find the perfect guru for your learning goals.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">2. Book Your Lesson</h3>
                <p className="text-gray-600">
                  Contact your guru and schedule your first lesson. Choose between online or in-person options.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Music className="h-8 w-8 text-yellow-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">3. Start Learning</h3>
                <p className="text-gray-600">
                  Begin your musical journey with personalized lessons tailored to your skill level and goals.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-orange-600 to-red-600">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Begin Your Musical Journey?
            </h2>
            <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
              Join thousands of students learning Indian classical music with expert gurus on MuseSync
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-3"
                onClick={handleFindGuru}
              >
                Find a Guru
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white/10 px-8 py-3"
                onClick={handleBecomeTeacher}
              >
                Become a Teacher
              </Button>
            </div>
          </div>
        </section>
      </div>
      
      <Footer />
    </>
  );
};

export default Index;
