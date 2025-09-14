import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface AnalyticsData {
  monthlyData: Array<{
    month: string;
    students: number;
    revenue: number;
  }>;
  subjectData: Array<{
    name: string;
    students: number;
    color: string;
  }>;
  totalStudents: number;
  totalRevenue: number;
  averageRating: number;
  revenueGrowth: string;
  studentGrowth: string;
  ratingChange: string;
}

const SUBJECT_COLORS = {
  piano: '#8B5CF6',
  guitar: '#10B981', 
  vocals: '#F59E0B',
  violin: '#EF4444',
  drums: '#3B82F6',
  saxophone: '#F97316',
  flute: '#8B5A2B',
  cello: '#6366F1',
  trumpet: '#EC4899',
  default: '#6B7280'
};

export const useTeacherAnalytics = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['teacher-analytics', user?.id],
    queryFn: async (): Promise<AnalyticsData> => {
      if (!user?.id) throw new Error('User not authenticated');

      // Get teacher's classrooms
      const { data: classrooms, error: classroomsError } = await supabase
        .from('classrooms')
        .select('id, subject, price, sessions_per_week')
        .eq('teacher_id', user.id);

      if (classroomsError) throw classroomsError;

      const classroomIds = classrooms?.map(c => c.id) || [];

      if (classroomIds.length === 0) {
        return {
          monthlyData: [],
          subjectData: [],
          totalStudents: 0,
          totalRevenue: 0,
          averageRating: 0,
          revenueGrowth: '0%',
          studentGrowth: '0%',
          ratingChange: '0'
        };
      }

      // Get enrollments for analytics
      const { data: enrollments, error: enrollmentsError } = await supabase
        .from('classroom_enrollments')
        .select(`
          enrolled_at,
          classroom_id,
          classrooms!inner (
            subject,
            price,
            sessions_per_week
          )
        `)
        .in('classroom_id', classroomIds);

      if (enrollmentsError) throw enrollmentsError;

      // Calculate monthly data for the last 6 months
      const monthlyData = [];
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      
      for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthName = monthNames[date.getMonth()];
        const year = date.getFullYear();
        const monthStart = new Date(year, date.getMonth(), 1);
        const monthEnd = new Date(year, date.getMonth() + 1, 0);

        const monthEnrollments = enrollments?.filter(e => {
          const enrolledDate = new Date(e.enrolled_at);
          return enrolledDate >= monthStart && enrolledDate <= monthEnd;
        }) || [];

        const students = monthEnrollments.length;
        const revenue = monthEnrollments.reduce((sum, e) => {
          const classroom = e.classrooms;
          const sessionsPerWeek = classroom?.sessions_per_week || 2;
          const monthlyRevenue = (classroom?.price || 0) * sessionsPerWeek * 4;
          return sum + monthlyRevenue;
        }, 0);

        monthlyData.push({
          month: monthName,
          students,
          revenue
        });
      }

      // Calculate subject distribution
      const subjectCounts: Record<string, number> = {};
      enrollments?.forEach(e => {
        const subject = e.classrooms?.subject?.toLowerCase() || 'other';
        subjectCounts[subject] = (subjectCounts[subject] || 0) + 1;
      });

      const subjectData = Object.entries(subjectCounts).map(([subject, count]) => ({
        name: subject.charAt(0).toUpperCase() + subject.slice(1),
        students: count,
        color: SUBJECT_COLORS[subject as keyof typeof SUBJECT_COLORS] || SUBJECT_COLORS.default
      }));

      // Calculate totals and growth
      const totalStudents = enrollments?.length || 0;
      const totalRevenue = enrollments?.reduce((sum, e) => {
        const classroom = e.classrooms;
        const sessionsPerWeek = classroom?.sessions_per_week || 2;
        const monthlyRevenue = (classroom?.price || 0) * sessionsPerWeek * 4;
        return sum + monthlyRevenue;
      }, 0) || 0;

      // Calculate growth rates (comparing last 2 months)
      const currentMonth = monthlyData[monthlyData.length - 1];
      const previousMonth = monthlyData[monthlyData.length - 2];
      
      const studentGrowthRate = previousMonth?.students > 0 
        ? ((currentMonth?.students - previousMonth?.students) / previousMonth?.students * 100).toFixed(0)
        : '0';
      const revenueGrowthRate = previousMonth?.revenue > 0
        ? ((currentMonth?.revenue - previousMonth?.revenue) / previousMonth?.revenue * 100).toFixed(0)
        : '0';

      return {
        monthlyData,
        subjectData,
        totalStudents,
        totalRevenue,
        averageRating: 4.8, // TODO: Implement real rating system
        revenueGrowth: `${revenueGrowthRate}%`,
        studentGrowth: `${studentGrowthRate}%`,
        ratingChange: '0' // TODO: Implement real rating changes
      };
    },
    enabled: !!user?.id
  });
};