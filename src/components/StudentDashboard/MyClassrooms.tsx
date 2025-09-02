import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Calendar, Clock, User, Video, Download, Users, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";

interface ClassroomEnrollment {
  id: string;
  enrolled_at: string;
  status: 'active' | 'completed' | 'paused';
  classrooms: {
    id: string;
    name: string;
    subject: string;
    duration_weeks: number;
    session_duration_minutes: number;
    sessions_per_week: number;
    level: string;
    image_url?: string;
    description?: string;
    teachers: {
      name: string;
    };
  };
}

const MyClassrooms: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();

  // Fetch student's classroom enrollments
  const { data: enrollments = [], isLoading } = useQuery({
    queryKey: ['student-enrollments', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('classroom_enrollments')
        .select(`
          id,
          enrolled_at,
          status,
          classrooms (
            id,
            name,
            subject,
            duration_weeks,
            session_duration_minutes,
            sessions_per_week,
            level,
            image_url,
            description,
            teachers (
              name
            )
          )
        `)
        .eq('student_id', user.id)
        .order('enrolled_at', { ascending: false });

      return data || [];
    },
    enabled: !!user?.id,
  });

  const calculateProgress = (enrolledAt: string, durationWeeks: number) => {
    const startDate = new Date(enrolledAt);
    const currentDate = new Date();
    const totalDurationMs = durationWeeks * 7 * 24 * 60 * 60 * 1000;
    const elapsedMs = currentDate.getTime() - startDate.getTime();
    const progress = Math.min((elapsedMs / totalDurationMs) * 100, 100);
    return Math.max(progress, 0);
  };

  const getWeeksRemaining = (enrolledAt: string, durationWeeks: number) => {
    const startDate = new Date(enrolledAt);
    const currentDate = new Date();
    const elapsedWeeks = Math.floor((currentDate.getTime() - startDate.getTime()) / (7 * 24 * 60 * 60 * 1000));
    return Math.max(durationWeeks - elapsedWeeks, 0);
  };

  const handleJoinClass = (enrollment: ClassroomEnrollment) => {
    toast({
      title: "Joining Class",
      description: `Opening ${enrollment.classrooms.name} virtual classroom...`,
    });
    // In a real app, this would open the virtual classroom or video call
  };

  const handleAccessMaterials = (enrollment: ClassroomEnrollment) => {
    toast({
      title: "Course Materials",
      description: "Opening course materials and resources...",
    });
    // In a real app, this would open course materials, PDFs, etc.
  };

  const handleAccessCommunity = (enrollment: ClassroomEnrollment) => {
    toast({
      title: "Class Community",
      description: "Opening class discussion forum...",
    });
    // In a real app, this would open a community/discussion forum
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-6 bg-muted rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-32 bg-muted rounded"></div>
            <div className="h-32 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  const activeEnrollments = (enrollments || []).filter((e: any) => e.status === 'active');
  const completedEnrollments = (enrollments || []).filter((e: any) => e.status === 'completed');

  return (
    <div className="space-y-8">
      {/* Active Classrooms */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
            <BookOpen className="h-6 w-6 text-primary" />
            My Active Classrooms
          </h2>
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            {activeEnrollments.length} Active
          </Badge>
        </div>

        {activeEnrollments.length > 0 ? (
          <div className="grid gap-6">
            {activeEnrollments.map((enrollment: any) => {
              const progress = calculateProgress(enrollment.enrolled_at, enrollment.classrooms.duration_weeks);
              const weeksRemaining = getWeeksRemaining(enrollment.enrolled_at, enrollment.classrooms.duration_weeks);
              
              return (
                <Card key={enrollment.id} className="border-l-4 border-l-primary bg-card/50 backdrop-blur-sm hover:shadow-md transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="grid md:grid-cols-3 gap-6">
                      {/* Classroom Info */}
                      <div className="md:col-span-2 space-y-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/70 rounded-lg flex items-center justify-center">
                                <BookOpen className="h-6 w-6 text-primary-foreground" />
                              </div>
                              <div>
                                <h3 className="font-bold text-xl text-foreground">{enrollment.classrooms.name}</h3>
                                <p className="text-muted-foreground text-sm">{enrollment.classrooms.subject}</p>
                              </div>
                            </div>
                            <Badge variant="outline" className="mb-3">
                              {enrollment.classrooms.level} Level
                            </Badge>
                          </div>
                        </div>

                        {/* Classroom Details */}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span>Instructor: {enrollment.classrooms?.teachers?.name || 'TBD'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>{enrollment.classrooms.session_duration_minutes}min sessions</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>{enrollment.classrooms.sessions_per_week}x per week</span>
                          </div>
                        </div>

                        {/* Progress */}
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-foreground">Course Progress</span>
                            <span className="text-sm font-bold text-primary">{Math.round(progress)}% Complete</span>
                          </div>
                          <Progress value={progress} className="h-2" />
                          <p className="text-xs text-muted-foreground">
                            {weeksRemaining} weeks remaining • Started {new Date(enrollment.enrolled_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col gap-3">
                        <Button 
                          onClick={() => handleJoinClass(enrollment)}
                          className="bg-primary hover:bg-primary/90 text-primary-foreground"
                          size="lg"
                        >
                          <Video className="h-4 w-4 mr-2" />
                          Join Live Class
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={() => handleAccessMaterials(enrollment)}
                          size="lg"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Course Materials
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={() => handleAccessCommunity(enrollment)}
                          size="lg"
                        >
                          <Users className="h-4 w-4 mr-2" />
                          Class Community
                        </Button>
                      </div>
                    </div>

                    {enrollment.classrooms.description && (
                      <div className="mt-4 pt-4 border-t border-border">
                        <p className="text-sm text-muted-foreground">{enrollment.classrooms.description}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="border-dashed border-2">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No Active Enrollments</h3>
              <p className="text-muted-foreground mb-4">
                You haven't enrolled in any classrooms yet. Browse our available courses to get started.
              </p>
              <Button className="bg-primary hover:bg-primary/90">
                <ExternalLink className="h-4 w-4 mr-2" />
                Browse Classrooms
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Completed Classrooms */}
      {completedEnrollments.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-3">
              <BookOpen className="h-5 w-5 text-muted-foreground" />
              Completed Classrooms
            </h2>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              {completedEnrollments.length} Completed
            </Badge>
          </div>
          
          <div className="grid gap-4">
            {completedEnrollments.map((enrollment) => (
              <Card key={enrollment.id} className="opacity-75 hover:opacity-90 transition-opacity">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <BookOpen className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground">{enrollment.classrooms.name}</h4>
                        <p className="text-sm text-muted-foreground">{enrollment.classrooms.subject}</p>
                      </div>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Completed
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Completed on {new Date(enrollment.enrolled_at).toLocaleDateString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyClassrooms;