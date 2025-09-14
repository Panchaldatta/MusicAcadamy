
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Users, Video, Calendar, MapPin } from "lucide-react";
import { format, isToday, isTomorrow } from "date-fns";
import { useUpcomingTeacherSessions } from "@/hooks/useTeacherSessions";

interface ClassSession {
  id: string;
  classroomName: string;
  date: Date;
  startTime: string;
  endTime: string;
  students: number;
  location: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'starting_soon';
}

interface UpcomingClassesProps {
  detailed?: boolean;
  sessions?: ClassSession[];
  onJoinClass?: (sessionId: string) => void;
  onViewDetails?: (sessionId: string) => void;
}

const UpcomingClasses = ({ 
  detailed = false, 
  sessions,
  onJoinClass,
  onViewDetails 
}: UpcomingClassesProps) => {
  const { data: teacherSessions = [], isLoading } = useUpcomingTeacherSessions();

  // Convert teacher sessions to ClassSession format
  const convertedSessions: ClassSession[] = teacherSessions.map(session => {
    const sessionDate = new Date(session.session_date);
    // Check if session is starting within the next hour
    const now = new Date();
    const sessionDateTime = new Date(`${session.session_date}T${session.start_time}`);
    const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);
    const isStartingSoon = sessionDateTime <= oneHourFromNow && sessionDateTime > now;

    return {
      id: session.id,
      classroomName: session.classroom?.name || 'Unnamed Classroom',
      date: sessionDate,
      startTime: session.start_time,
      endTime: session.end_time,
      students: session.student_count,
      location: session.location,
      status: isStartingSoon ? 'starting_soon' : session.status as any
    };
  });

  const upcomingClasses = sessions || convertedSessions;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'starting_soon':
        return 'bg-green-500';
      case 'scheduled':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'starting_soon':
        return 'Starting Soon';
      case 'scheduled':
        return 'Scheduled';
      default:
        return 'Unknown';
    }
  };

  const getDateDisplay = (date: Date) => {
    if (isToday(date)) return "Today";
    if (isTomorrow(date)) return "Tomorrow";
    return format(date, "EEEE");
  };

  if (isLoading && !sessions) {
    return (
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-green-400" />
            Upcoming Classes
          </CardTitle>
          <CardDescription className="text-gray-300">
            Loading your upcoming classes...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-white/10 rounded-lg"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!detailed) {
    return (
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-green-400" />
            Upcoming Classes
          </CardTitle>
          <CardDescription className="text-gray-300">
            Your next classes this week
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {upcomingClasses.slice(0, 3).map((classItem) => (
              <div key={classItem.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="flex flex-col">
                    <span className="text-white font-medium text-sm">{classItem.classroomName}</span>
                    <div className="flex items-center gap-2 text-gray-400 text-xs">
                      <span>{getDateDisplay(classItem.date)} at {classItem.startTime}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {classItem.location}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={`${getStatusColor(classItem.status)} text-white text-xs`}>
                    {getStatusText(classItem.status)}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
          {upcomingClasses.length > 3 && (
            <div className="mt-4 pt-3 border-t border-white/10">
              <Button 
                variant="outline" 
                size="sm"
                className="w-full border-white/30 text-white hover:bg-white/10"
                onClick={() => onViewDetails?.('all')}
              >
                View All Classes
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="text-white">This Week's Schedule</CardTitle>
          <CardDescription className="text-gray-300">
            All your upcoming classes and sessions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingClasses.map((classItem) => (
              <div key={classItem.id} className="p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                      <Video className="h-5 w-5 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">{classItem.classroomName}</h3>
                      <p className="text-gray-400 text-sm">
                        {getDateDisplay(classItem.date)} at {classItem.startTime} - {classItem.endTime}
                      </p>
                    </div>
                  </div>
                  <Badge className={`${getStatusColor(classItem.status)} text-white`}>
                    {getStatusText(classItem.status)}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-gray-300 text-sm">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{classItem.students} students</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{classItem.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{classItem.startTime} - {classItem.endTime}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    {classItem.status === 'starting_soon' && (
                      <Button 
                        size="sm" 
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => onJoinClass?.(classItem.id)}
                      >
                        Join Class
                      </Button>
                    )}
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="border-white/30 text-white hover:bg-white/10"
                      onClick={() => onViewDetails?.(classItem.id)}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UpcomingClasses;
