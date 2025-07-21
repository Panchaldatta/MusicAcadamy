
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Phone, MapPin } from 'lucide-react';

interface StudentProfileSummaryProps {
  profile: {
    first_name?: string | null;
    last_name?: string | null;
    email?: string | null;
    phone?: string | null;
    city?: string | null;
    state?: string | null;
    avatar_url?: string | null;
  };
}

const StudentProfileSummary = ({ profile }: StudentProfileSummaryProps) => {
  const displayName = profile.first_name 
    ? `${profile.first_name} ${profile.last_name || ''}`.trim()
    : 'Student';

  const initials = profile.first_name 
    ? `${profile.first_name[0]}${profile.last_name?.[0] || ''}`.toUpperCase()
    : 'S';

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <User className="h-5 w-5 text-primary" />
          Profile Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center pb-4 border-b border-border">
          <Avatar className="w-20 h-20 mx-auto mb-4 border-2 border-primary/20">
            <AvatarImage src={profile.avatar_url || ''} alt={displayName} />
            <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary text-lg font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <h3 className="font-semibold text-lg text-foreground mb-2">
            {displayName}
          </h3>
          <Badge variant="secondary" className="text-xs">
            Student
          </Badge>
        </div>
        
        <div className="space-y-4">
          {profile.email && (
            <div className="flex items-center gap-3 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="truncate text-foreground">{profile.email}</span>
            </div>
          )}
          {profile.phone && (
            <div className="flex items-center gap-3 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="text-foreground">{profile.phone}</span>
            </div>
          )}
          {(profile.city || profile.state) && (
            <div className="flex items-center gap-3 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="text-foreground">
                {[profile.city, profile.state].filter(Boolean).join(', ')}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentProfileSummary;
