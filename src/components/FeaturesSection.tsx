
import React from 'react';
import { Video, Users, Award, Clock, BookOpen, Headphones } from 'lucide-react';

const features = [
  {
    icon: Video,
    title: "Live Video Sessions",
    description: "Face-to-face learning with high-quality video calls and screen sharing capabilities."
  },
  {
    icon: Users,
    title: "Expert Gurus",
    description: "Learn from certified masters with decades of experience in Indian classical music."
  },
  {
    icon: Award,
    title: "Structured Curriculum",
    description: "Progressive learning path from beginner to advanced levels with proper assessments."
  },
  {
    icon: Clock,
    title: "Flexible Scheduling",
    description: "Book sessions that fit your schedule with easy rescheduling options."
  },
  {
    icon: BookOpen,
    title: "Digital Resources",
    description: "Access to sheet music, practice tracks, and learning materials anytime."
  },
  {
    icon: Headphones,
    title: "Practice Support",
    description: "Get feedback on your practice sessions and personalized improvement tips."
  }
];

const FeaturesSection = () => {
  return (
    <div className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Why Choose Our Platform?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience the perfect blend of traditional Indian classical music education with modern technology.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group p-8 rounded-2xl border border-gray-100 hover:border-orange-200 hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-orange-100 to-red-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="h-7 w-7 text-orange-600" />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-orange-600 transition-colors">
                {feature.title}
              </h3>
              
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;
