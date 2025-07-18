
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
      {/* Refined Background Pattern */}
      <div className="absolute inset-0">
        {/* Subtle geometric shapes */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-orange-100/20 to-red-100/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-br from-amber-100/20 to-orange-100/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-gradient-to-br from-red-100/15 to-orange-100/15 rounded-full blur-2xl"></div>
        
        {/* Refined musical notes pattern */}
        <div className="absolute inset-0 opacity-3">
          <div className="absolute top-32 left-16 text-3xl rotate-12 text-orange-300">♪</div>
          <div className="absolute top-48 right-32 text-2xl -rotate-12 text-red-300">♫</div>
          <div className="absolute bottom-60 left-32 text-4xl rotate-6 text-amber-300">♬</div>
          <div className="absolute top-72 left-2/3 text-2xl -rotate-6 text-orange-300">♪</div>
          <div className="absolute bottom-32 right-16 text-3xl rotate-12 text-red-300">♫</div>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-6 pt-32 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-12">
            {/* Refined Badge */}
            <div className="inline-flex items-center bg-white/70 backdrop-blur-md rounded-full px-8 py-4 border border-orange-200/50 shadow-lg">
              <Star className="h-5 w-5 text-orange-600 mr-3 fill-current" />
              <span className="text-base font-medium text-orange-800">
                Trusted by {studentCount} music enthusiasts worldwide
              </span>
            </div>
            
            {/* Main Heading - Eurydice Style */}
            <div className="space-y-8">
              <h1 className="text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-light leading-[0.9] tracking-tight">
                <span className="block text-gray-900 mb-4">Master the Art of</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-red-600 to-orange-700 font-medium">
                  Indian Classical Music
                </span>
              </h1>
              
              <div className="max-w-3xl mx-auto space-y-6">
                <p className="text-xl md:text-2xl text-gray-600 leading-relaxed font-light">
                  Connect with legendary gurus and discover the timeless beauty of Indian classical music through immersive online lessons.
                </p>
                <p className="text-lg text-gray-500 font-light">
                  Experience authentic teaching methods with modern convenience
                </p>
              </div>
            </div>

            {/* CTA Buttons - Refined */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
              <Button 
                asChild
                size="lg" 
                className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-12 py-8 text-lg font-medium rounded-full shadow-2xl hover:shadow-orange-300/25 transition-all duration-300 transform hover:scale-105 border-0"
              >
                <Link to="/browse-teachers">
                  Start Your Journey
                  <ArrowRight className="ml-3 h-5 w-5" />
                </Link>
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 border-gray-300 hover:bg-white/80 px-12 py-8 text-lg font-medium rounded-full bg-white/50 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 text-gray-700 hover:text-gray-900"
              >
                <Play className="mr-3 h-5 w-5" />
                Watch Preview
              </Button>
            </div>

            {/* Refined Trust Indicators */}
            <div className="pt-16 border-t border-orange-200/30">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-4xl mx-auto">
                <div className="text-center group">
                  <div className="flex items-center justify-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-red-100 rounded-2xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                      <Star className="h-6 w-6 text-orange-600 fill-current" />
                    </div>
                    <div className="text-4xl font-light text-gray-900">4.9</div>
                  </div>
                  <div className="text-sm text-gray-600 font-medium uppercase tracking-wide">Average Rating</div>
                </div>
                
                <div className="text-center group">
                  <div className="flex items-center justify-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-red-100 rounded-2xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                      <Users className="h-6 w-6 text-orange-600" />
                    </div>
                    <div className="text-4xl font-light text-gray-900">50+</div>
                  </div>
                  <div className="text-sm text-gray-600 font-medium uppercase tracking-wide">Expert Gurus</div>
                </div>
                
                <div className="text-center group">
                  <div className="flex items-center justify-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-red-100 rounded-2xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                      <Award className="h-6 w-6 text-orange-600" />
                    </div>
                    <div className="text-4xl font-light text-gray-900">24/7</div>
                  </div>
                  <div className="text-sm text-gray-600 font-medium uppercase tracking-wide">Support</div>
                </div>
              </div>
            </div>

            {/* Elegant Feature Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 pt-20 max-w-6xl mx-auto">
              <div className="bg-white/60 backdrop-blur-lg rounded-3xl p-8 border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-red-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Music className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-3">Live Sessions</h3>
                <p className="text-gray-600 leading-relaxed">Interactive live classes with certified masters from the comfort of your home.</p>
              </div>
              
              <div className="bg-white/60 backdrop-blur-lg rounded-3xl p-8 border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-orange-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Award className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-3">Certified Gurus</h3>
                <p className="text-gray-600 leading-relaxed">Learn from verified experts with decades of classical music experience.</p>
              </div>
              
              <div className="bg-white/60 backdrop-blur-lg rounded-3xl p-8 border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 group md:col-span-2 lg:col-span-1">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">🏆</span>
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-3">Structured Learning</h3>
                <p className="text-gray-600 leading-relaxed">Progressive curriculum designed to take you from beginner to advanced levels.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
