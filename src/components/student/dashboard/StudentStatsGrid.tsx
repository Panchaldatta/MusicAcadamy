
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Music, Trophy, Target, Clock } from 'lucide-react';

interface StudentStatsGridProps {
  profile: {
    music_experience_level?: string | null;
    learning_goals?: string | null;
    created_at: string;
  };
  achievementsCount: number;
}

const StudentStatsGrid = ({ profile, achievementsCount }: StudentStatsGridProps) => {
  const stats = [
    {
      title: 'Experience Level',
      value: profile.music_experience_level || 'Beginner',
      icon: Music,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      title: 'Achievements',
      value: achievementsCount.toString(),
      icon: Trophy,
      color: 'bg-amber-100 text-amber-600',
    },
    {
      title: 'Learning Goals',
      value: profile.learning_goals ? 'Set' : 'Not Set',
      icon: Target,
      color: 'bg-green-100 text-green-600',
    },
    {
      title: 'Member Since',
      value: new Date(profile.created_at).toLocaleDateString('en-US', { 
        month: 'short', 
        year: 'numeric' 
      }),
      icon: Clock,
      color: 'bg-purple-100 text-purple-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <Card key={stat.title} className="hover:shadow-md transition-shadow border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className={`flex items-center justify-center w-12 h-12 rounded-xl ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                <p className="text-xl font-semibold text-foreground capitalize">
                  {stat.value}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StudentStatsGrid;
