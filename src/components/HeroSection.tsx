
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play, Sparkles, Users, Music2, Award, Clock } from 'lucide-react';
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
    <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50/30 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-br from-orange-200/20 to-red-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-amber-200/15 to-orange-200/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        {/* Floating music notes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 text-orange-300/30 text-6xl animate-bounce">♪</div>
          <div className="absolute top-40 right-32 text-red-300/30 text-4xl animate-bounce delay-500">♫</div>
          <div className="absolute bottom-32 left-1/3 text-amber-300/30 text-5xl animate-bounce delay-1000">♬</div>
          <div className="absolute top-1/2 right-20 text-orange-300/30 text-3xl animate-bounce delay-700">♩</div>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-screen py-20">
          {/* Left Content */}
          <div className="space-y-8 lg:pr-8">
            {/* Premium badge */}
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 border border-orange-200/50 shadow-lg">
              <Sparkles className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium text-gray-700">
                Premium Music Education Platform
              </span>
            </div>
            
            {/* Main heading with modern typography */}
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tight">
                <span className="block text-slate-900">Learn Music</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-red-500 to-orange-600">
                  Like Never Before
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-lg font-medium">
                Experience the future of music education with world-class instructors, 
                interactive lessons, and personalized learning paths.
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                asChild
                size="lg" 
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-6 text-base rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-0"
              >
                <Link to="/browse-teachers" className="flex items-center gap-2">
                  Start Your Journey
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 border-slate-200 hover:border-orange-200 hover:bg-orange-50 px-8 py-6 text-base rounded-2xl bg-white/50 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Play className="mr-2 h-4 w-4" />
                Watch Demo
              </Button>
            </div>

            {/* Stats row */}
            <div className="flex items-center gap-8 pt-6">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-100 to-red-100 rounded-xl flex items-center justify-center">
                  <Users className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">{studentCount}</div>
                  <div className="text-sm text-slate-500">Active Students</div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl flex items-center justify-center">
                  <Award className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">4.9★</div>
                  <div className="text-sm text-slate-500">Rating</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Interactive Visual */}
          <div className="relative flex items-center justify-center lg:justify-end">
            {/* Main card */}
            <div className="relative">
              <div className="w-80 h-96 bg-gradient-to-br from-white to-orange-50/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center">
                      <Music2 className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-slate-500">Next Session</div>
                      <div className="text-lg font-semibold text-slate-900">2:00 PM</div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-slate-900">Classical Sitar</h3>
                    <p className="text-slate-600">Master the ancient art of sitar with Guru Ramesh Kumar</p>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-500">Progress</span>
                        <span className="text-sm font-medium text-slate-700">68%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full w-2/3"></div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 pt-4">
                      <div className="flex -space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-orange-200 to-red-200 rounded-full border-2 border-white"></div>
                        <div className="w-8 h-8 bg-gradient-to-br from-amber-200 to-orange-200 rounded-full border-2 border-white"></div>
                        <div className="w-8 h-8 bg-gradient-to-br from-red-200 to-orange-200 rounded-full border-2 border-white"></div>
                      </div>
                      <span className="text-sm text-slate-500">+12 others learning</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating notifications */}
            <div className="absolute -top-6 -left-6 bg-white rounded-2xl shadow-xl p-4 border border-orange-100 animate-bounce">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-slate-700">Live session starting</span>
              </div>
            </div>
            
            <div className="absolute -bottom-6 -right-6 bg-gradient-to-br from-orange-100 to-red-100 rounded-2xl shadow-xl p-4 border border-white animate-pulse">
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-orange-600" />
                <div>
                  <div className="text-sm font-medium text-slate-700">24/7 Access</div>
                  <div className="text-xs text-slate-500">Learn anytime</div>
                </div>
              </div>
            </div>
            
            <div className="absolute top-1/2 -left-12 bg-white rounded-xl shadow-lg p-3 border border-amber-100 animate-bounce delay-1000">
              <div className="text-center">
                <div className="text-lg font-bold text-slate-900">50+</div>
                <div className="text-xs text-slate-500">Expert Instructors</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
