
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, Trophy, BookOpen, Calendar } from 'lucide-react';

interface StudentQuickActionsProps {
  onTabChange: (tab: string) => void;
}

const StudentQuickActions = ({ onTabChange }: StudentQuickActionsProps) => {
  const actions = [
    {
      title: 'Update Profile',
      description: 'Complete your information',
      icon: Settings,
      action: () => onTabChange('profile'),
      variant: 'default' as const,
    },
    {
      title: 'View Achievements',
      description: 'Track your progress',
      icon: Trophy,
      action: () => onTabChange('achievements'),
      variant: 'outline' as const,
    },
    {
      title: 'Browse Courses',
      description: 'Find new lessons',
      icon: BookOpen,
      action: () => window.location.href = '/browse-classrooms',
      variant: 'outline' as const,
    },
    {
      title: 'Set Preferences',
      description: 'Customize settings',
      icon: Calendar,
      action: () => onTabChange('preferences'),
      variant: 'outline' as const,
    },
  ];

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {actions.map((action) => (
            <Button
              key={action.title}
              variant={action.variant}
              className="h-auto p-4 flex flex-col items-center gap-2 text-center"
              onClick={action.action}
            >
              <action.icon className="h-5 w-5" />
              <div>
                <div className="text-sm font-medium">{action.title}</div>
                <div className="text-xs text-muted-foreground">{action.description}</div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentQuickActions;
