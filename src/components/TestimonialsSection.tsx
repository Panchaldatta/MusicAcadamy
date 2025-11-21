
import React from 'react';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Sitar Student",
    content: "The personalized attention from my guru has been incredible. I've learned more in 6 months than I did in years of self-study.",
    rating: 5,
    location: "Mumbai"
  },
  {
    name: "Arjun Patel",
    role: "Tabla Enthusiast",
    content: "Amazing platform! The flexibility to schedule lessons around my work has made learning tabla possible again.",
    rating: 5,
    location: "Delhi"
  },
  {
    name: "Meera Singh",
    role: "Vocal Student",
    content: "My vocal training has improved tremendously. The digital resources and practice feedback are game-changers.",
    rating: 5,
    location: "Bangalore"
  }
];

const TestimonialsSection = () => {
  return (
    <div className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-orange-50 to-red-50">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
            What Our Students Say
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
            Hear from our community of passionate music learners who have transformed their musical journey with us.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 shadow-lg border border-orange-100 hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <div className="mb-4 sm:mb-6">
                <Quote className="h-6 w-6 sm:h-8 sm:w-8 text-orange-400 mb-3 sm:mb-4" />
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base md:text-lg">
                  "{testimonial.content}"
                </p>
              </div>

              <div className="flex items-center mb-3 sm:mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-400 fill-current" />
                ))}
              </div>

              <div className="border-t border-gray-100 pt-3 sm:pt-4">
                <h4 className="font-bold text-gray-900 text-base sm:text-lg">{testimonial.name}</h4>
                <p className="text-orange-600 font-medium text-sm sm:text-base">{testimonial.role}</p>
                <p className="text-gray-500 text-xs sm:text-sm">{testimonial.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestimonialsSection;
