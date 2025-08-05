import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Navigation from '@/components/Navigation';
import { RoadmapCard } from '@/components/roadmap/RoadmapCard';
import { RoadmapDetail } from '@/components/roadmap/RoadmapDetail';
import { useGovExamRoadmaps, useUserRoadmapProgress, useStartRoadmap, useUpdateMilestone, GovExamRoadmap } from '@/hooks/useGovExamRoadmaps';
import LoadingState from '@/components/common/LoadingState';
import ErrorState from '@/components/common/ErrorState';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Target, TrendingUp, Users } from 'lucide-react';
import { toast } from 'sonner';

const GovExamRoadmapPage = () => {
  const { user, profile } = useAuth();
  const [selectedRoadmap, setSelectedRoadmap] = useState<GovExamRoadmap | null>(null);
  
  const { data: roadmaps, isLoading: roadmapsLoading, error: roadmapsError } = useGovExamRoadmaps();
  const { data: userProgress, isLoading: progressLoading } = useUserRoadmapProgress(user?.id);
  const startRoadmapMutation = useStartRoadmap();
  const updateMilestoneMutation = useUpdateMilestone();

  if (roadmapsLoading || progressLoading) {
    return <LoadingState />;
  }

  if (roadmapsError) {
    return <ErrorState message="Failed to load roadmaps" />;
  }

  if (!user || !profile) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto">
            <CardHeader className="text-center">
              <CardTitle>Access Denied</CardTitle>
              <CardDescription>
                Please sign in to access government exam roadmaps
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button onClick={() => window.location.href = '/auth'}>
                Sign In
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const handleStartRoadmap = async (roadmapId: string) => {
    if (!user?.id) return;
    
    try {
      await startRoadmapMutation.mutateAsync({ roadmapId, userId: user.id });
      toast.success('Roadmap started successfully!');
    } catch (error) {
      toast.error('Failed to start roadmap');
      console.error('Error starting roadmap:', error);
    }
  };

  const handleMilestoneToggle = async (milestoneId: number, completed: boolean) => {
    if (!selectedRoadmap || !userProgress) return;
    
    const progress = userProgress.find(p => p.roadmap_id === selectedRoadmap.id);
    if (!progress) return;

    try {
      await updateMilestoneMutation.mutateAsync({
        progressId: progress.id,
        milestoneId,
        completed,
      });
      toast.success(completed ? 'Milestone completed!' : 'Milestone unchecked');
    } catch (error) {
      toast.error('Failed to update milestone');
      console.error('Error updating milestone:', error);
    }
  };

  const getUserProgressForRoadmap = (roadmapId: string) => {
    return userProgress?.find(p => p.roadmap_id === roadmapId);
  };

  const getOverviewStats = () => {
    const totalRoadmaps = roadmaps?.length || 0;
    const startedRoadmaps = userProgress?.length || 0;
    const totalMilestones = roadmaps?.reduce((sum, roadmap) => sum + (roadmap.milestones?.length || 0), 0) || 0;
    const completedMilestones = userProgress?.reduce((sum, progress) => {
      const completedCount = Array.isArray(progress.completed_milestones) 
        ? progress.completed_milestones.length 
        : 0;
      return sum + completedCount;
    }, 0) || 0;

    return { totalRoadmaps, startedRoadmaps, totalMilestones, completedMilestones };
  };

  const stats = getOverviewStats();

  if (selectedRoadmap) {
    const progress = getUserProgressForRoadmap(selectedRoadmap.id);
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <RoadmapDetail
            roadmap={selectedRoadmap}
            progress={progress}
            onBack={() => setSelectedRoadmap(null)}
            onStart={handleStartRoadmap}
            onMilestoneToggle={handleMilestoneToggle}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">Government Exam Roadmaps</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Structured preparation plans for major government examinations. 
              Track your progress and follow expert-curated study paths.
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <BookOpen className="h-8 w-8 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold">{stats.totalRoadmaps}</div>
                <div className="text-sm text-muted-foreground">Available Roadmaps</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <TrendingUp className="h-8 w-8 mx-auto mb-2 text-emerald-500" />
                <div className="text-2xl font-bold">{stats.startedRoadmaps}</div>
                <div className="text-sm text-muted-foreground">Started</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Target className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                <div className="text-2xl font-bold">{stats.completedMilestones}</div>
                <div className="text-sm text-muted-foreground">Milestones Completed</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Users className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                <div className="text-2xl font-bold">
                  {stats.totalMilestones > 0 
                    ? Math.round((stats.completedMilestones / stats.totalMilestones) * 100) 
                    : 0}%
                </div>
                <div className="text-sm text-muted-foreground">Overall Progress</div>
              </CardContent>
            </Card>
          </div>

          {/* Filter Categories */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">All Categories</Badge>
            <Badge variant="outline">Civil Services</Badge>
            <Badge variant="outline">Banking</Badge>
            <Badge variant="outline">Staff Selection Commission</Badge>
          </div>

          {/* Roadmaps Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {roadmaps?.map((roadmap) => (
              <RoadmapCard
                key={roadmap.id}
                roadmap={roadmap}
                progress={getUserProgressForRoadmap(roadmap.id)}
                onStart={handleStartRoadmap}
                onView={setSelectedRoadmap}
              />
            ))}
          </div>

          {roadmaps?.length === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">No Roadmaps Available</h3>
                <p className="text-muted-foreground">
                  Check back later for new government exam preparation roadmaps.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default GovExamRoadmapPage;