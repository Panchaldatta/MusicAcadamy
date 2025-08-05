import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Clock, BookOpen, Target, Award } from 'lucide-react';
import { GovExamRoadmap, UserRoadmapProgress } from '@/hooks/useGovExamRoadmaps';

interface RoadmapCardProps {
  roadmap: GovExamRoadmap;
  progress?: UserRoadmapProgress;
  onStart: (roadmapId: string) => void;
  onView: (roadmap: GovExamRoadmap) => void;
}

export const RoadmapCard = ({ roadmap, progress, onStart, onView }: RoadmapCardProps) => {
  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-emerald-500';
      case 'intermediate':
        return 'bg-yellow-500';
      case 'advanced':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getProgressPercentage = () => {
    if (!progress || !roadmap.milestones) return 0;
    const completedCount = Array.isArray(progress.completed_milestones) 
      ? progress.completed_milestones.length 
      : 0;
    return (completedCount / roadmap.milestones.length) * 100;
  };

  return (
    <Card className="h-full hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start mb-2">
          <div>
            <CardTitle className="text-xl mb-1">{roadmap.exam_name}</CardTitle>
            <CardDescription>{roadmap.category}</CardDescription>
          </div>
          <Badge className={getDifficultyColor(roadmap.difficulty_level)}>
            {roadmap.difficulty_level}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{roadmap.description}</p>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{roadmap.duration_months} months</span>
          </div>
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-muted-foreground" />
            <span>{roadmap.milestones?.length || 0} milestones</span>
          </div>
        </div>

        {progress && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{Math.round(getProgressPercentage())}%</span>
            </div>
            <Progress value={getProgressPercentage()} className="h-2" />
          </div>
        )}

        <div className="flex gap-2">
          {progress ? (
            <Button onClick={() => onView(roadmap)} className="flex-1">
              <BookOpen className="h-4 w-4 mr-2" />
              Continue
            </Button>
          ) : (
            <Button onClick={() => onStart(roadmap.id)} className="flex-1">
              <Award className="h-4 w-4 mr-2" />
              Start Roadmap
            </Button>
          )}
          <Button variant="outline" onClick={() => onView(roadmap)}>
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};