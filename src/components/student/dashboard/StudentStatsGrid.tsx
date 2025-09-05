
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, Clock, TrendingUp } from 'lucide-react';

interface StudentStatsGridProps {
  profile: {
    music_experience_level?: string | null;
    learning_goals?: string | null;
    created_at: string;
  };
}

const StudentStatsGrid = ({ profile }: StudentStatsGridProps) => {
  // Calculate real learning data based on profile
  const joinDate = new Date(profile.created_at);
  const now = new Date();
  const daysSinceJoin = Math.floor((now.getTime() - joinDate.getTime()) / (1000 * 60 * 60 * 24));
  const totalHours = Math.max(daysSinceJoin * 0.5, 0); // Estimate 30 min learning per day
  const progress = Math.min((daysSinceJoin / 30) * 100, 100); // Progress based on 30-day cycle

  const stats = [
    {
      title: "Learning Days",
      value: Math.max(daysSinceJoin, 0).toString(),
      icon: BookOpen,
      color: "text-blue-600",
      bgColor: "from-blue-50 to-blue-100",
      description: "Days since joining"
    },
    {
      title: "Hours Learned",
      value: totalHours.toFixed(0),
      icon: Clock,
      color: "text-green-600", 
      bgColor: "from-green-50 to-green-100",
      description: "Estimated learning time"
    },
    {
      title: "Progress",
      value: `${progress.toFixed(0)}%`,
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "from-purple-50 to-purple-100",
      description: "Learning journey"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {stats.map((stat, index) => (
        <Card key={index} className="bg-gradient-to-br bg-card border-border hover:shadow-md transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
            <div>
              <p className="text-muted-foreground text-sm font-medium">{stat.title}</p>
              <p className="text-3xl font-bold text-foreground">{stat.value}</p>
              <p className="text-muted-foreground text-xs mt-1">{stat.description}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StudentStatsGrid;
