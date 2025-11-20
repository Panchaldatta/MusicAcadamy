
import React from 'react';
import { useMusicSubjects } from '@/hooks/useMusicSubjects';
import { InfiniteSlider as InfiniteSliderUI } from '@/components/ui/infinite-slider';
import { Music, Guitar, Drum, Piano, Mic2, Headphones, Radio, Music2, Volume2, Speaker } from 'lucide-react';

// Map music subjects to icons
const getIconForSubject = (subjectName: string) => {
  const name = subjectName.toLowerCase();
  if (name.includes('guitar') || name.includes('sitar')) return Guitar;
  if (name.includes('drum') || name.includes('tabla')) return Drum;
  if (name.includes('piano') || name.includes('harmonium')) return Piano;
  if (name.includes('vocal') || name.includes('singing')) return Mic2;
  if (name.includes('flute') || name.includes('bansuri')) return Music2;
  if (name.includes('violin')) return Music;
  if (name.includes('radio')) return Radio;
  return Music;
};

const InfiniteSlider = () => {
  const { data: musicSubjects = [], isLoading } = useMusicSubjects();

  // Show loading state
  if (isLoading) {
    return (
      <div className="relative py-12 sm:py-16 bg-gradient-to-br from-gray-900 via-gray-800 to-black overflow-hidden">
        <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]"></div>
        <div className="relative z-10">
        <div className="text-center mb-8 md:mb-12 px-4">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 md:mb-4 font-poppins">
            Explore Musical Journeys
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 font-inter">
            Discover the rich heritage of Indian classical music
          </p>
        </div>
          <div className="flex justify-center items-center py-12 sm:py-16">
            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-orange-400"></div>
          </div>
        </div>
      </div>
    );
  }

  // Show message if no subjects available
  if (!musicSubjects || musicSubjects.length === 0) {
    return (
      <div className="relative py-12 sm:py-16 bg-gradient-to-br from-gray-900 via-gray-800 to-black overflow-hidden">
        <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]"></div>
        <div className="relative z-10">
        <div className="text-center mb-8 md:mb-12 px-4">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 md:mb-4 font-poppins">
            Explore Musical Journeys
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 font-inter">
            Discover the rich heritage of Indian classical music
          </p>
        </div>
          <div className="text-center py-12 sm:py-16 px-4">
            <p className="text-gray-400 text-base sm:text-lg font-inter">No musical subjects available at the moment.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative py-12 sm:py-16 bg-gradient-to-br from-gray-900 via-gray-800 to-black overflow-hidden">
      {/* Black blur overlay */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]"></div>
      
      {/* Content */}
      <div className="relative z-10">
        <div className="text-center mb-8 md:mb-12 px-4">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 md:mb-4 font-poppins">
            Explore Musical Journeys
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 font-inter">
            Discover the rich heritage of Indian classical music
          </p>
        </div>

        {/* Infinite slider container */}
        <InfiniteSliderUI 
          gap={12} 
          reverse 
          duration={30}
          durationOnHover={50}
          className="w-full"
        >
          {musicSubjects.map((subject) => {
            const IconComponent = getIconForSubject(subject.name);
            return (
              <div key={subject.id} className="flex-shrink-0 w-44 sm:w-52 md:w-56">
                <div className="group relative bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden border border-white/20 hover:border-orange-400/50 transition-all duration-300 hover:scale-105 hover:bg-white/15 hover:shadow-lg hover:shadow-orange-500/20">
                  <div className="flex items-center gap-3 p-3 sm:p-4">
                    <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center transition-all duration-300" style={{ backgroundColor: `${subject.color}20` }}>
                      <IconComponent 
                        className="transition-transform duration-300 group-hover:scale-110" 
                        size={20}
                        style={{ color: subject.color }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xs sm:text-sm font-semibold text-white mb-0.5 sm:mb-1 group-hover:text-orange-400 transition-colors truncate font-poppins">
                        {subject.name}
                      </h3>
                      <p className="text-gray-400 text-[10px] sm:text-xs font-inter flex items-center gap-1">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                        {subject.student_count} students
                      </p>
                    </div>
                  </div>
                  {/* Subtle glow effect */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-orange-500/0 via-orange-500/5 to-red-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>
            );
          })}
        </InfiniteSliderUI>
      </div>

      {/* Gradient fade edges */}
      <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-gray-900 to-transparent z-20 pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-black to-transparent z-20 pointer-events-none"></div>
    </div>
  );
};

export default InfiniteSlider;
