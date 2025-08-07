import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Calendar, Clock, User, Video, Download, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ClassroomEnrollment {
  id: string;
  enrolled_at: string;
  status: 'active' | 'completed' | 'paused';
  classrooms: {
    name: string;
    subject: string;
    duration_weeks: number;
    session_duration_minutes: number;
    sessions_per_week: number;
    level: string;
    image_url?: string;
    teachers: {
      name: string;
    };
  };
}

interface MyClassroomsProps {
  enrollments: ClassroomEnrollment[];
}

const MyClassrooms: React.FC<MyClassroomsProps> = ({ enrollments }) => {
  const { toast } = useToast();

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
  };

  const handleAccessMaterials = (enrollment: ClassroomEnrollment) => {
    toast({
      title: "Course Materials",
      description: "Opening course materials and resources...",
    });
  };

  const activeEnrollments = enrollments.filter(e => e.status === 'active');
  const completedEnrollments = enrollments.filter(e => e.status === 'completed');

  return (
    <div className="space-y-6">
      {/* Active Classrooms */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Active Classrooms</h3>
        {activeEnrollments.length > 0 ? (
          <div className="grid gap-4">
            {activeEnrollments.map((enrollment) => {
              const progress = calculateProgress(enrollment.enrolled_at, enrollment.classrooms.duration_weeks);
              const weeksRemaining = getWeeksRemaining(enrollment.enrolled_at, enrollment.classrooms.duration_weeks);
              
              return (
                <Card key={enrollment.id} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <BookOpen className="h-5 w-5 text-blue-600" />
                          <h4 className="font-semibold text-lg">{enrollment.classrooms.name}</h4>
                          <Badge variant="secondary" className="capitalize">
                            {enrollment.classrooms.level}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            Instructor: {enrollment.classrooms.teachers.name}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {enrollment.classrooms.session_duration_minutes}min sessions
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {enrollment.classrooms.sessions_per_week}x per week
                          </div>
                        </div>
                        
                        {/* Progress */}
                        <div className="mb-4">
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-600">Course Progress</span>
                            <span className="font-medium">{Math.round(progress)}% Complete</span>
                          </div>
                          <Progress value={progress} className="h-2" />
                          <p className="text-xs text-gray-500 mt-1">
                            {weeksRemaining} weeks remaining
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        onClick={() => handleJoinClass(enrollment)}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Video className="h-4 w-4 mr-2" />
                        Join Class
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => handleAccessMaterials(enrollment)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Materials
                      </Button>
                      <Button variant="outline">
                        <Users className="h-4 w-4 mr-2" />
                        Community
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="p-6 text-center">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No active classroom enrollments</p>
              <Button className="mt-3" size="sm">
                Browse Classrooms
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Completed Classrooms */}
      {completedEnrollments.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Completed Classrooms</h3>
          <div className="grid gap-4">
            {completedEnrollments.map((enrollment) => (
              <Card key={enrollment.id} className="opacity-75">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <BookOpen className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">{enrollment.classrooms.name}</span>
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        Completed
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-500">
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