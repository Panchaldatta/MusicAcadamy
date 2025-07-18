
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock, Users, MapPin, Edit, Trash2, Search, Filter } from "lucide-react";
import { format, isToday, isTomorrow, isPast } from "date-fns";

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

interface ScheduleListViewProps {
  sessions: ClassSession[];
  onEditSession: (session: ClassSession) => void;
  onDeleteSession: (sessionId: string) => void;
}

const ScheduleListView = ({ sessions, onEditSession, onDeleteSession }: ScheduleListViewProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-500';
      case 'completed':
        return 'bg-green-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getDateDisplay = (date: Date) => {
    if (isToday(date)) return "Today";
    if (isTomorrow(date)) return "Tomorrow";
    if (isPast(date)) return format(date, 'MMM dd');
    return format(date, 'MMM dd');
  };

  const filteredAndSortedSessions = sessions
    .filter(session => {
      const matchesSearch = session.classroomName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           session.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || session.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return a.date.getTime() - b.date.getTime();
        case 'classroom':
          return a.classroomName.localeCompare(b.classroomName);
        case 'students':
          return b.students - a.students;
        default:
          return 0;
      }
    });

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filter & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by classroom or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-white/20">
                <SelectItem value="all" className="text-white hover:bg-white/10">All Statuses</SelectItem>
                <SelectItem value="scheduled" className="text-white hover:bg-white/10">Scheduled</SelectItem>
                <SelectItem value="completed" className="text-white hover:bg-white/10">Completed</SelectItem>
                <SelectItem value="cancelled" className="text-white hover:bg-white/10">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-white/20">
                <SelectItem value="date" className="text-white hover:bg-white/10">Date</SelectItem>
                <SelectItem value="classroom" className="text-white hover:bg-white/10">Classroom</SelectItem>
                <SelectItem value="students" className="text-white hover:bg-white/10">Students</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Sessions List */}
      <div className="space-y-4">
        {filteredAndSortedSessions.length === 0 ? (
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="p-8 text-center">
              <p className="text-gray-400">No sessions match your current filters.</p>
            </CardContent>
          </Card>
        ) : (
          filteredAndSortedSessions.map((session) => (
            <Card key={session.id} className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-colors">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-white font-semibold text-lg">{session.classroomName}</h3>
                      <Badge className={`${getStatusColor(session.status)} text-white`}>
                        {session.status}
                      </Badge>
                      {isPast(session.date) && session.status === 'scheduled' && (
                        <Badge className="bg-yellow-500 text-white">
                          Overdue
                        </Badge>
                      )}
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-4 text-gray-300 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{getDateDisplay(session.date)} • {session.startTime} - {session.endTime}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>{session.students} students</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{session.location}</span>
                      </div>
                    </div>

                    {session.notes && (
                      <p className="text-gray-300 text-sm mt-2 italic">{session.notes}</p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onEditSession(session)}
                      className="border-white/30 text-white hover:bg-white/10"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onDeleteSession(session.id)}
                      className="border-red-400/30 text-red-400 hover:bg-red-400/10"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default ScheduleListView;
