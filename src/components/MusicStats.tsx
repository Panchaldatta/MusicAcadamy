
import React from 'react';
import { Users, BookOpen, Award, Globe } from 'lucide-react';
import { useSiteStats } from '@/hooks/useSiteStats';

const iconMap = {
  'users': Users,
  'courses': BookOpen,
  'awards': Award,
  'countries': Globe,
  'students': Users,
  'teachers': Users,
  'lessons': BookOpen,
  'instruments': Award
};

const MusicStats = () => {
  const { data: stats = [], isLoading } = useSiteStats();

  if (isLoading) {
    return (
      <div className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="text-center animate-pulse">
                <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <div className="h-8 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!stats.length) {
    return null;
  }

  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => {
            const IconComponent = iconMap[stat.label.toLowerCase() as keyof typeof iconMap] || Users;
            
            return (
              <div key={stat.id} className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <IconComponent className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</h3>
                <p className="text-gray-600 capitalize">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MusicStats;
