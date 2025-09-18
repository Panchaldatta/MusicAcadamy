import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, BookOpen, Calendar, DollarSign, TrendingUp, Eye } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Database } from "@/integrations/supabase/types";

type EnrollmentWithDetails = {
  id: string;
  classroom_id: string;
  student_id: string;
  enrolled_at: string;
  status: 'active' | 'completed' | 'paused';
  classrooms: {
    name: string;
    subject: string;
    price: number;
    duration_weeks: number;
  };
  profiles: {
    first_name: string;
    last_name: string;
    email: string;
  };
};

const TeacherEnrollments = () => {
  const [enrollments, setEnrollments] = useState<EnrollmentWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEnrollments: 0,
    activeEnrollments: 0,
    totalRevenue: 0,
    recentEnrollments: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    loadEnrollments();
  }, []);

  const loadEnrollments = async () => {
    try {
      setLoading(true);
      
      // Get current user (teacher)
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch enrollments for teacher's classrooms with student details
      const { data, error } = await supabase
        .from('classroom_enrollments')
        .select(`
          id,
          classroom_id,
          student_id,
          enrolled_at,
          status,
          classrooms!inner (
            name,
            subject,
            price,
            duration_weeks,
            teacher_id
          ),
          profiles!classroom_enrollments_student_id_fkey (
            first_name,
            last_name,
            email
          )
        `)
        .eq('classrooms.teacher_id', user.id)
        .order('enrolled_at', { ascending: false });

      if (error) throw error;

      const enrollmentData = (data || []) as unknown as EnrollmentWithDetails[];
      setEnrollments(enrollmentData);

      // Calculate stats
      const totalEnrollments = enrollmentData.length;
      const activeEnrollments = enrollmentData.filter(e => e.status === 'active').length;
      const totalRevenue = enrollmentData.reduce((sum, e) => sum + e.classrooms.price, 0);
      
      // Recent enrollments (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const recentEnrollments = enrollmentData.filter(e => 
        new Date(e.enrolled_at) > thirtyDaysAgo
      ).length;

      setStats({
        totalEnrollments,
        activeEnrollments,
        totalRevenue,
        recentEnrollments
      });

    } catch (error) {
      console.error('Error loading enrollments:', error);
      toast({
        title: "Error",
        description: "Failed to load enrollment data.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700 border-green-200';
      case 'completed': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'paused': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="bg-white/10 backdrop-blur-md border-white/20 animate-pulse">
              <CardContent className="p-6">
                <div className="h-6 bg-white/20 rounded mb-2"></div>
                <div className="h-8 bg-white/20 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-300">Total Enrollments</p>
                <p className="text-2xl font-bold text-white">{stats.totalEnrollments}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-300">Active Students</p>
                <p className="text-2xl font-bold text-white">{stats.activeEnrollments}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-lg">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-300">Total Revenue</p>
                <p className="text-2xl font-bold text-white">₹{stats.totalRevenue.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-300">Recent (30d)</p>
                <p className="text-2xl font-bold text-white">{stats.recentEnrollments}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enrollments List */}
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Users className="h-5 w-5" />
            Student Enrollments
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {enrollments.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No Enrollments Yet</h3>
              <p className="text-gray-300">Students will appear here when they enroll in your classrooms.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {enrollments.map((enrollment) => (
                <div
                  key={enrollment.id}
                  className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-all duration-200"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
                        <h4 className="font-semibold text-white">
                          {enrollment.profiles.first_name} {enrollment.profiles.last_name}
                        </h4>
                        <Badge className={`${getStatusColor(enrollment.status)} w-fit`}>
                          {enrollment.status}
                        </Badge>
                      </div>
                      
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                        <div className="text-gray-300">
                          <span className="text-gray-400">Email:</span> {enrollment.profiles.email}
                        </div>
                        <div className="text-gray-300">
                          <span className="text-gray-400">Classroom:</span> {enrollment.classrooms.name}
                        </div>
                        <div className="text-gray-300">
                          <span className="text-gray-400">Subject:</span> {enrollment.classrooms.subject}
                        </div>
                        <div className="text-gray-300">
                          <span className="text-gray-400">Enrolled:</span> {new Date(enrollment.enrolled_at).toLocaleDateString()}
                        </div>
                        <div className="text-gray-300">
                          <span className="text-gray-400">Duration:</span> {enrollment.classrooms.duration_weeks} weeks
                        </div>
                        <div className="text-gray-300">
                          <span className="text-gray-400">Fee:</span> ₹{enrollment.classrooms.price}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-white/30 text-white hover:bg-white/10"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                    </div>
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

export default TeacherEnrollments;