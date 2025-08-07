import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Calendar, Clock, User, BookOpen, Video, MessageCircle, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [bookingDetails, setBookingDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const sessionId = searchParams.get('session_id');
  const type = searchParams.get('type'); // 'lesson' or 'classroom'

  useEffect(() => {
    const verifyPaymentAndFetchDetails = async () => {
      if (!sessionId) {
        setIsLoading(false);
        return;
      }

      try {
        // Verify payment
        const { data: verificationData, error: verificationError } = await supabase.functions.invoke('verify-payment', {
          body: { sessionId }
        });

        if (verificationError) {
          console.error('Payment verification error:', verificationError);
          toast({
            title: "Verification Error",
            description: "There was an issue verifying your payment. Please contact support.",
            variant: "destructive",
          });
          return;
        }

        // Fetch booking details based on type
        if (type === 'lesson') {
          // Fetch lesson booking details
          const { data: lessonData, error: lessonError } = await supabase
            .from('lesson_bookings')
            .select(`
              *,
              teachers!inner(name, subject, image_url, price)
            `)
            .eq('status', 'confirmed')
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          if (!lessonError && lessonData) {
            setBookingDetails({ type: 'lesson', data: lessonData });
          }
        } else if (type === 'classroom') {
          // Fetch classroom enrollment details
          const { data: enrollmentData, error: enrollmentError } = await supabase
            .from('classroom_enrollments')
            .select(`
              *,
              classrooms!inner(name, subject, duration_weeks, session_duration_minutes, price, teacher_id),
              classrooms.teachers!inner(name)
            `)
            .eq('status', 'active')
            .order('enrolled_at', { ascending: false })
            .limit(1)
            .single();

          if (!enrollmentError && enrollmentData) {
            setBookingDetails({ type: 'classroom', data: enrollmentData });
          }
        }

      } catch (error) {
        console.error('Error during payment verification:', error);
        toast({
          title: "Error",
          description: "Something went wrong. Please contact support.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    verifyPaymentAndFetchDetails();
  }, [sessionId, type, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful! 🎉</h1>
          <p className="text-gray-600 text-lg">
            {type === 'lesson' ? 'Your lesson has been booked successfully!' : 'Welcome to your new classroom!'}
          </p>
        </div>

        {/* Booking Details */}
        {bookingDetails && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {type === 'lesson' ? (
                  <>
                    <User className="h-5 w-5 text-blue-600" />
                    Lesson Booking Confirmed
                  </>
                ) : (
                  <>
                    <BookOpen className="h-5 w-5 text-purple-600" />
                    Classroom Enrollment Confirmed
                  </>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {type === 'lesson' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Lesson Details</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">{bookingDetails.data.teachers.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-gray-500" />
                        <span>{bookingDetails.data.teachers.subject}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span>{new Date(bookingDetails.data.lesson_date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span>{bookingDetails.data.lesson_duration} minutes</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Next Steps</h3>
                    <div className="space-y-3">
                      <Button className="w-full" variant="outline">
                        <Video className="h-4 w-4 mr-2" />
                        Join Video Call (Available on lesson day)
                      </Button>
                      <Button className="w-full" variant="outline">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Message Your Teacher
                      </Button>
                      <Button className="w-full" variant="outline">
                        <Calendar className="h-4 w-4 mr-2" />
                        Add to Calendar
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Classroom Details</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">{bookingDetails.data.classrooms.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <span>Instructor: {bookingDetails.data.classrooms.teachers.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span>{bookingDetails.data.classrooms.duration_weeks} weeks • {bookingDetails.data.classrooms.session_duration_minutes}min sessions</span>
                      </div>
                      <Badge variant="secondary" className="mt-2">
                        Enrolled on {new Date(bookingDetails.data.enrolled_at).toLocaleDateString()}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Get Started</h3>
                    <div className="space-y-3">
                      <Button className="w-full">
                        <BookOpen className="h-4 w-4 mr-2" />
                        Access Course Materials
                      </Button>
                      <Button className="w-full" variant="outline">
                        <Calendar className="h-4 w-4 mr-2" />
                        View Class Schedule
                      </Button>
                      <Button className="w-full" variant="outline">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Join Class Community
                      </Button>
                      <Button className="w-full" variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Download App
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* What's Next Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>What Happens Next?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 font-bold">1</span>
                </div>
                <h3 className="font-semibold mb-2">Confirmation Email</h3>
                <p className="text-sm text-gray-600">
                  You'll receive a detailed confirmation email with all the information you need.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-green-600 font-bold">2</span>
                </div>
                <h3 className="font-semibold mb-2">
                  {type === 'lesson' ? 'Teacher Contact' : 'Access Materials'}
                </h3>
                <p className="text-sm text-gray-600">
                  {type === 'lesson' 
                    ? 'Your teacher will contact you 24 hours before the lesson.'
                    : 'Get immediate access to course materials and the learning platform.'
                  }
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-purple-600 font-bold">3</span>
                </div>
                <h3 className="font-semibold mb-2">
                  {type === 'lesson' ? 'Join Your Lesson' : 'Start Learning'}
                </h3>
                <p className="text-sm text-gray-600">
                  {type === 'lesson'
                    ? 'Join the video call at your scheduled time and start learning!'
                    : 'Begin your musical journey with structured lessons and community support.'
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link to={type === 'lesson' ? '/browse-teachers' : '/browse-classrooms'}>
              {type === 'lesson' ? 'Book Another Lesson' : 'Browse More Classrooms'}
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/student-dashboard">
              Go to My Dashboard
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;