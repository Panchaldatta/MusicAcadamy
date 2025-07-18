
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Navigation from '@/components/Navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Trophy, Settings, Calendar } from 'lucide-react';
import StudentProfileForm from '@/components/student/StudentProfileForm';
import StudentAchievements from '@/components/student/StudentAchievements';
import StudentPreferences from '@/components/student/StudentPreferences';
import StudentHeader from '@/components/student/dashboard/StudentHeader';
import StudentStatsGrid from '@/components/student/dashboard/StudentStatsGrid';
import StudentProfileSummary from '@/components/student/dashboard/StudentProfileSummary';
import StudentQuickActions from '@/components/student/dashboard/StudentQuickActions';
import StudentProgressCard from '@/components/student/dashboard/StudentProgressCard';
import LoadingState from '@/components/common/LoadingState';
import { useStudentAchievements } from '@/hooks/useStudentAchievements';

const StudentDashboard = () => {
  const { profile, loading } = useAuth();
  const { achievementsCount } = useStudentAchievements();
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
            <div className="bg-card border border-border rounded-xl p-12 shadow-sm">
              <User className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
              <h1 className="text-3xl font-bold text-foreground mb-4">Access Denied</h1>
              <p className="text-muted-foreground text-lg">Please sign in to access your student dashboard.</p>
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
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header Section */}
          <StudentHeader profile={profile} />

          {/* Main Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 h-12 p-1 bg-card border border-border shadow-sm">
              <TabsTrigger 
                value="overview" 
                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
              >
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Overview</span>
              </TabsTrigger>
              <TabsTrigger 
                value="profile" 
                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
              >
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Profile</span>
              </TabsTrigger>
              <TabsTrigger 
                value="achievements" 
                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
              >
                <Trophy className="h-4 w-4" />
                <span className="hidden sm:inline">Achievements</span>
              </TabsTrigger>
              <TabsTrigger 
                value="preferences" 
                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
              >
                <Calendar className="h-4 w-4" />
                <span className="hidden sm:inline">Preferences</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-8 mt-8">
              {/* Stats Grid */}
              <StudentStatsGrid profile={profile} achievementsCount={achievementsCount} />

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Profile Summary */}
                <div className="lg:col-span-1">
                  <StudentProfileSummary profile={profile} />
                </div>

                {/* Right Column - Quick Actions & Progress */}
                <div className="lg:col-span-2 space-y-8">
                  <StudentQuickActions onTabChange={setActiveTab} />
                  <StudentProgressCard profile={profile} />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="profile" className="mt-8">
              <StudentProfileForm />
            </TabsContent>

            <TabsContent value="achievements" className="mt-8">
              <StudentAchievements />
            </TabsContent>

            <TabsContent value="preferences" className="mt-8">
              <StudentPreferences />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
