
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, Users, CheckCircle, XCircle, AlertCircle } from "lucide-react";

interface ClassSession {
  id: string;
  classroomId: string;
  classroomName: string;
  date: Date;
  startTime: string;
  endTime: string;
  students: number;
  location: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}

interface ScheduleStatsProps {
  sessions: ClassSession[];
}

const ScheduleStats = ({ sessions }: ScheduleStatsProps) => {
  const today = new Date();
  const thisWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  const totalSessions = sessions.length;
  const scheduledSessions = sessions.filter(s => s.status === 'scheduled').length;
  const completedSessions = sessions.filter(s => s.status === 'completed').length;
  const cancelledSessions = sessions.filter(s => s.status === 'cancelled').length;
  
  const thisWeekSessions = sessions.filter(s => s.date >= thisWeek).length;
  const totalStudentsThisWeek = sessions
    .filter(s => s.date >= thisWeek && s.status !== 'cancelled')
    .reduce((sum, s) => sum + s.students, 0);

  const stats = [
    {
      title: "Total Sessions",
      value: totalSessions,
      icon: Calendar,
      color: "text-blue-400",
      bgColor: "bg-blue-500/20"
    },
    {
      title: "This Week",
      value: thisWeekSessions,
      icon: Clock,
      color: "text-green-400",
      bgColor: "bg-green-500/20"
    },
    {
      title: "Students This Week",
      value: totalStudentsThisWeek,
      icon: Users,
      color: "text-purple-400",
      bgColor: "bg-purple-500/20"
    },
    {
      title: "Completed",
      value: completedSessions,
      icon: CheckCircle,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/20"
    }
  ];

  const statusBreakdown = [
    {
      label: "Scheduled",
      count: scheduledSessions,
      icon: AlertCircle,
      color: "text-blue-400"
    },
    {
      label: "Completed",
      count: completedSessions,
      icon: CheckCircle,
      color: "text-green-400"
    },
    {
      label: "Cancelled",
      count: cancelledSessions,
      icon: XCircle,
      color: "text-red-400"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Main Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm">{stat.title}</p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                </div>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Status Breakdown */}
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Session Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {statusBreakdown.map((status) => (
              <div key={status.label} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center gap-3">
                  <status.icon className={`h-5 w-5 ${status.color}`} />
                  <span className="text-white">{status.label}</span>
                </div>
                <span className="text-white font-semibold">{status.count}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScheduleStats;
