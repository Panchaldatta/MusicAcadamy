
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play, Star, Users, Award, Music2, Sparkles } from 'lucide-react';
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
    <div className="relative min-h-screen bg-gradient-to-br from-slate-50 to-orange-50 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Floating orbs */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-orange-200/30 to-red-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-amber-200/20 to-orange-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-gradient-to-r from-red-200/25 to-pink-200/25 rounded-full blur-2xl animate-pulse delay-500"></div>
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 min-h-screen flex items-center">
        <div className="grid lg:grid-cols-2 gap-16 items-center w-full">
          {/* Left Content */}
          <div className="space-y-8 animate-fade-in-left">
            {/* Badge */}
            <div className="inline-flex items-center bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 border border-orange-200/50 shadow-sm">
              <Sparkles className="h-4 w-4 text-orange-600 mr-2" />
              <span className="text-sm font-medium text-orange-800">
                Join {studentCount} music enthusiasts
              </span>
            </div>
            
            {/* Main Heading */}
            <div className="space-y-6">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight">
                <span className="block text-gray-900">Learn</span>
                <span className="block bg-gradient-to-r from-orange-600 via-red-600 to-orange-700 bg-clip-text text-transparent">
                  Indian Classical
                </span>
                <span className="block text-gray-900">Music</span>
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                Connect with master gurus and immerse yourself in the rich tradition of Indian classical music through personalized online lessons.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                asChild
                size="lg" 
                className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-8 py-6 text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <Link to="/browse-teachers">
                  Start Learning Today
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 border-gray-200 hover:bg-gray-50 px-8 py-6 text-lg font-semibold rounded-2xl bg-white/70 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300 group"
              >
                <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                Watch Demo
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="flex items-center gap-8 pt-8">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-red-400 rounded-full border-2 border-white"></div>
                  <div className="w-8 h-8 bg-gradient-to-r from-red-400 to-pink-400 rounded-full border-2 border-white"></div>
                  <div className="w-8 h-8 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full border-2 border-white"></div>
                </div>
                <span className="text-sm text-gray-600 ml-2">50+ Expert Gurus</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500 fill-current" />
                <span className="text-sm font-medium text-gray-700">4.9/5 Rating</span>
              </div>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative animate-fade-in-right">
            {/* Main Card */}
            <div className="relative bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/50">
              {/* Floating Music Notes */}
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg animate-bounce">
                <Music2 className="h-6 w-6 text-white" />
              </div>
              
              <div className="absolute -bottom-4 -left-4 w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg animate-bounce delay-500">
                <span className="text-white text-lg">♪</span>
              </div>

              {/* Card Content */}
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-10 w-10 text-orange-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Live Sessions</h3>
                  <p className="text-gray-600">Interactive learning with master gurus</p>
                </div>
                
                {/* Features List */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"></div>
                    <span className="text-gray-700">One-on-one personalized lessons</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-full"></div>
                    <span className="text-gray-700">Flexible scheduling</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"></div>
                    <span className="text-gray-700">Progress tracking</span>
                  </div>
                </div>

                {/* Achievement Badge */}
                <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-4 border border-orange-200/50">
                  <div className="flex items-center gap-3">
                    <Award className="h-8 w-8 text-orange-600" />
                    <div>
                      <div className="font-semibold text-gray-900">Certified Excellence</div>
                      <div className="text-sm text-gray-600">Verified master teachers</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute top-16 -left-8 w-16 h-16 bg-white/70 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg animate-pulse">
              <span className="text-2xl">🎵</span>
            </div>
            
            <div className="absolute bottom-16 -right-8 w-14 h-14 bg-white/70 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg animate-pulse delay-700">
              <span className="text-xl">🎼</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Curve */}
      <div className="absolute bottom-0 left-0 w-full">
        <svg viewBox="0 0 1200 120" className="w-full h-16 md:h-20 lg:h-24">
          <path 
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" 
            className="fill-white"
          />
        </svg>
      </div>
    </div>
  );
};

export default HeroSection;
