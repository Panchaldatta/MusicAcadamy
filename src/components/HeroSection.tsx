
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play, Star, Users, Award, TrendingUp, Music2, Headphones, Globe } from 'lucide-react';
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
    <div className="relative min-h-screen bg-gradient-to-br from-background via-background to-muted/20 overflow-hidden">
      {/* Modern geometric background */}
      <div className="absolute inset-0">
        {/* Animated gradient mesh */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 animate-pulse"></div>
        
        {/* Geometric shapes */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-xl"></div>
        <div className="absolute bottom-40 right-20 w-48 h-48 bg-gradient-to-tl from-secondary/10 to-transparent rounded-full blur-2xl"></div>
        <div className="absolute top-1/3 right-1/3 w-24 h-24 bg-gradient-to-r from-accent/10 to-transparent rounded-full blur-lg animate-float"></div>
        
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px] opacity-40"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 pt-24 pb-16">
        <div className="max-w-7xl mx-auto">
          {/* Header Badge */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/10 to-secondary/10 backdrop-blur-sm rounded-full px-6 py-3 border border-primary/20 shadow-lg mb-8">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-primary">
                Join {studentCount} learners worldwide
              </span>
              <TrendingUp className="h-4 w-4 text-primary" />
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-12 gap-12 items-center min-h-[70vh]">
            {/* Left Content - 7 columns */}
            <div className="lg:col-span-7 space-y-8">
              {/* Main Heading */}
              <div className="space-y-6">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight">
                  <span className="block text-foreground mb-2">Learn Music</span>
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_auto] animate-gradient">
                    Like Never Before
                  </span>
                </h1>
                
                <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-2xl">
                  Connect with world-class musicians and discover your musical potential through personalized, interactive lessons.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  asChild
                  size="lg" 
                  className="group bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white px-8 py-6 text-lg rounded-2xl shadow-2xl hover:shadow-primary/30 transition-all duration-300 transform hover:scale-105"
                >
                  <Link to="/browse-teachers">
                    Start Your Journey
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg"
                  className="group border-2 hover:bg-primary/5 px-8 py-6 text-lg rounded-2xl bg-background/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                  Watch Demo
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 pt-8">
                <div className="text-center group cursor-pointer">
                  <div className="flex items-center justify-center mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Star className="h-5 w-5 text-primary fill-current" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-foreground mb-1">4.9</div>
                  <div className="text-sm text-muted-foreground font-medium">Rating</div>
                </div>
                
                <div className="text-center group cursor-pointer">
                  <div className="flex items-center justify-center mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-secondary/20 to-accent/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Users className="h-5 w-5 text-secondary" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-foreground mb-1">100+</div>
                  <div className="text-sm text-muted-foreground font-medium">Instructors</div>
                </div>
                
                <div className="text-center group cursor-pointer">
                  <div className="flex items-center justify-center mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-accent/20 to-primary/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Award className="h-5 w-5 text-accent" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-foreground mb-1">24/7</div>
                  <div className="text-sm text-muted-foreground font-medium">Support</div>
                </div>
              </div>
            </div>

            {/* Right Content - 5 columns */}
            <div className="lg:col-span-5 relative">
              {/* Main Visual Card */}
              <div className="relative max-w-md mx-auto">
                {/* Central Hero Card */}
                <div className="relative bg-gradient-to-br from-card to-card/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-border/50 p-8 group hover:scale-105 transition-all duration-500">
                  <div className="text-center space-y-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-transform duration-500">
                      <Music2 className="h-10 w-10 text-primary" />
                    </div>
                    
                    <div>
                      <h3 className="text-2xl font-bold text-foreground mb-2">
                        Start Learning Today
                      </h3>
                      <p className="text-muted-foreground">
                        Choose your instrument and begin your musical journey
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-center gap-3">
                      <div className="flex -space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full border-2 border-background"></div>
                        <div className="w-8 h-8 bg-gradient-to-br from-secondary to-accent rounded-full border-2 border-background"></div>
                        <div className="w-8 h-8 bg-gradient-to-br from-accent to-primary rounded-full border-2 border-background"></div>
                      </div>
                      <span className="text-sm text-muted-foreground ml-2">+1000 students</span>
                    </div>
                  </div>
                </div>

                {/* Floating Accent Cards */}
                <div className="absolute -top-6 -left-6 bg-gradient-to-br from-card to-card/95 rounded-2xl shadow-lg p-4 border border-border/50 animate-float max-w-44">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl flex items-center justify-center">
                      <Headphones className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold text-foreground text-sm">Live Classes</div>
                      <div className="text-primary text-xs">Available Now</div>
                    </div>
                  </div>
                </div>
                
                <div className="absolute -bottom-6 -right-6 bg-gradient-to-br from-card to-card/95 rounded-2xl shadow-lg p-4 border border-border/50 animate-float delay-1000 max-w-44">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-secondary/20 to-accent/20 rounded-xl flex items-center justify-center">
                      <Globe className="h-5 w-5 text-secondary" />
                    </div>
                    <div>
                      <div className="font-semibold text-foreground text-sm">Global Access</div>
                      <div className="text-secondary text-xs">Learn Anywhere</div>
                    </div>
                  </div>
                </div>

                <div className="absolute top-1/3 -right-12 bg-gradient-to-br from-card to-card/95 rounded-xl shadow-md p-3 border border-border/50 animate-float delay-500">
                  <div className="text-center">
                    <div className="text-2xl mb-1">🎵</div>
                    <div className="text-xs text-muted-foreground">Perfect Pitch</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Feature Strip */}
          <div className="mt-20 pt-12 border-t border-border/50">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="space-y-2">
                <div className="text-2xl">🎸</div>
                <div className="text-sm font-medium text-foreground">Guitar</div>
                <div className="text-xs text-muted-foreground">Classical & Modern</div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl">🎹</div>
                <div className="text-sm font-medium text-foreground">Piano</div>
                <div className="text-xs text-muted-foreground">All Skill Levels</div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl">🥁</div>
                <div className="text-sm font-medium text-foreground">Drums</div>
                <div className="text-xs text-muted-foreground">Rhythm & Beats</div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl">🎤</div>
                <div className="text-sm font-medium text-foreground">Vocals</div>
                <div className="text-xs text-muted-foreground">Voice Training</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
