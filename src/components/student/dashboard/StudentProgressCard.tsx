
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TrendingUp } from 'lucide-react';

interface StudentProgressCardProps {
  profile: {
    first_name?: string | null;
    last_name?: string | null;
    bio?: string | null;
    learning_goals?: string | null;
    phone?: string | null;
    city?: string | null;
    state?: string | null;
  };
}

const StudentProgressCard = ({ profile }: StudentProgressCardProps) => {
  // Calculate profile completion percentage
  const fields = [
    profile.first_name,
    profile.last_name,
    profile.bio,
    profile.learning_goals,
    profile.phone,
    profile.city,
    profile.state,
  ];
  
  const completedFields = fields.filter(Boolean).length;
  const totalFields = fields.length;
  const completionPercentage = Math.round((completedFields / totalFields) * 100);

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <TrendingUp className="h-5 w-5 text-primary" />
          Learning Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">Profile Completion</span>
            <span className="text-sm text-muted-foreground">
              {completionPercentage}%
            </span>
          </div>
          <Progress value={completionPercentage} className="h-2" />
          <p className="text-xs text-muted-foreground">
            Complete your profile to unlock more features and get personalized recommendations
          </p>
        </div>

        <div className="pt-4 border-t border-border">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">Next Steps</span>
            </div>
            <ul className="space-y-2 text-xs text-muted-foreground">
              {!profile.bio && <li>• Add a personal bio</li>}
              {!profile.learning_goals && <li>• Set your learning goals</li>}
              {!profile.phone && <li>• Add contact information</li>}
              {(!profile.city || !profile.state) && <li>• Complete your location</li>}
              {completionPercentage === 100 && <li>• Explore available courses</li>}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentProgressCard;
