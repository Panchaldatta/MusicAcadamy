
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Music, Users, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

const CTASection = () => {
  return (
    <div className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 text-6xl">🎵</div>
        <div className="absolute bottom-20 right-20 text-5xl">🎸</div>
        <div className="absolute top-40 right-10 text-4xl">🥁</div>
        <div className="absolute bottom-10 left-20 text-3xl">🎹</div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Ready to Begin Your
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400">
              Musical Journey?
            </span>
          </h2>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed">
            Join thousands of students learning authentic Indian classical music from certified masters. 
            Start your transformation today.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Button 
              asChild
              size="lg" 
              className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-10 py-6 text-xl rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <Link to="/auth/student?tab=signup">
                Find Your Guru Now
                <ArrowRight className="ml-3 h-6 w-6" />
              </Link>
            </Button>
            
            <Button 
              asChild
              variant="outline" 
              size="lg"
              className="border-2 border-orange-400 text-orange-400 hover:bg-orange-400 hover:text-black px-10 py-6 text-xl rounded-2xl transition-all duration-300"
            >
              <Link to="/browse-classrooms">
                Browse Classes
              </Link>
            </Button>
          </div>

          {/* Feature Highlights */}
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="group">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Music className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-bold mb-2">Learn Authentically</h3>
              <p className="text-gray-400">Traditional methods with modern convenience</p>
            </div>
            
            <div className="group">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-bold mb-2">Expert Guidance</h3>
              <p className="text-gray-400">Learn from certified classical music masters</p>
            </div>
            
            <div className="group">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Award className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-bold mb-2">Structured Learning</h3>
              <p className="text-gray-400">Progressive curriculum from beginner to advanced</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CTASection;
