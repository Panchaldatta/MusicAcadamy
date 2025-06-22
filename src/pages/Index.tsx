
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Music, Search, Star, MapPin, Clock, Award, ArrowRight, Guitar, Mic, Piano, Drum, Music2, BookOpen, Users, Play, CheckCircle, TrendingUp, Globe, Shield } from "lucide-react";
import { useState } from "react";
import Navigation from "@/components/Navigation";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { name: "Music Lessons", icon: Music, color: "bg-green-500" },
    { name: "Piano", icon: Piano, color: "bg-blue-500" },
    { name: "Guitar", icon: Guitar, color: "bg-orange-500" },
    { name: "Vocals", icon: Mic, color: "bg-pink-500" },
    { name: "Drums", icon: Drum, color: "bg-red-500" },
    { name: "Music Production", icon: Play, color: "bg-purple-500" },
    { name: "Music Theory", icon: BookOpen, color: "bg-indigo-500" },
    { name: "Violin", icon: Music2, color: "bg-teal-500" }
  ];

  const featuredServices = [
    {
      id: 1,
      title: "I will teach you piano from beginner to advanced level",
      seller: "Sarah_Music",
      sellerLevel: "Level 2 Seller",
      rating: 4.9,
      reviews: 127,
      price: 25,
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ee6f8?w=300&h=200&fit=crop&crop=center",
      tags: ["Piano", "Classical", "Jazz"],
      featured: true
    },
    {
      id: 2,
      title: "I will produce professional music tracks and beats",
      seller: "BeatMaker_Pro",
      sellerLevel: "Top Rated Seller",
      rating: 5.0,
      reviews: 234,
      price: 50,
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ee6f8?w=300&h=200&fit=crop&crop=center",
      tags: ["Production", "Beats", "Mixing"],
      featured: true
    },
    {
      id: 3,
      title: "I will teach guitar techniques for all skill levels",
      seller: "GuitarGuru_Mike",
      sellerLevel: "Level 2 Seller",
      rating: 4.8,
      reviews: 89,
      price: 30,
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ee6f8?w=300&h=200&fit=crop&crop=center",
      tags: ["Guitar", "Rock", "Blues"],
      featured: false
    },
    {
      id: 4,
      title: "I will provide vocal coaching and singing lessons",
      seller: "VocalCoach_Emma",
      sellerLevel: "Level 1 Seller",
      rating: 4.7,
      reviews: 156,
      price: 35,
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ee6f8?w=300&h=200&fit=crop&crop=center",
      tags: ["Vocals", "Pop", "R&B"],
      featured: false
    }
  ];

  const stats = [
    { label: "Active buyers", value: "4M+" },
    { label: "Music gigs", value: "50K+" },
    { label: "Orders completed", value: "100M+" },
    { label: "Categories", value: "20+" }
  ];

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-white">
        {/* Hero Section - Fiverr Style */}
        <section className="bg-gradient-to-r from-green-500 to-green-600 pt-20 pb-12">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center text-white">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Find the right <span className="text-green-200">music</span> freelance service, right away
              </h1>
              
              {/* Fiverr-style search bar */}
              <div className="bg-white rounded-lg p-2 max-w-2xl mx-auto mb-8 shadow-xl">
                <div className="flex">
                  <div className="flex-1 relative">
                    <Input
                      placeholder="Search for any service..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="border-0 text-gray-700 text-lg h-12 focus:ring-0"
                    />
                  </div>
                  <Button className="bg-green-500 hover:bg-green-600 h-12 px-8 text-white font-semibold">
                    <Search className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Popular searches */}
              <div className="flex flex-wrap justify-center gap-2 text-sm">
                <span className="text-green-200">Popular:</span>
                {["Piano Lessons", "Music Production", "Vocal Coaching", "Guitar Tabs"].map((term, index) => (
                  <button key={index} className="border border-green-300 text-green-100 px-3 py-1 rounded-full hover:bg-green-400 transition-colors">
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Trusted by section */}
        <section className="py-8 bg-gray-50 border-b">
          <div className="container mx-auto px-6">
            <div className="flex items-center justify-center gap-8 text-gray-600">
              <span className="text-sm font-medium">Trusted by:</span>
              <div className="flex items-center gap-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="font-bold text-lg text-gray-800">{stat.value}</div>
                    <div className="text-xs text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Categories - Fiverr style */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Popular music services</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
              {categories.map((category, index) => (
                <Card key={index} className="cursor-pointer hover:shadow-lg transition-all duration-300 border-0 shadow-sm">
                  <CardContent className="p-4 text-center">
                    <div className={`w-12 h-12 ${category.color} rounded-lg flex items-center justify-center mx-auto mb-3`}>
                      <category.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-sm text-gray-900">{category.name}</h3>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Services - Fiverr Gig Style */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Music & Audio services</h2>
              <Button variant="outline" className="border-green-500 text-green-600 hover:bg-green-50">
                See all
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredServices.map((service) => (
                <Card key={service.id} className="hover:shadow-xl transition-all duration-300 cursor-pointer group border-0 shadow-sm">
                  <CardContent className="p-0">
                    {/* Service Image */}
                    <div className="relative">
                      <img
                        src={service.image}
                        alt={service.title}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                      {service.featured && (
                        <Badge className="absolute top-3 left-3 bg-orange-500 text-white">
                          Featured
                        </Badge>
                      )}
                    </div>

                    {/* Service Info */}
                    <div className="p-4">
                      {/* Seller info */}
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <Users className="h-3 w-3 text-white" />
                        </div>
                        <span className="text-sm font-medium text-gray-700">{service.seller}</span>
                        <Badge variant="outline" className="text-xs border-green-500 text-green-600">
                          {service.sellerLevel}
                        </Badge>
                      </div>

                      {/* Service title */}
                      <h3 className="font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-green-600 transition-colors">
                        {service.title}
                      </h3>

                      {/* Rating */}
                      <div className="flex items-center gap-1 mb-3">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="font-semibold text-sm">{service.rating}</span>
                        <span className="text-gray-500 text-sm">({service.reviews})</span>
                      </div>

                      {/* Tags */}
                      <div className="flex gap-1 mb-4">
                        {service.tags.slice(0, 2).map((tag, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      {/* Price */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <span className="text-gray-500 text-sm">Starting at</span>
                        </div>
                        <div className="text-right">
                          <span className="text-xl font-bold text-gray-900">${service.price}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Fiverr Pro Section */}
        <section className="py-16 bg-gray-900 text-white">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <Badge className="bg-orange-500 text-white mb-4">MuseSync Pro</Badge>
              <h2 className="text-4xl font-bold mb-6">
                The premium freelance solution for businesses
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Connect with hand-vetted talent, manage your team, and track progress like never before.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Button size="lg" className="bg-green-500 hover:bg-green-600">
                  Learn More
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900">
                  Contact Sales
                </Button>
              </div>

              {/* Features */}
              <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto">
                <div className="text-center">
                  <Shield className="h-12 w-12 text-green-400 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Dedicated success manager</h3>
                  <p className="text-gray-400">Your own personal point of contact</p>
                </div>
                <div className="text-center">
                  <Users className="h-12 w-12 text-green-400 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Team collaboration tools</h3>
                  <p className="text-gray-400">Share files and feedback easily</p>
                </div>
                <div className="text-center">
                  <TrendingUp className="h-12 w-12 text-green-400 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Business payment solutions</h3>
                  <p className="text-gray-400">Flexible payment terms and options</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-green-600">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Suddenly it's all so doable.
            </h2>
            <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
              Join the millions of people who use MuseSync to turn their ideas into reality.
            </p>
            <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100 px-8 py-3">
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 bg-white border-t">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-5 gap-8">
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
                <div className="space-y-2">
                  <a href="#" className="block text-gray-600 hover:text-green-600 transition-colors">Music & Audio</a>
                  <a href="#" className="block text-gray-600 hover:text-green-600 transition-colors">Programming & Tech</a>
                  <a href="#" className="block text-gray-600 hover:text-green-600 transition-colors">Digital Marketing</a>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">About</h3>
                <div className="space-y-2">
                  <a href="#" className="block text-gray-600 hover:text-green-600 transition-colors">Careers</a>
                  <a href="#" className="block text-gray-600 hover:text-green-600 transition-colors">Press & News</a>
                  <a href="#" className="block text-gray-600 hover:text-green-600 transition-colors">Partnerships</a>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Support</h3>
                <div className="space-y-2">
                  <a href="#" className="block text-gray-600 hover:text-green-600 transition-colors">Help & Support</a>
                  <a href="#" className="block text-gray-600 hover:text-green-600 transition-colors">Trust & Safety</a>
                  <a href="#" className="block text-gray-600 hover:text-green-600 transition-colors">Selling on MuseSync</a>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Community</h3>
                <div className="space-y-2">
                  <a href="#" className="block text-gray-600 hover:text-green-600 transition-colors">Events</a>
                  <a href="#" className="block text-gray-600 hover:text-green-600 transition-colors">Blog</a>
                  <a href="#" className="block text-gray-600 hover:text-green-600 transition-colors">Forum</a>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">More From MuseSync</h3>
                <div className="space-y-2">
                  <a href="#" className="block text-gray-600 hover:text-green-600 transition-colors">MuseSync Pro</a>
                  <a href="#" className="block text-gray-600 hover:text-green-600 transition-colors">MuseSync Studios</a>
                  <a href="#" className="block text-gray-600 hover:text-green-600 transition-colors">MuseSync Logo Maker</a>
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center gap-2 mb-4 md:mb-0">
                <Music className="h-6 w-6 text-green-500" />
                <span className="text-xl font-bold text-gray-900">MuseSync</span>
                <span className="text-gray-600">© 2024</span>
              </div>
              <div className="flex items-center gap-6">
                <Globe className="h-5 w-5 text-gray-600" />
                <span className="text-gray-600">English</span>
                <span className="text-gray-600">$ USD</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Index;
