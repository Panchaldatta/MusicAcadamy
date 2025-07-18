
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, List, BarChart3, Plus } from "lucide-react";
import { useTeacherClassrooms } from "@/hooks/useClassrooms";
import { useToast } from "@/hooks/use-toast";
import ClassScheduleCalendar from "./schedule/ClassScheduleCalendar";
import ScheduleListView from "./schedule/ScheduleListView";
import ScheduleStats from "./schedule/ScheduleStats";
import ScheduleSessionDialog from "./schedule/ScheduleSessionDialog";

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

const ClassScheduleManager = () => {
  const { data: classrooms = [], isLoading } = useTeacherClassrooms();
  const { toast } = useToast();
  
  // Mock data for demonstration - in a real app, this would come from a database
  const [sessions, setSessions] = useState<ClassSession[]>([
    {
      id: '1',
      classroomId: 'classroom-1',
      classroomName: 'Piano Fundamentals',
      date: new Date(2024, 0, 20), // January 20, 2024
      startTime: '09:00',
      endTime: '10:00',
      students: 12,
      location: 'Online',
      status: 'scheduled',
      notes: 'Focus on scales and basic technique'
    },
    {
      id: '2',
      classroomId: 'classroom-2',
      classroomName: 'Guitar Masterclass',
      date: new Date(2024, 0, 21), // January 21, 2024
      startTime: '14:00',
      endTime: '15:30',
      students: 8,
      location: 'Studio A',
      status: 'scheduled',
    },
    {
      id: '3',
      classroomId: 'classroom-3',
      classroomName: 'Vocal Training',
      date: new Date(2024, 0, 19), // January 19, 2024
      startTime: '16:00',
      endTime: '17:00',
      students: 15,
      location: 'Online',
      status: 'completed',
      notes: 'Great session - students showed excellent progress'
    },
    {
      id: '4',
      classroomId: 'classroom-1',
      classroomName: 'Piano Fundamentals',
      date: new Date(2024, 0, 22), // January 22, 2024
      startTime: '10:00',
      endTime: '11:00',
      students: 12,
      location: 'Online',
      status: 'scheduled',
    },
    {
      id: '5',
      classroomId: 'classroom-4',
      classroomName: 'Music Theory 101',
      date: new Date(2024, 0, 18), // January 18, 2024
      startTime: '13:00',
      endTime: '14:00',
      students: 6,
      location: 'Room 205',
      status: 'cancelled',
      notes: 'Cancelled due to technical issues'
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<ClassSession | undefined>();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  const handleAddSession = (date: Date) => {
    setSelectedDate(date);
    setEditingSession(undefined);
    setIsDialogOpen(true);
  };

  const handleEditSession = (session: ClassSession) => {
    setEditingSession(session);
    setSelectedDate(undefined);
    setIsDialogOpen(true);
  };

  const handleDeleteSession = (sessionId: string) => {
    if (window.confirm("Are you sure you want to delete this session?")) {
      setSessions(prev => prev.filter(s => s.id !== sessionId));
      toast({
        title: "Session Deleted",
        description: "The class session has been removed from your schedule.",
      });
    }
  };

  const handleSaveSession = (sessionData: Omit<ClassSession, 'id'>) => {
    if (editingSession) {
      // Update existing session
      setSessions(prev => prev.map(s => 
        s.id === editingSession.id 
          ? { ...sessionData, id: editingSession.id }
          : s
      ));
    } else {
      // Create new session
      const newSession: ClassSession = {
        ...sessionData,
        id: `session-${Date.now()}`
      };
      setSessions(prev => [...prev, newSession]);
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardContent className="p-8 text-center">
          <p className="text-white">Loading schedule...</p>
        </CardContent>
      </Card>
    );
  }

  const classroomOptions = classrooms.map(classroom => ({
    id: classroom.id,
    name: classroom.name,
    capacity: classroom.capacity
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Class Schedule</h2>
          <p className="text-gray-300">Manage your teaching schedule and track class sessions</p>
        </div>
        <Button
          onClick={() => handleAddSession(new Date())}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Schedule New Class
        </Button>
      </div>

      {/* Stats Overview */}
      <ScheduleStats sessions={sessions} />

      {/* Main Content */}
      <Tabs defaultValue="calendar" className="space-y-6">
        <TabsList className="bg-white/10 border-white/20">
          <TabsTrigger value="calendar" className="data-[state=active]:bg-white/20">
            <CalendarDays className="h-4 w-4 mr-2" />
            Calendar View
          </TabsTrigger>
          <TabsTrigger value="list" className="data-[state=active]:bg-white/20">
            <List className="h-4 w-4 mr-2" />
            List View
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-white/20">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calendar">
          <ClassScheduleCalendar
            sessions={sessions}
            onEditSession={handleEditSession}
            onDeleteSession={handleDeleteSession}
            onAddSession={handleAddSession}
          />
        </TabsContent>

        <TabsContent value="list">
          <ScheduleListView
            sessions={sessions}
            onEditSession={handleEditSession}
            onDeleteSession={handleDeleteSession}
          />
        </TabsContent>

        <TabsContent value="analytics">
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Schedule Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-300">Advanced analytics coming soon!</p>
                <p className="text-gray-400 text-sm mt-2">
                  Track your teaching patterns, student attendance, and scheduling efficiency.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Schedule Session Dialog */}
      <ScheduleSessionDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        session={editingSession}
        selectedDate={selectedDate}
        classrooms={classroomOptions}
        onSave={handleSaveSession}
      />
    </div>
  );
};

export default ClassScheduleManager;
