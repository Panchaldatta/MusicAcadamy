
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Music, Search, Star, MapPin, Clock, Users, Award, Play, ArrowRight, Check, Trophy, BookOpen, Target, Guitar, Mic, Piano, Drum, Music2, MessageCircle, Heart, Shield, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useCallback } from "react";
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

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

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
  React.useEffect(() => {
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

        {/* Enhanced Featured Teachers Slider */}
        <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
                Featured Music Gurus
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Learn from master musicians and acclaimed teachers who have shaped the world of Indian classical music
              </p>
            </div>

            {teachersLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="animate-pulse">
                    <div className="bg-gray-200 rounded-2xl h-[420px]"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="relative max-w-7xl mx-auto">
                {/* Enhanced Navigation Controls */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={handlePrevious}
                      disabled={!canScrollPrev}
                      className={`
                        h-12 w-12 rounded-full border-2 shadow-lg transition-all duration-300 transform hover:scale-110
                        ${!canScrollPrev 
                          ? 'border-gray-200 text-gray-400 cursor-not-allowed' 
                          : 'border-orange-300 text-orange-600 hover:bg-orange-50 hover:border-orange-400 hover:shadow-xl'
                        }
                      `}
                    >
                      <ChevronLeft className="h-6 w-6" />
                      <span className="sr-only">Previous teachers</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={handleNext}
                      disabled={!canScrollNext}
                      className={`
                        h-12 w-12 rounded-full border-2 shadow-lg transition-all duration-300 transform hover:scale-110
                        ${!canScrollNext 
                          ? 'border-gray-200 text-gray-400 cursor-not-allowed' 
                          : 'border-orange-300 text-orange-600 hover:bg-orange-50 hover:border-orange-400 hover:shadow-xl'
                        }
                      `}
                    >
                      <ChevronRight className="h-6 w-6" />
                      <span className="sr-only">Next teachers</span>
                    </Button>
                  </div>
                  
                  <div className="hidden md:block text-sm text-gray-500">
                    Swipe or use arrows to navigate
                  </div>
                </div>

                <Carousel
                  setApi={setCarouselApi}
                  opts={{
                    align: "center",
                    loop: true,
                    skipSnaps: false,
                    dragFree: true,
                  }}
                  className="w-full"
                >
                  <CarouselContent className="-ml-4 md:-ml-6">
                    {teachers.map((teacher, index) => (
                      <CarouselItem 
                        key={teacher.id} 
                        className="pl-4 md:pl-6 basis-[280px] md:basis-[320px] lg:basis-[350px]"
                      >
                        <div className="h-full transform transition-all duration-500 hover:scale-[1.02] hover:-translate-y-2">
                          <div className="relative group">
                            {/* Enhanced Teacher Card with Modern Design */}
                            <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 overflow-hidden">
                              {/* Teacher Image with Overlay */}
                              <div className="relative overflow-hidden">
                                <img
                                  src={teacher.image_url || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=350&h=280&fit=crop&crop=face"}
                                  alt={teacher.name}
                                  className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                
                                {/* Floating Elements */}
                                {teacher.verified && (
                                  <div className="absolute top-4 right-4 bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 shadow-lg">
                                    <Shield className="h-3 w-3" />
                                    Verified
                                  </div>
                                )}
                                
                                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-orange-600 px-3 py-1 rounded-full text-sm font-bold">
                                  ₹{teacher.price}/hr
                                </div>

                                {/* Specialties at bottom */}
                                <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                                  {teacher.specialties.slice(0, 2).map((specialty, idx) => (
                                    <span key={idx} className="bg-white/95 backdrop-blur-sm text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
                                      {specialty}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              {/* Card Content */}
                              <div className="p-6">
                                <div className="flex justify-between items-start mb-3">
                                  <h3 className="font-bold text-xl text-gray-900 group-hover:text-orange-600 transition-colors duration-300">
                                    {teacher.name}
                                  </h3>
                                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                    <Heart className="h-4 w-4" />
                                  </Button>
                                </div>

                                <p className="text-orange-600 font-semibold mb-4 text-lg">{teacher.subject}</p>

                                {/* Enhanced Rating */}
                                <div className="flex items-center gap-2 mb-4">
                                  <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                      <Star key={i} className={`h-4 w-4 ${i < Math.floor(teacher.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                                    ))}
                                  </div>
                                  <span className="font-bold text-sm bg-gray-100 px-2 py-1 rounded-full">{teacher.rating}</span>
                                  <span className="text-gray-500 text-sm">({teacher.reviews})</span>
                                </div>

                                {/* Enhanced Details */}
                                <div className="space-y-3 mb-5">
                                  <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center">
                                      <MapPin className="h-3 w-3 text-blue-600" />
                                    </div>
                                    {teacher.location}
                                  </div>
                                  <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                                      <Clock className="h-3 w-3 text-green-600" />
                                    </div>
                                    Responds in {teacher.response_time}
                                  </div>
                                  <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <div className="w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center">
                                      <Award className="h-3 w-3 text-purple-600" />
                                    </div>
                                    {teacher.experience} experience
                                  </div>
                                </div>

                                {/* Languages */}
                                <div className="flex flex-wrap gap-1 mb-5">
                                  {teacher.languages.map((lang, idx) => (
                                    <span key={idx} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs font-medium">
                                      {lang}
                                    </span>
                                  ))}
                                </div>

                                {/* CTA Button */}
                                <Button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5">
                                  <MessageCircle className="h-4 w-4 mr-2" />
                                  Start Learning
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  
                  {/* Hidden default navigation - we use custom ones above */}
                  <CarouselPrevious className="hidden" />
                  <CarouselNext className="hidden" />
                </Carousel>

                {/* Decorative Elements */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-orange-200 to-red-200 rounded-full opacity-20 blur-3xl"></div>
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full opacity-20 blur-3xl"></div>
              </div>
            )}

            <div className="text-center mt-12">
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-orange-500 text-orange-600 hover:bg-orange-50 hover:border-orange-600 px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
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
