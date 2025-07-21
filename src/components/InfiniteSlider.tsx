
import React from 'react';
import { useMusicSubjects } from '@/hooks/useMusicSubjects';

const InfiniteSlider = () => {
  const { data: musicSubjects = [], isLoading } = useMusicSubjects();

  // Show loading state
  if (isLoading) {
    return (
      <div className="relative py-16 bg-gradient-to-br from-gray-900 via-gray-800 to-black overflow-hidden">
        <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]"></div>
        <div className="relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Explore Musical Journeys
            </h2>
            <p className="text-xl text-gray-300">
              Discover the rich heritage of Indian classical music
            </p>
          </div>
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-400"></div>
          </div>
        </div>
      </div>
    );
  }

  // Show message if no subjects available
  if (!musicSubjects || musicSubjects.length === 0) {
    return (
      <div className="relative py-16 bg-gradient-to-br from-gray-900 via-gray-800 to-black overflow-hidden">
        <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]"></div>
        <div className="relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Explore Musical Journeys
            </h2>
            <p className="text-xl text-gray-300">
              Discover the rich heritage of Indian classical music
            </p>
          </div>
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg">No musical subjects available at the moment.</p>
          </div>
        </div>
      </div>
    );
  }

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
            {musicSubjects.map((subject) => (
              <div key={`first-${subject.id}`} className="flex-shrink-0 w-80 mx-4">
                <div className="group relative bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/20 hover:border-orange-400/50 transition-all duration-300 hover:scale-105 hover:bg-white/15">
                  <div className="relative h-48 overflow-hidden" style={{ backgroundColor: `${subject.color}20` }}>
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-6xl" style={{ color: subject.color }}>
                        {subject.icon}
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-orange-400 transition-colors">
                      {subject.name}
                    </h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {subject.student_count} students learning this instrument
                    </p>
                  </div>
                  {/* Subtle glow effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-orange-500/0 via-orange-500/5 to-red-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>
            ))}
            
            {/* Duplicate set for seamless loop */}
            {musicSubjects.map((subject) => (
              <div key={`second-${subject.id}`} className="flex-shrink-0 w-80 mx-4">
                <div className="group relative bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/20 hover:border-orange-400/50 transition-all duration-300 hover:scale-105 hover:bg-white/15">
                  <div className="relative h-48 overflow-hidden" style={{ backgroundColor: `${subject.color}20` }}>
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-6xl" style={{ color: subject.color }}>
                        {subject.icon}
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-orange-400 transition-colors">
                      {subject.name}
                    </h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {subject.student_count} students learning this instrument
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
