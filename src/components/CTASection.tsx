
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Music, Users, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

const CTASection = () => {
  return (
    <div className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 text-3xl sm:text-4xl md:text-6xl">🎵</div>
        <div className="absolute bottom-20 right-20 text-2xl sm:text-3xl md:text-5xl">🎸</div>
        <div className="absolute top-40 right-10 text-xl sm:text-2xl md:text-4xl">🥁</div>
        <div className="absolute bottom-10 left-20 text-lg sm:text-xl md:text-3xl">🎹</div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
            Ready to Begin Your
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400">
              Musical Journey?
            </span>
          </h2>
          
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 mb-8 sm:mb-10 md:mb-12 leading-relaxed px-4">
            Join thousands of students learning authentic Indian classical music from certified masters. 
            Start your transformation today.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center mb-10 sm:mb-12 md:mb-16">
            <Button 
              asChild
              size="lg" 
              className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-6 sm:px-8 md:px-10 py-4 sm:py-5 md:py-6 text-base sm:text-lg md:text-xl rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <Link to="/auth/student?tab=signup">
                Find Your Guru Now
                <ArrowRight className="ml-2 sm:ml-3 h-5 w-5 sm:h-6 sm:w-6" />
              </Link>
            </Button>
            
            <Button 
              asChild
              variant="outline" 
              size="lg"
              className="border-2 border-orange-400 text-orange-400 hover:bg-orange-400 hover:text-black px-6 sm:px-8 md:px-10 py-4 sm:py-5 md:py-6 text-base sm:text-lg md:text-xl rounded-xl sm:rounded-2xl transition-all duration-300"
            >
              <Link to="/browse-classrooms">
                Browse Classes
              </Link>
            </Button>
          </div>

          {/* Feature Highlights */}
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 text-center">
            <div className="group">
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                <Music className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-white" />
              </div>
              <h3 className="text-base sm:text-lg font-bold mb-1 sm:mb-2">Learn Authentically</h3>
              <p className="text-gray-400 text-sm sm:text-base">Traditional methods with modern convenience</p>
            </div>
            
            <div className="group">
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                <Users className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-white" />
              </div>
              <h3 className="text-base sm:text-lg font-bold mb-1 sm:mb-2">Expert Guidance</h3>
              <p className="text-gray-400 text-sm sm:text-base">Learn from certified classical music masters</p>
            </div>
            
            <div className="group sm:col-span-2 md:col-span-1">
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                <Award className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-white" />
              </div>
              <h3 className="text-base sm:text-lg font-bold mb-1 sm:mb-2">Structured Learning</h3>
              <p className="text-gray-400 text-sm sm:text-base">Progressive curriculum from beginner to advanced</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CTASection;
