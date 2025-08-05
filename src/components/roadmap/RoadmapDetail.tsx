import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Clock, Target, BookOpen, Link as LinkIcon } from 'lucide-react';
import { GovExamRoadmap, UserRoadmapProgress } from '@/hooks/useGovExamRoadmaps';

interface RoadmapDetailProps {
  roadmap: GovExamRoadmap;
  progress?: UserRoadmapProgress;
  onBack: () => void;
  onStart: (roadmapId: string) => void;
  onMilestoneToggle: (milestoneId: number, completed: boolean) => void;
}

export const RoadmapDetail = ({ 
  roadmap, 
  progress, 
  onBack, 
  onStart, 
  onMilestoneToggle 
}: RoadmapDetailProps) => {
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

  const isMilestoneCompleted = (milestoneId: number) => {
    if (!progress?.completed_milestones) return false;
    return Array.isArray(progress.completed_milestones) 
      ? progress.completed_milestones.includes(milestoneId)
      : false;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Roadmaps
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl mb-2">{roadmap.exam_name}</CardTitle>
              <CardDescription className="text-lg">{roadmap.category}</CardDescription>
            </div>
            <Badge className={getDifficultyColor(roadmap.difficulty_level)}>
              {roadmap.difficulty_level}
            </Badge>
          </div>
          <p className="text-muted-foreground mt-4">{roadmap.description}</p>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="font-medium">{roadmap.duration_months} months</div>
                <div className="text-sm text-muted-foreground">Duration</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="font-medium">{roadmap.milestones?.length || 0}</div>
                <div className="text-sm text-muted-foreground">Milestones</div>
              </div>
            </div>
          </div>

          {progress && (
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Your Progress</span>
                <span className="text-sm text-muted-foreground">
                  {Math.round(getProgressPercentage())}% completed
                </span>
              </div>
              <Progress value={getProgressPercentage()} className="h-3" />
            </div>
          )}

          {!progress && (
            <Button onClick={() => onStart(roadmap.id)} size="lg" className="w-full">
              Start This Roadmap
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Milestones Section */}
      <Card>
        <CardHeader>
          <CardTitle>Study Milestones</CardTitle>
          <CardDescription>
            Track your progress through each phase of preparation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {roadmap.milestones?.map((milestone, index) => (
            <div key={milestone.id} className="space-y-3">
              <div className="flex items-start gap-3">
                {progress && (
                  <Checkbox
                    checked={isMilestoneCompleted(milestone.id)}
                    onCheckedChange={(checked) => 
                      onMilestoneToggle(milestone.id, checked as boolean)
                    }
                    className="mt-1"
                  />
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">{milestone.title}</h4>
                    <Badge variant="secondary">
                      {milestone.duration_weeks} weeks
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {milestone.description}
                  </p>
                </div>
              </div>
              {index < roadmap.milestones.length - 1 && <Separator />}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Syllabus Section */}
      {roadmap.syllabus && (
        <Card>
          <CardHeader>
            <CardTitle>Syllabus Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {Object.entries(roadmap.syllabus).map(([section, topics]) => (
                <div key={section}>
                  <h4 className="font-medium mb-2 capitalize">{section}</h4>
                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(topics) ? (
                      topics.map((topic: string, index: number) => (
                        <Badge key={index} variant="outline">
                          {topic}
                        </Badge>
                      ))
                    ) : (
                      <Badge variant="outline">{String(topics)}</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Resources Section */}
      {roadmap.resources && (
        <Card>
          <CardHeader>
            <CardTitle>Recommended Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {Object.entries(roadmap.resources).map(([category, items]) => (
                <div key={category}>
                  <h4 className="font-medium mb-2 capitalize flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    {category.replace('_', ' ')}
                  </h4>
                  <div className="grid gap-2">
                    {Array.isArray(items) ? (
                      items.map((item: string, index: number) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <LinkIcon className="h-3 w-3 text-muted-foreground" />
                          {item}
                        </div>
                      ))
                    ) : (
                      <div className="flex items-center gap-2 text-sm">
                        <LinkIcon className="h-3 w-3 text-muted-foreground" />
                        {String(items)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};