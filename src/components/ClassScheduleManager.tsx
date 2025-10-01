
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, List, BarChart3, Plus } from "lucide-react";
import { useTeacherClassrooms } from "@/hooks/useClassrooms";
import { useClassSessions, useCreateClassSession, useUpdateClassSession, useDeleteClassSession } from "@/hooks/useClassSessions";
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
  meetLink?: string;
}

const ClassScheduleManager = () => {
  const { data: classrooms = [], isLoading: classroomsLoading } = useTeacherClassrooms();
  const { data: sessions = [], isLoading: sessionsLoading, error } = useClassSessions();
  const createSession = useCreateClassSession();
  const updateSession = useUpdateClassSession();
  const deleteSession = useDeleteClassSession();
  const { toast } = useToast();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<ClassSession | undefined>();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  const isLoading = classroomsLoading || sessionsLoading;

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

  const handleDeleteSession = async (sessionId: string) => {
    if (window.confirm("Are you sure you want to delete this session?")) {
      try {
        await deleteSession.mutateAsync(sessionId);
      } catch (error) {
        console.error('Error deleting session:', error);
      }
    }
  };

  const handleSaveSession = async (sessionData: Omit<ClassSession, 'id'>) => {
    try {
      const dbSessionData = {
        classroom_id: sessionData.classroomId,
        session_date: sessionData.date.toISOString().split('T')[0],
        start_time: sessionData.startTime,
        end_time: sessionData.endTime,
        student_count: sessionData.students,
        location: sessionData.location,
        status: sessionData.status,
        notes: sessionData.notes,
        meet_link: sessionData.meetLink
      };

      if (editingSession) {
        await updateSession.mutateAsync({
          id: editingSession.id,
          ...dbSessionData
        });
      } else {
        await createSession.mutateAsync(dbSessionData);
      }

      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving session:', error);
    }
  };

  if (error) {
    return (
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardContent className="p-8 text-center">
          <p className="text-red-400 mb-4">Error loading schedule data</p>
          <p className="text-gray-300">Please make sure you're logged in and try again.</p>
        </CardContent>
      </Card>
    );
  }

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
          disabled={classrooms.length === 0}
        >
          <Plus className="h-4 w-4 mr-2" />
          Schedule New Class
        </Button>
      </div>

      {classrooms.length === 0 && (
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardContent className="p-6 text-center">
            <p className="text-yellow-400 mb-2">No Classrooms Available</p>
            <p className="text-gray-300">You need to create at least one classroom before you can schedule classes.</p>
          </CardContent>
        </Card>
      )}

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
            <CardContent className="p-8 text-center">
              <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-300">Advanced analytics coming soon!</p>
              <p className="text-gray-400 text-sm mt-2">
                Track your teaching patterns, student attendance, and scheduling efficiency.
              </p>
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
