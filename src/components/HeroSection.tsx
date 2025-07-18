
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play, Star, Users, CheckCircle, Music } from 'lucide-react';
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
    <div className="relative min-h-screen bg-gradient-to-b from-white to-orange-50/30 overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgb(0,0,0)_1px,transparent_0)] bg-[size:24px_24px]"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-6 min-h-screen flex items-center">
        <div className="w-full max-w-4xl mx-auto text-center space-y-12">
          
          {/* Trust badge */}
          <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200/60 rounded-full px-6 py-3 text-sm font-medium text-orange-800 animate-fade-in-down">
            <Star className="h-4 w-4 text-orange-600 fill-current" />
            Trusted by {studentCount} music students
          </div>

          {/* Main headline */}
          <div className="space-y-6 animate-fade-in-up">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight">
              <span className="block text-gray-900 leading-[0.9]">Master</span>
              <span className="block bg-gradient-to-r from-orange-600 via-red-600 to-orange-700 bg-clip-text text-transparent leading-[0.9]">
                Indian Classical
              </span>
              <span className="block text-gray-900 leading-[0.9]">Music</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto leading-relaxed font-light">
              Connect with renowned gurus and embark on your musical journey through authentic, personalized online lessons
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up">
            <Button 
              asChild
              size="lg" 
              className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-10 py-6 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group border-0"
            >
              <Link to="/browse-teachers">
                Find Your Guru
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            
            <Button 
              variant="ghost" 
              size="lg"
              className="px-10 py-6 text-lg font-semibold rounded-full hover:bg-gray-50 transition-all duration-300 group"
            >
              <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
              Watch Demo
            </Button>
          </div>

          {/* Features grid */}
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto pt-16 animate-fade-in-up">
            <div className="group">
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-red-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Users className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Expert Gurus</h3>
                <p className="text-gray-600 text-sm">Learn from verified masters with years of experience</p>
              </div>
            </div>

            <div className="group">
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-red-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Music className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Personalized</h3>
                <p className="text-gray-600 text-sm">Tailored lessons matching your skill level and goals</p>
              </div>
            </div>

            <div className="group">
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-red-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <CheckCircle className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Flexible</h3>
                <p className="text-gray-600 text-sm">Schedule lessons that fit your lifestyle and pace</p>
              </div>
            </div>
          </div>

          {/* Social proof */}
          <div className="flex items-center justify-center gap-8 pt-8 text-sm text-gray-500 animate-fade-in-up">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-1">
                <div className="w-6 h-6 bg-gradient-to-r from-orange-400 to-red-400 rounded-full border-2 border-white"></div>
                <div className="w-6 h-6 bg-gradient-to-r from-red-400 to-pink-400 rounded-full border-2 border-white"></div>
                <div className="w-6 h-6 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full border-2 border-white"></div>
                <div className="w-6 h-6 bg-gray-300 rounded-full border-2 border-white flex items-center justify-center text-xs text-gray-600">+</div>
              </div>
              <span>50+ Expert Teachers</span>
            </div>
            
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
              <span className="font-medium text-gray-700">4.9</span>
              <span>(2,000+ reviews)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-orange-200/20 to-red-200/20 rounded-full blur-2xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-r from-amber-200/20 to-orange-200/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
      
      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 w-full">
        <svg viewBox="0 0 1200 120" className="w-full h-16 md:h-20">
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
