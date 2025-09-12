import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User, Video, MessageCircle, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";

interface LessonBooking {
  id: string;
  lesson_date: string;
  lesson_duration: number;
  price: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  teachers: {
    name: string;
    subject: string;
  };
}

const MyBookings: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();

  // Fetch student's lesson bookings
  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ['student-bookings', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('lesson_bookings')
        .select(`
          id,
          lesson_date,
          lesson_duration,
          price,
          status,
          notes,
          teachers (
            name,
            subject
          )
        `)
        .eq('student_id', user.id)
        .order('lesson_date', { ascending: false });

      if (error) {
        console.error('Error fetching lesson bookings:', error);
        return [];
      }
      return (data || []) as LessonBooking[];
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 60 * 1000, // Refetch every minute for real-time updates
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleJoinLesson = (booking: LessonBooking) => {
    toast({
      title: "Video Call",
      description: "Opening video call room...",
    });
  };

  const handleMessageTeacher = (booking: LessonBooking) => {
    toast({
      title: "Message Sent",
      description: `Message sent to ${booking.teachers.name}`,
    });
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

  const upcomingBookings = bookings.filter(b => 
    b.status === 'confirmed' && new Date(b.lesson_date) > new Date()
  );
  
  const pastBookings = bookings.filter(b => 
    b.status === 'completed' || new Date(b.lesson_date) < new Date()
  );

  return (
    <div className="space-y-6">
      {/* Upcoming Lessons */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Upcoming Lessons</h3>
        {upcomingBookings.length > 0 ? (
          <div className="grid gap-4">
            {upcomingBookings.map((booking) => (
              <Card key={booking.id} className="border-l-4 border-l-green-500">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <span className="font-semibold">{booking.teachers.name}</span>
                        <Badge className={getStatusColor(booking.status)}>
                          {booking.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <BookOpen className="h-3 w-3" />
                          {booking.teachers.subject}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(booking.lesson_date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {booking.lesson_duration} min
                        </div>
                      </div>
                      {booking.notes && (
                        <p className="text-sm text-gray-600 mb-3">
                          Notes: {booking.notes}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        onClick={() => handleJoinLesson(booking)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Video className="h-3 w-3 mr-1" />
                        Join
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleMessageTeacher(booking)}
                      >
                        <MessageCircle className="h-3 w-3 mr-1" />
                        Message
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-6 text-center">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No upcoming lessons scheduled</p>
              <Button className="mt-3" size="sm">
                Book a Lesson
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Past Lessons */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Past Lessons</h3>
        {pastBookings.length > 0 ? (
          <div className="grid gap-4">
            {pastBookings.slice(0, 5).map((booking) => (
              <Card key={booking.id} className="opacity-75">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">{booking.teachers.name}</span>
                      <span className="text-sm text-gray-500">•</span>
                      <span className="text-sm text-gray-500">{booking.teachers.subject}</span>
                      <Badge className={getStatusColor(booking.status)}>
                        {booking.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(booking.lesson_date).toLocaleDateString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-6 text-center">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No past lessons yet</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MyBookings;