
import React from 'react';
import { useMusicSubjects } from '@/hooks/useMusicSubjects';
import { InfiniteSlider as InfiniteSliderUI } from '@/components/ui/infinite-slider';

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
        <InfiniteSliderUI 
          gap={16} 
          reverse 
          duration={30}
          durationOnHover={50}
          className="w-full"
        >
          {musicSubjects.map((subject) => (
            <div key={subject.id} className="flex-shrink-0 w-56">
              <div className="group relative bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden border border-white/20 hover:border-orange-400/50 transition-all duration-300 hover:scale-105 hover:bg-white/15">
                <div className="flex items-center gap-3 p-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${subject.color}20` }}>
                    <div className="text-2xl" style={{ color: subject.color }}>
                      {subject.icon}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-white mb-1 group-hover:text-orange-400 transition-colors truncate">
                      {subject.name}
                    </h3>
                    <p className="text-gray-400 text-xs">
                      {subject.student_count} students
                    </p>
                  </div>
                </div>
                {/* Subtle glow effect */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-orange-500/0 via-orange-500/5 to-red-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>
          ))}
        </InfiniteSliderUI>
      </div>

      {/* Gradient fade edges */}
      <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-gray-900 to-transparent z-20 pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-black to-transparent z-20 pointer-events-none"></div>
    </div>
  );
};

export default InfiniteSlider;
