
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, GraduationCap } from 'lucide-react';

interface StudentHeaderProps {
  profile: {
    first_name?: string | null;
    last_name?: string | null;
    avatar_url?: string | null;
    music_experience_level?: string | null;
  };
}

const StudentHeader = ({ profile }: StudentHeaderProps) => {
  const displayName = profile.first_name 
    ? `${profile.first_name} ${profile.last_name || ''}`.trim()
    : 'Student';

  const initials = profile.first_name 
    ? `${profile.first_name[0]}${profile.last_name?.[0] || ''}`.toUpperCase()
    : 'S';

  return (
    <div className="bg-card border border-border rounded-xl p-8 shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="relative">
            <Avatar className="w-20 h-20 border-2 border-primary/20">
              <AvatarImage src={profile.avatar_url || ''} alt={displayName} />
              <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary text-lg font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-2 border-background rounded-full"></div>
          </div>
          
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Welcome back, {displayName}!
            </h1>
            <p className="text-muted-foreground text-lg">
              Continue your musical journey and explore new opportunities
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="px-4 py-2 text-sm">
            <GraduationCap className="h-4 w-4 mr-2" />
            {profile.music_experience_level || 'Beginner'}
          </Badge>
          <Badge variant="outline" className="px-4 py-2 text-sm">
            Active Student
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default StudentHeader;
