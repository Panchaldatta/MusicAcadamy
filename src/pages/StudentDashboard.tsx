
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User, Trophy, Settings, Calendar, Music, Phone, Mail, MapPin } from 'lucide-react';
import StudentProfileForm from '@/components/student/StudentProfileForm';
import StudentAchievements from '@/components/student/StudentAchievements';
import StudentPreferences from '@/components/student/StudentPreferences';
import LoadingState from '@/components/common/LoadingState';

const StudentDashboard = () => {
  const { profile, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  if (loading) {
    return <LoadingState />;
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Access Denied</h1>
            <p className="text-muted-foreground">Please sign in to access your student dashboard.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-20 px-6 pb-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  Welcome back, {profile.first_name || 'Student'}!
                </h1>
                <p className="text-muted-foreground">
                  Manage your profile, track achievements, and customize your learning experience
                </p>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Music className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Experience Level</p>
                      <p className="font-semibold capitalize">
                        {profile.music_experience_level || 'Beginner'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Trophy className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Achievements</p>
                      <p className="font-semibold">0</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Member Since</p>
                      <p className="font-semibold">
                        {new Date(profile.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="achievements" className="flex items-center gap-2">
                <Trophy className="h-4 w-4" />
                Achievements
              </TabsTrigger>
              <TabsTrigger value="preferences" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Preferences
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Overview */}
                <Card className="lg:col-span-1">
                  <CardHeader>
                    <CardTitle>Profile Overview</CardTitle>
                    <CardDescription>Your basic information at a glance</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                        <User className="h-10 w-10 text-primary" />
                      </div>
                      <h3 className="font-semibold text-lg">
                        {profile.first_name} {profile.last_name}
                      </h3>
                      <Badge variant="secondary" className="mt-1">
                        {profile.role === 'student' ? 'Student' : profile.role}
                      </Badge>
                    </div>
                    
                    <div className="space-y-3 text-sm">
                      {profile.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span>{profile.email}</span>
                        </div>
                      )}
                      {profile.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>{profile.phone}</span>
                        </div>
                      )}
                      {(profile.city || profile.state) && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {[profile.city, profile.state].filter(Boolean).join(', ')}
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Profile Form */}
                <div className="lg:col-span-2">
                  <StudentProfileForm />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="achievements">
              <StudentAchievements />
            </TabsContent>

            <TabsContent value="preferences">
              <StudentPreferences />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
