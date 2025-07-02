import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Music, Search, Star, MapPin, Clock, Users, Award, Play, ArrowRight, Check, Trophy, BookOpen, Target, Guitar, Mic, Piano, Drum, Music2, MessageCircle, Heart, Shield, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import TeacherCard from "@/components/TeacherCard";
import MusicSubjectCard from "@/components/MusicSubjectCard";
import { useTeachers } from "@/hooks/useTeachers";
import { useMusicSubjects } from "@/hooks/useMusicSubjects";
import { useSiteStats } from "@/hooks/useSiteStats";
import { useToast } from "@/hooks/use-toast";
import { type CarouselApi } from "@/components/ui/carousel";
import SwipeableCard from "@/components/SwipeableCard";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const [currentTeacherIndex, setCurrentTeacherIndex] = useState(0);
  const [showSwipeMode, setShowSwipeMode] = useState(false);

  const { data: teachers = [], isLoading: teachersLoading } = useTeachers();
  const { data: musicSubjects = [], isLoading: subjectsLoading } = useMusicSubjects();
  const { data: stats = [], isLoading: statsLoading } = useSiteStats();

  // Carousel navigation handlers
  const handlePrevious = useCallback(() => {
    carouselApi?.scrollPrev();
  }, [carouselApi]);

  const handleNext = useCallback(() => {
    carouselApi?.scrollNext();
  }, [carouselApi]);

  // Update scroll state when carousel API changes
  useEffect(() => {
    if (!carouselApi) return;

    const onSelect = () => {
      setCanScrollPrev(carouselApi.canScrollPrev());
      setCanScrollNext(carouselApi.canScrollNext());
    };

    carouselApi.on("select", onSelect);
    onSelect(); // Set initial state

    return () => {
      carouselApi.off("select", onSelect);
    };
  }, [carouselApi]);

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

  const handleStartSwiping = () => {
    setShowSwipeMode(true);
  };

  const handleExitSwipeMode = () => {
    setShowSwipeMode(false);
  };

  const handleTeacherSwipeLeft = useCallback(() => {
    toast({
      title: "Teacher Passed",
      description: "You can find them again in browse section",
    });
    
    // Move to next teacher
    if (currentTeacherIndex < teachers.length - 1) {
      setCurrentTeacherIndex(prev => prev + 1);
    }
  }, [toast, currentTeacherIndex, teachers.length]);

  const handleTeacherSwipeRight = useCallback(() => {
    toast({
      title: "Teacher Liked!",
      description: "Contact them to start learning",
    });
    
    // Move to next teacher
    if (currentTeacherIndex < teachers.length - 1) {
      setCurrentTeacherIndex(prev => prev + 1);
    }
  }, [toast, currentTeacherIndex, teachers.length]);

  // Get current teacher
  const currentTeacher = teachers[currentTeacherIndex];

  // Full-page swipe mode
  if (showSwipeMode) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-orange-50 to-red-100 z-50 overflow-hidden">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10 bg-white/90 backdrop-blur-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleExitSwipeMode}
              className="text-gray-700 hover:text-gray-900"
            >
              ← Back
            </Button>
            <div className="text-center">
              <h2 className="text-lg font-semibold text-gray-900">Discover Teachers</h2>
              <span className="text-sm text-gray-600">
                {currentTeacherIndex + 1} of {teachers.length}
              </span>
            </div>
            <div className="w-16"></div>
          </div>
        </div>

        {/* Swipe Instructions */}
        <div className="absolute top-24 left-0 right-0 z-10 px-6">
          <div className="flex items-center justify-center gap-8 bg-white/90 backdrop-blur-sm rounded-full px-6 py-3 mx-auto w-fit shadow-lg">
            <div className="flex items-center gap-2 text-red-500">
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
              <span className="text-sm font-medium">Swipe Left to Pass</span>
            </div>
            <div className="w-px h-6 bg-gray-300"></div>
            <div className="flex items-center gap-2 text-green-500">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium">Swipe Right to Like</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex items-center justify-center min-h-screen pt-32 pb-8 px-6">
          {currentTeacher ? (
            <SwipeableCard
              key={`${currentTeacher.id}-${currentTeacherIndex}`}
              onSwipeLeft={handleTeacherSwipeLeft}
              onSwipeRight={handleTeacherSwipeRight}
              className="w-full max-w-sm"
            >
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                {/* Teacher Image */}
                <div className="relative">
                  <img
                    src={currentTeacher.image_url || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face"}
                    alt={currentTeacher.name}
                    className="w-full h-80 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  
                  {/* Floating Elements */}
                  {currentTeacher.verified && (
                    <div className="absolute top-4 right-4 bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 shadow-lg">
                      <Shield className="h-3 w-3" />
                      Verified
                    </div>
                  )}
                  
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm text-orange-600 px-3 py-1 rounded-full text-sm font-bold">
                    ₹{currentTeacher.price}/hr
                  </div>

                  {/* Name and Subject at bottom */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white text-2xl font-bold mb-1">{currentTeacher.name}</h3>
                    <p className="text-orange-200 font-semibold text-lg">{currentTeacher.subject}</p>
                  </div>
                </div>

                {/* Card Details */}
                <div className="p-6 space-y-4">
                  {/* Rating */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-4 w-4 ${i < Math.floor(currentTeacher.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                      ))}
                    </div>
                    <span className="font-bold text-sm bg-gray-100 px-2 py-1 rounded-full">{currentTeacher.rating}</span>
                    <span className="text-gray-500 text-sm">({currentTeacher.reviews} reviews)</span>
                  </div>

                  {/* Details */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center">
                        <MapPin className="h-3 w-3 text-blue-600" />
                      </div>
                      {currentTeacher.location}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                        <Clock className="h-3 w-3 text-green-600" />
                      </div>
                      Responds in {currentTeacher.response_time}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <div className="w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center">
                        <Award className="h-3 w-3 text-purple-600" />
                      </div>
                      {currentTeacher.experience} experience
                    </div>
                  </div>

                  {/* Specialties */}
                  <div className="flex flex-wrap gap-2">
                    {currentTeacher.specialties.slice(0, 3).map((specialty, idx) => (
                      <span key={idx} className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">
                        {specialty}
                      </span>
                    ))}
                  </div>

                  {/* Languages */}
                  <div className="flex flex-wrap gap-1">
                    {currentTeacher.languages.map((lang, idx) => (
                      <span key={idx} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs font-medium">
                        {lang}
                      </span>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                      onClick={handleTeacherSwipeLeft}
                    >
                      Pass
                    </Button>
                    <Button 
                      size="lg" 
                      className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                      onClick={handleTeacherSwipeRight}
                    >
                      <Heart className="h-4 w-4 mr-2" />
                      Like
                    </Button>
                  </div>
                </div>
              </div>
            </SwipeableCard>
          ) : (
            <div className="text-center py-16 bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full">
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No more teachers!</h3>
              <p className="text-gray-600 mb-6">You've seen all our featured teachers.</p>
              <Button 
                size="lg" 
                className="bg-orange-600 hover:bg-orange-700 text-white w-full"
                onClick={() => {
                  handleExitSwipeMode();
                  handleViewAllGurus();
                }}
              >
                Browse All Teachers
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

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

        {/* Featured Teachers Preview */}
        <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
                Featured Music Gurus
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed mb-8">
                Discover amazing teachers with our swipe feature. Find your perfect music guru!
              </p>
              
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={handleStartSwiping}
              >
                Start Swiping
                <Heart className="ml-2 h-5 w-5" />
              </Button>
            </div>

            {/* Teacher Preview Cards */}
            {!teachersLoading && teachers.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {teachers.slice(0, 3).map((teacher) => (
                  <div key={teacher.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                    <div className="relative">
                      <img
                        src={teacher.image_url || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop&crop=face"}
                        alt={teacher.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-orange-600 px-2 py-1 rounded-full text-sm font-bold">
                        ₹{teacher.price}/hr
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-lg text-gray-900 mb-1">{teacher.name}</h3>
                      <p className="text-orange-600 font-semibold mb-2">{teacher.subject}</p>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`h-3 w-3 ${i < Math.floor(teacher.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">({teacher.reviews})</span>
                      </div>
                      <p className="text-sm text-gray-600">{teacher.location}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
