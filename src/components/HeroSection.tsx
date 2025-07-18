
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play, Star, Music, Award, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSiteStats } from '@/hooks/useSiteStats';

const HeroSection = () => {
  const { data: stats = [] } = useSiteStats();
  
  // Get student count from stats
  const studentStat = stats.find(stat => 
    stat.label.toLowerCase().includes('student') || 
    stat.label.toLowerCase().includes('user')
  );
  const studentCount = studentStat ? studentStat.value : '500+';

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-red-50 overflow-hidden">
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0">
        {/* Geometric shapes */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-orange-200/30 to-red-200/30 rounded-full blur-xl"></div>
        <div className="absolute top-60 right-20 w-40 h-40 bg-gradient-to-br from-amber-200/30 to-orange-200/30 rounded-full blur-xl"></div>
        <div className="absolute bottom-40 left-1/4 w-24 h-24 bg-gradient-to-br from-red-200/30 to-orange-200/30 rounded-full blur-lg"></div>
        
        {/* Musical notes pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-32 left-16 text-4xl rotate-12">🎵</div>
          <div className="absolute top-48 right-32 text-3xl -rotate-12">🎶</div>
          <div className="absolute bottom-60 left-32 text-5xl rotate-6">🎼</div>
          <div className="absolute top-72 left-2/3 text-3xl -rotate-6">🎵</div>
          <div className="absolute bottom-32 right-16 text-4xl rotate-12">🎶</div>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-6 pt-24 pb-16">
        <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[80vh]">
          {/* Left Content */}
          <div className="space-y-10">
            {/* Badge */}
            <div className="inline-flex items-center bg-gradient-to-r from-orange-100 to-red-100 backdrop-blur-sm rounded-full px-6 py-3 border border-orange-200/50 shadow-lg">
              <Star className="h-4 w-4 text-orange-600 mr-2 fill-current" />
              <span className="text-sm font-semibold text-orange-800">
                Trusted by {studentCount} music enthusiasts
              </span>
            </div>
            
            {/* Main Heading */}
            <div className="space-y-6">
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold leading-tight">
                <span className="text-gray-900">Master</span>
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-red-600 to-orange-700">
                  Indian Music
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-700 leading-relaxed max-w-xl font-light">
                Connect with legendary gurus and discover the timeless beauty of Indian classical music through immersive online lessons.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6">
              <Button 
                asChild
                size="lg" 
                className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-10 py-7 text-lg rounded-3xl shadow-2xl hover:shadow-orange-300/25 transition-all duration-300 transform hover:scale-105"
              >
                <Link to="/browse-teachers">
                  Start Learning Today
                  <ArrowRight className="ml-3 h-5 w-5" />
                </Link>
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 border-orange-300 hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 px-10 py-7 text-lg rounded-3xl bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Play className="mr-3 h-5 w-5" />
                Watch Preview
              </Button>
            </div>

            {/* Enhanced Trust Indicators */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-orange-200/50">
              <div className="text-center group">
                <div className="flex items-center justify-center mb-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center mr-2">
                    <Star className="h-4 w-4 text-orange-600 fill-current" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900">4.9</div>
                </div>
                <div className="text-sm text-gray-600 font-medium">Avg Rating</div>
              </div>
              <div className="text-center group">
                <div className="flex items-center justify-center mb-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center mr-2">
                    <Users className="h-4 w-4 text-orange-600" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900">50+</div>
                </div>
                <div className="text-sm text-gray-600 font-medium">Expert Gurus</div>
              </div>
              <div className="text-center group">
                <div className="flex items-center justify-center mb-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center mr-2">
                    <Award className="h-4 w-4 text-orange-600" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900">24/7</div>
                </div>
                <div className="text-sm text-gray-600 font-medium">Support</div>
              </div>
            </div>
          </div>

          {/* Right Content - Enhanced Visual */}
          <div className="relative flex items-center justify-center">
            {/* Main central element */}
            <div className="relative">
              <div className="w-96 h-96 bg-gradient-to-br from-white/80 to-orange-50/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/50 p-12 flex items-center justify-center">
                <div className="text-center space-y-6">
                  <div className="text-9xl animate-pulse">🎼</div>
                  <h3 className="text-3xl font-bold text-gray-900">Begin Your Journey</h3>
                  <p className="text-gray-600 text-lg">Learn from masters</p>
                </div>
              </div>
            </div>
            
            {/* Enhanced Floating Cards */}
            <div className="absolute -top-8 -right-8 bg-gradient-to-br from-white to-orange-50 rounded-3xl shadow-2xl p-6 border border-orange-100 animate-bounce max-w-xs">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-red-100 rounded-2xl flex items-center justify-center">
                  <Music className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-lg">Live Sessions</div>
                  <div className="text-orange-600 font-medium">Starting now</div>
                </div>
              </div>
            </div>
            
            <div className="absolute -bottom-8 -left-8 bg-gradient-to-br from-white to-red-50 rounded-3xl shadow-2xl p-6 border border-red-100 animate-pulse max-w-xs">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-orange-100 rounded-2xl flex items-center justify-center">
                  <Award className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-lg">Certified Gurus</div>
                  <div className="text-red-600 font-medium">Verified experts</div>
                </div>
              </div>
            </div>

            <div className="absolute top-1/2 -left-16 bg-gradient-to-br from-white to-amber-50 rounded-3xl shadow-xl p-4 border border-amber-100 animate-bounce delay-1000">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl flex items-center justify-center">
                  🏆
                </div>
                <div>
                  <div className="font-bold text-gray-900">Top Rated</div>
                  <div className="text-amber-600 text-sm font-medium">Platform</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
