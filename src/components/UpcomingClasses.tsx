
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Users, Video, Calendar } from "lucide-react";

interface UpcomingClassesProps {
  detailed?: boolean;
}

const UpcomingClasses = ({ detailed = false }: UpcomingClassesProps) => {
  const upcomingClasses = [
    {
      id: 1,
      name: "Piano Fundamentals",
      time: "4:00 PM",
      date: "Today",
      students: 15,
      duration: "60 min",
      status: "starting_soon"
    },
    {
      id: 2,
      name: "Guitar Masterclass",
      time: "6:00 PM",
      date: "Today",
      students: 8,
      duration: "90 min",
      status: "scheduled"
    },
    {
      id: 3,
      name: "Vocal Training Basics",
      time: "5:30 PM",
      date: "Tomorrow",
      students: 12,
      duration: "60 min",
      status: "scheduled"
    },
    {
      id: 4,
      name: "Piano Fundamentals",
      time: "4:00 PM",
      date: "Wednesday",
      students: 15,
      duration: "60 min",
      status: "scheduled"
    }
  ];

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
              <div key={classItem.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="flex flex-col">
                    <span className="text-white font-medium text-sm">{classItem.name}</span>
                    <span className="text-gray-400 text-xs">{classItem.date} at {classItem.time}</span>
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
                      <h3 className="text-white font-semibold">{classItem.name}</h3>
                      <p className="text-gray-400 text-sm">{classItem.date} at {classItem.time}</p>
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
                      <Clock className="h-4 w-4" />
                      <span>{classItem.duration}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    {classItem.status === 'starting_soon' && (
                      <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                        Join Class
                      </Button>
                    )}
                    <Button size="sm" variant="outline" className="border-white/30 text-white hover:bg-white/10">
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
