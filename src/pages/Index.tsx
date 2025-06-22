import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Music, Search, Star, MapPin, Clock, Users, Award, Play, ArrowRight, Check, Trophy, BookOpen, Target, Guitar, Mic, Piano, Drum, Music2, MessageCircle, Heart, Shield } from "lucide-react";
import { useState } from "react";
import Navigation from "@/components/Navigation";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");

  const musicSubjects = [
    { name: "Piano", icon: Piano, color: "bg-blue-500", students: "1,234" },
    { name: "Guitar", icon: Guitar, color: "bg-green-500", students: "2,156" },
    { name: "Violin", icon: Music2, color: "bg-purple-500", students: "856" },
    { name: "Drums", icon: Drum, color: "bg-red-500", students: "1,023" },
    { name: "Vocals", icon: Mic, color: "bg-pink-500", students: "1,567" },
    { name: "Music Theory", icon: BookOpen, color: "bg-indigo-500", students: "945" }
  ];

  const featuredTeachers = [
    {
      id: 1,
      name: "Sarah Johnson",
      subject: "Piano & Music Theory",
      rating: 4.9,
      reviews: 127,
      price: 25,
      experience: "8 years",
      location: "New York, NY",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face",
      specialties: ["Classical", "Jazz", "Pop"],
      verified: true,
      responseTime: "< 1 hour",
      languages: ["English", "French"]
    },
    {
      id: 2,
      name: "Michael Chen",
      subject: "Guitar & Music Production",
      rating: 4.8,
      reviews: 94,
      price: 30,
      experience: "12 years",
      location: "Los Angeles, CA",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      specialties: ["Rock", "Blues", "Electronic"],
      verified: true,
      responseTime: "< 2 hours",
      languages: ["English", "Mandarin"]
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      subject: "Vocals & Performance",
      rating: 5.0,
      reviews: 156,
      price: 35,
      experience: "10 years",
      location: "Miami, FL",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      specialties: ["Pop", "R&B", "Musical Theatre"],
      verified: true,
      responseTime: "< 30 min",
      languages: ["English", "Spanish"]
    },
    {
      id: 4,
      name: "David Kim",
      subject: "Violin & Chamber Music",
      rating: 4.9,
      reviews: 78,
      price: 40,
      experience: "15 years",
      location: "Boston, MA",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      specialties: ["Classical", "Contemporary", "Film Score"],
      verified: true,
      responseTime: "< 1 hour",
      languages: ["English", "Korean"]
    }
  ];

  const stats = [
    { label: "Music Teachers", value: "12,000+" },
    { label: "Happy Students", value: "50,000+" },
    { label: "Lessons Completed", value: "200,000+" },
    { label: "Countries", value: "15+" }
  ];

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-white">
        {/* Hero Section with Search */}
        <section className="bg-gradient-to-br from-blue-50 to-indigo-100 pt-20 pb-16">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                Find your perfect
                <span className="text-blue-600 block">music teacher</span>
              </h1>
              <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
                Learn from expert musicians and music teachers. Over 12,000 qualified teachers available for online and in-person lessons.
              </p>

              {/* Search Bar */}
              <div className="bg-white rounded-xl shadow-lg p-2 max-w-3xl mx-auto mb-8">
                <div className="flex flex-col md:flex-row gap-2">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                      placeholder="What do you want to learn? (e.g., Piano, Guitar, Vocals)"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-12 h-14 text-lg border-0 focus:ring-0"
                    />
                  </div>
                  <div className="flex-1 relative">
                    <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                      placeholder="Where? (Online or City)"
                      className="pl-12 h-14 text-lg border-0 focus:ring-0"
                    />
                  </div>
                  <Button size="lg" className="h-14 px-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold">
                    Search
                  </Button>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl md:text-3xl font-bold text-blue-600">{stat.value}</div>
                    <div className="text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Popular Subjects */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Popular Music Subjects</h2>
              <p className="text-gray-600 text-lg">Choose from a wide range of musical instruments and subjects</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {musicSubjects.map((subject, index) => (
                <Card 
                  key={index} 
                  className="cursor-pointer hover:shadow-lg transition-all duration-300 border-2 hover:border-blue-200"
                  onClick={() => setSelectedSubject(subject.name)}
                >
                  <CardContent className="p-6 text-center">
                    <div className={`w-12 h-12 ${subject.color} rounded-full flex items-center justify-center mx-auto mb-3`}>
                      <subject.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">{subject.name}</h3>
                    <p className="text-sm text-gray-500">{subject.students} students</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Teachers */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Music Teachers</h2>
              <p className="text-gray-600 text-lg">Meet some of our top-rated music instructors</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredTeachers.map((teacher) => (
                <Card key={teacher.id} className="hover:shadow-xl transition-all duration-300 cursor-pointer group">
                  <CardContent className="p-0">
                    {/* Teacher Image */}
                    <div className="relative">
                      <img
                        src={teacher.image}
                        alt={teacher.name}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                      {teacher.verified && (
                        <Badge className="absolute top-3 right-3 bg-green-500 text-white">
                          <Shield className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                      <div className="absolute bottom-3 left-3 right-3 flex gap-2">
                        {teacher.specialties.slice(0, 2).map((specialty, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs bg-white/90 text-gray-700">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Teacher Info */}
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
                          {teacher.name}
                        </h3>
                        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-red-500 p-1">
                          <Heart className="h-4 w-4" />
                        </Button>
                      </div>

                      <p className="text-blue-600 font-medium mb-3">{teacher.subject}</p>

                      {/* Rating */}
                      <div className="flex items-center gap-1 mb-3">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`h-4 w-4 ${i < Math.floor(teacher.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                          ))}
                        </div>
                        <span className="font-semibold text-sm">{teacher.rating}</span>
                        <span className="text-gray-500 text-sm">({teacher.reviews} reviews)</span>
                      </div>

                      {/* Details */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="h-4 w-4" />
                          {teacher.location}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="h-4 w-4" />
                          Responds in {teacher.responseTime}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Award className="h-4 w-4" />
                          {teacher.experience} of experience
                        </div>
                      </div>

                      {/* Languages */}
                      <div className="flex gap-1 mb-4">
                        {teacher.languages.map((lang, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {lang}
                          </Badge>
                        ))}
                      </div>

                      {/* Price and CTA */}
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-2xl font-bold text-gray-900">${teacher.price}</span>
                          <span className="text-gray-500">/hour</span>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="text-blue-600 border-blue-600 hover:bg-blue-50">
                            <MessageCircle className="h-4 w-4 mr-1" />
                            Message
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-10">
              <Button size="lg" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                View All Teachers
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
                Getting started with music lessons has never been easier
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">1. Find Your Teacher</h3>
                <p className="text-gray-600">
                  Browse through our verified music teachers and find the perfect match for your learning goals.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">2. Book Your Lesson</h3>
                <p className="text-gray-600">
                  Contact your teacher and schedule your first lesson. Choose between online or in-person options.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Music className="h-8 w-8 text-purple-600" />
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
        <section className="py-16 bg-blue-600">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Start Your Musical Journey?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of students learning music with expert teachers on MuseSync
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3">
                Find a Teacher
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-3">
                Become a Teacher
              </Button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 bg-gray-900">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Music className="h-8 w-8 text-blue-400" />
                  <span className="text-2xl font-bold text-white">MuseSync</span>
                </div>
                <p className="text-gray-400">
                  Connecting music students with expert teachers worldwide.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-white mb-4">For Students</h3>
                <div className="space-y-2">
                  <a href="#" className="block text-gray-400 hover:text-white transition-colors">Find Teachers</a>
                  <a href="#" className="block text-gray-400 hover:text-white transition-colors">How it Works</a>
                  <a href="#" className="block text-gray-400 hover:text-white transition-colors">Pricing</a>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-white mb-4">For Teachers</h3>
                <div className="space-y-2">
                  <a href="#" className="block text-gray-400 hover:text-white transition-colors">Become a Teacher</a>
                  <a href="#" className="block text-gray-400 hover:text-white transition-colors">Teacher Dashboard</a>
                  <a href="#" className="block text-gray-400 hover:text-white transition-colors">Resources</a>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-white mb-4">Support</h3>
                <div className="space-y-2">
                  <a href="#" className="block text-gray-400 hover:text-white transition-colors">Help Center</a>
                  <a href="#" className="block text-gray-400 hover:text-white transition-colors">Contact Us</a>
                  <a href="#" className="block text-gray-400 hover:text-white transition-colors">Terms of Service</a>
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
              <p>&copy; 2024 MuseSync. All rights reserved. Empowering musicians worldwide.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Index;
