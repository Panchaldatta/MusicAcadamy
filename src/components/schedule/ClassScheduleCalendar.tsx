
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Users, MapPin, Edit, Trash2 } from "lucide-react";
import { format, isSameDay, parseISO } from "date-fns";

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

interface ClassScheduleCalendarProps {
  sessions: ClassSession[];
  onEditSession: (session: ClassSession) => void;
  onDeleteSession: (sessionId: string) => void;
  onAddSession: (date: Date) => void;
}

const ClassScheduleCalendar = ({ 
  sessions, 
  onEditSession, 
  onDeleteSession, 
  onAddSession 
}: ClassScheduleCalendarProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const getSessionsForDate = (date: Date) => {
    return sessions.filter(session => isSameDay(session.date, date));
  };

  const getDatesWithSessions = () => {
    return sessions.map(session => session.date);
  };

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

  const selectedDateSessions = getSessionsForDate(selectedDate);

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Calendar */}
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Class Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && setSelectedDate(date)}
            modifiers={{
              hasSession: getDatesWithSessions(),
            }}
            modifiersStyles={{
              hasSession: { 
                backgroundColor: 'rgba(168, 85, 247, 0.3)',
                borderRadius: '50%'
              }
            }}
            className="bg-white/5 rounded-lg p-3 pointer-events-auto"
          />
          <div className="mt-4">
            <Button
              onClick={() => onAddSession(selectedDate)}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              Schedule Class for {format(selectedDate, 'MMM dd')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Selected Date Sessions */}
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="text-white">
            Classes on {format(selectedDate, 'MMMM dd, yyyy')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedDateSessions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400 mb-4">No classes scheduled for this date</p>
              <Button
                onClick={() => onAddSession(selectedDate)}
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10"
              >
                Schedule a Class
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {selectedDateSessions.map((session) => (
                <div
                  key={session.id}
                  className="p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-white font-semibold">{session.classroomName}</h3>
                      <div className="flex items-center gap-4 text-gray-300 text-sm mt-1">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{session.startTime} - {session.endTime}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{session.students} students</span>
                        </div>
                      </div>
                    </div>
                    <Badge className={`${getStatusColor(session.status)} text-white`}>
                      {session.status}
                    </Badge>
                  </div>

                  {session.location && (
                    <div className="flex items-center gap-1 text-gray-300 text-sm mb-3">
                      <MapPin className="h-4 w-4" />
                      <span>{session.location}</span>
                    </div>
                  )}

                  {session.notes && (
                    <p className="text-gray-300 text-sm mb-3">{session.notes}</p>
                  )}

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
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ClassScheduleCalendar;
