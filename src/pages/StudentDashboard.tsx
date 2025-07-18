
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User, Trophy, Settings, Calendar, Music, Phone, Mail, MapPin, GraduationCap, Target, Clock } from 'lucide-react';
import StudentProfileForm from '@/components/student/StudentProfileForm';
import StudentAchievements from '@/components/student/StudentAchievements';
import StudentPreferences from '@/components/student/StudentPreferences';
import LoadingState from '@/components/common/LoadingState';

const StudentDashboard = () => {
  const { profile, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  if (loading) {
    return <LoadingState />;
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        <Navigation />
        <div className="pt-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-card border border-border rounded-lg p-8 shadow-sm">
              <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-foreground mb-4">Access Denied</h1>
              <p className="text-muted-foreground">Please sign in to access your student dashboard.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Navigation />
      <div className="pt-20 px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl border border-primary/20">
                      <User className="h-8 w-8 text-primary" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 border-2 border-background rounded-full"></div>
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-foreground mb-1">
                      Welcome back, {profile.first_name || 'Student'}!
                    </h1>
                    <p className="text-muted-foreground">
                      Continue your musical journey and explore new opportunities
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="px-3 py-1">
                    <GraduationCap className="h-4 w-4 mr-1" />
                    {profile.music_experience_level || 'Beginner'}
                  </Badge>
                  <Badge variant="outline" className="px-3 py-1">
                    Active Student
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 h-12 p-1 bg-card border border-border">
              <TabsTrigger value="overview" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <User className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="profile" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Settings className="h-4 w-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="achievements" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Trophy className="h-4 w-4" />
                Achievements
              </TabsTrigger>
              <TabsTrigger value="preferences" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Settings className="h-4 w-4" />
                Preferences
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6 mt-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
                        <Music className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Experience Level</p>
                        <p className="text-lg font-semibold capitalize">
                          {profile.music_experience_level || 'Beginner'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-12 h-12 bg-amber-100 rounded-lg">
                        <Trophy className="h-6 w-6 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Achievements</p>
                        <p className="text-lg font-semibold">0</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg">
                        <Target className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Learning Goals</p>
                        <p className="text-lg font-semibold">
                          {profile.learning_goals ? 'Set' : 'Not Set'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg">
                        <Clock className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Member Since</p>
                        <p className="text-lg font-semibold">
                          {new Date(profile.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Profile Summary & Quick Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Summary */}
                <Card className="lg:col-span-1">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Profile Summary
                    </CardTitle>
                    <CardDescription>Your key information at a glance</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center pb-4 border-b border-border">
                      <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 border border-primary/20">
                        <User className="h-10 w-10 text-primary" />
                      </div>
                      <h3 className="font-semibold text-lg">
                        {profile.first_name || 'First'} {profile.last_name || 'Last'}
                      </h3>
                      <Badge variant="secondary" className="mt-1">
                        Student
                      </Badge>
                    </div>
                    
                    <div className="space-y-3">
                      {profile.email && (
                        <div className="flex items-center gap-3 text-sm">
                          <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          <span className="truncate">{profile.email}</span>
                        </div>
                      )}
                      {profile.phone && (
                        <div className="flex items-center gap-3 text-sm">
                          <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          <span>{profile.phone}</span>
                        </div>
                      )}
                      {(profile.city || profile.state) && (
                        <div className="flex items-center gap-3 text-sm">
                          <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          <span>
                            {[profile.city, profile.state].filter(Boolean).join(', ')}
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions & Progress */}
                <div className="lg:col-span-2 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Quick Actions</CardTitle>
                      <CardDescription>Get started with your musical journey</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Button 
                          variant="default" 
                          className="h-auto py-4"
                          onClick={() => setActiveTab('profile')}
                        >
                          <div className="text-center">
                            <Settings className="h-5 w-5 mx-auto mb-1" />
                            <div className="text-sm font-medium">Update Profile</div>
                          </div>
                        </Button>
                        <Button 
                          variant="outline" 
                          className="h-auto py-4"
                          onClick={() => setActiveTab('achievements')}
                        >
                          <div className="text-center">
                            <Trophy className="h-5 w-5 mx-auto mb-1" />
                            <div className="text-sm font-medium">View Achievements</div>
                          </div>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Learning Progress</CardTitle>
                      <CardDescription>Track your musical development</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Profile Completion</span>
                          <span className="text-sm text-muted-foreground">
                            {profile.first_name && profile.last_name && profile.bio ? '75%' : '25%'}
                          </span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full transition-all duration-300" 
                            style={{ 
                              width: profile.first_name && profile.last_name && profile.bio ? '75%' : '25%' 
                            }}
                          ></div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Complete your profile to unlock more features
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="profile">
              <StudentProfileForm />
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
