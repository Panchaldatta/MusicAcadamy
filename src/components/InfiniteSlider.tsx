
import React from 'react';

interface SlideItem {
  id: number;
  image: string;
  title: string;
  subtitle: string;
}

const slides: SlideItem[] = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop",
    title: "Classical Vocals",
    subtitle: "Master the art of Indian classical singing"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop",
    title: "Tabla Mastery",
    subtitle: "Learn rhythm and percussion excellence"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop",
    title: "Sitar Lessons",
    subtitle: "Experience the soul of Indian strings"
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop",
    title: "Harmonium Classes",
    subtitle: "Perfect your accompaniment skills"
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop",
    title: "Flute Training",
    subtitle: "Breathe life into melodious tunes"
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop",
    title: "Violin Expertise",
    subtitle: "Master the strings of classical music"
  }
];

const InfiniteSlider = () => {
  return (
    <div className="relative py-16 bg-gradient-to-br from-gray-900 via-gray-800 to-black overflow-hidden">
      {/* Black blur overlay */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]"></div>
      
      {/* Content */}
      <div className="relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Explore Musical Journeys
          </h2>
          <p className="text-xl text-gray-300">
            Discover the rich heritage of Indian classical music
          </p>
        </div>

        {/* Infinite slider container */}
        <div className="relative overflow-hidden">
          {/* Main sliding track */}
          <div className="flex animate-[slide_30s_linear_infinite] hover:[animation-play-state:paused]">
            {/* First set of slides */}
            {slides.map((slide) => (
              <div key={`first-${slide.id}`} className="flex-shrink-0 w-80 mx-4">
                <div className="group relative bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/20 hover:border-orange-400/50 transition-all duration-300 hover:scale-105 hover:bg-white/15">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-orange-400 transition-colors">
                      {slide.title}
                    </h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {slide.subtitle}
                    </p>
                  </div>
                  {/* Subtle glow effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-orange-500/0 via-orange-500/5 to-red-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>
            ))}
            
            {/* Duplicate set for seamless loop */}
            {slides.map((slide) => (
              <div key={`second-${slide.id}`} className="flex-shrink-0 w-80 mx-4">
                <div className="group relative bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/20 hover:border-orange-400/50 transition-all duration-300 hover:scale-105 hover:bg-white/15">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-orange-400 transition-colors">
                      {slide.title}
                    </h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {slide.subtitle}
                    </p>
                  </div>
                  {/* Subtle glow effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-orange-500/0 via-orange-500/5 to-red-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Gradient fade edges */}
      <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-gray-900 to-transparent z-20 pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-black to-transparent z-20 pointer-events-none"></div>
    </div>
  );
};

export default InfiniteSlider;
