
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
    <div className="py-20 bg-gradient-to-br from-orange-50 to-red-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            What Our Students Say
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Hear from our community of passionate music learners who have transformed their musical journey with us.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-white rounded-2xl p-8 shadow-lg border border-orange-100 hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <div className="mb-6">
                <Quote className="h-8 w-8 text-orange-400 mb-4" />
                <p className="text-gray-700 leading-relaxed text-lg">
                  "{testimonial.content}"
                </p>
              </div>

              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                ))}
              </div>

              <div className="border-t border-gray-100 pt-4">
                <h4 className="font-bold text-gray-900 text-lg">{testimonial.name}</h4>
                <p className="text-orange-600 font-medium">{testimonial.role}</p>
                <p className="text-gray-500 text-sm">{testimonial.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestimonialsSection;
