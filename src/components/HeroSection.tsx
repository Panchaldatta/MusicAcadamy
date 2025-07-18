
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play, Star, Music, Award, Users, Sparkles, Zap } from 'lucide-react';
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
    <div className="relative min-h-screen bg-gradient-to-br from-background via-muted/30 to-background overflow-hidden">
      {/* Modern Background Pattern */}
      <div className="absolute inset-0">
        {/* Gradient orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-br from-secondary/15 to-primary/15 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-accent/20 to-primary/10 rounded-full blur-2xl opacity-40"></div>
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20"></div>
        
        {/* Floating elements */}
        <div className="absolute top-32 right-32 text-2xl opacity-20 animate-bounce">🎵</div>
        <div className="absolute bottom-40 left-20 text-3xl opacity-15 animate-pulse">🎼</div>
        <div className="absolute top-1/3 left-1/4 text-xl opacity-25 animate-bounce delay-300">🎶</div>
      </div>

      <div className="relative z-10 container mx-auto px-6 pt-32 pb-20">
        <div className="grid lg:grid-cols-2 gap-20 items-center min-h-[80vh]">
          {/* Left Content */}
          <div className="space-y-8 animate-fade-in-up">
            {/* Premium Badge */}
            <div className="inline-flex items-center bg-gradient-to-r from-primary/10 to-secondary/10 backdrop-blur-sm rounded-full px-6 py-3 border border-primary/20 shadow-lg">
              <Sparkles className="h-4 w-4 text-primary mr-2" />
              <span className="text-sm font-semibold text-primary">
                Trusted by {studentCount} music enthusiasts
              </span>
            </div>
            
            {/* Main Heading */}
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight">
                <span className="text-foreground">Master the Art of</span>
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_auto] animate-gradient">
                  Indian Music
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl">
                Connect with legendary gurus and discover the timeless beauty of Indian classical music through immersive online lessons tailored just for you.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                asChild
                size="lg" 
                className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground px-8 py-6 text-lg rounded-2xl shadow-xl hover:shadow-primary/25 transition-all duration-300 transform hover:scale-105 group"
              >
                <Link to="/browse-teachers">
                  Start Learning Today
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 border-primary/30 hover:bg-primary/5 px-8 py-6 text-lg rounded-2xl bg-background/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                Watch Preview
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-border/50">
              <div className="text-center group">
                <div className="flex items-center justify-center mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center mr-2 group-hover:scale-110 transition-transform">
                    <Star className="h-4 w-4 text-primary fill-current" />
                  </div>
                  <div className="text-2xl font-bold text-foreground">4.9</div>
                </div>
                <div className="text-xs text-muted-foreground font-medium">Avg Rating</div>
              </div>
              <div className="text-center group">
                <div className="flex items-center justify-center mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center mr-2 group-hover:scale-110 transition-transform">
                    <Users className="h-4 w-4 text-primary" />
                  </div>
                  <div className="text-2xl font-bold text-foreground">50+</div>
                </div>
                <div className="text-xs text-muted-foreground font-medium">Expert Gurus</div>
              </div>
              <div className="text-center group">
                <div className="flex items-center justify-center mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center mr-2 group-hover:scale-110 transition-transform">
                    <Zap className="h-4 w-4 text-primary" />
                  </div>
                  <div className="text-2xl font-bold text-foreground">24/7</div>
                </div>
                <div className="text-xs text-muted-foreground font-medium">Support</div>
              </div>
            </div>
          </div>

          {/* Right Content - Modern Visual */}
          <div className="relative flex items-center justify-center animate-fade-in-right">
            {/* Main central card */}
            <div className="relative group">
              <div className="w-80 h-80 bg-gradient-to-br from-card via-card/90 to-card/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-border/50 p-8 flex items-center justify-center group-hover:scale-105 transition-all duration-500">
                <div className="text-center space-y-4">
                  <div className="text-6xl mb-4 animate-pulse">🎼</div>
                  <h3 className="text-2xl font-bold text-foreground">Begin Your Journey</h3>
                  <p className="text-muted-foreground">Learn from masters</p>
                  <div className="flex items-center justify-center gap-2 pt-2">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-secondary rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
              
              {/* Floating accent cards */}
              <div className="absolute -top-4 -right-4 bg-gradient-to-br from-card to-card/90 rounded-2xl shadow-xl p-4 border border-border/50 animate-float max-w-48">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl flex items-center justify-center">
                    <Music className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground text-sm">Live Sessions</div>
                    <div className="text-primary text-xs font-medium">Starting now</div>
                  </div>
                </div>
              </div>
              
              <div className="absolute -bottom-4 -left-4 bg-gradient-to-br from-card to-card/90 rounded-2xl shadow-xl p-4 border border-border/50 animate-float delay-1000 max-w-48">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-secondary/20 to-primary/20 rounded-xl flex items-center justify-center">
                    <Award className="h-5 w-5 text-secondary" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground text-sm">Certified Gurus</div>
                    <div className="text-secondary text-xs font-medium">Verified experts</div>
                  </div>
                </div>
              </div>

              <div className="absolute top-1/2 -left-12 bg-gradient-to-br from-card to-card/90 rounded-2xl shadow-lg p-3 border border-border/50 animate-float delay-500">
                <div className="flex items-center gap-2">
                  <div className="text-lg">🏆</div>
                  <div>
                    <div className="font-semibold text-foreground text-xs">Top Rated</div>
                    <div className="text-primary text-xs">Platform</div>
                  </div>
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
