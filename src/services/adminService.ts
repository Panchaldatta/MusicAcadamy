
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type AdminStats = Database['public']['Tables']['admin_stats']['Row'];
type AdminStatsInsert = Database['public']['Tables']['admin_stats']['Insert'];
type AdminStatsUpdate = Database['public']['Tables']['admin_stats']['Update'];

export class AdminService {
  static async getAdminStats(): Promise<AdminStats[]> {
    const { data, error } = await supabase
      .from('admin_stats')
      .select('*')
      .order('metric_category', { ascending: true });

    if (error) {
      console.error('Error fetching admin stats:', error);
      throw error;
    }

    return data || [];
  }

  static async updateAdminStat(metricName: string, value: number): Promise<AdminStats> {
    const { data, error } = await supabase
      .from('admin_stats')
      .update({ 
        metric_value: value,
        updated_at: new Date().toISOString()
      })
      .eq('metric_name', metricName)
      .select()
      .single();

    if (error) {
      console.error('Error updating admin stat:', error);
      throw error;
    }

    return data;
  }

  static async getDashboardMetrics() {
    try {
      // Get user counts
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('role');

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        throw profilesError;
      }

      const totalUsers = profiles?.length || 0;
      const totalTeachers = profiles?.filter(p => p.role === 'teacher').length || 0;
      const totalStudents = profiles?.filter(p => p.role === 'student').length || 0;

      // Get classroom counts
      const { data: classrooms, error: classroomsError } = await supabase
        .from('classrooms')
        .select('status');

      if (classroomsError) {
        console.error('Error fetching classrooms:', classroomsError);
        throw classroomsError;
      }

      const totalClassrooms = classrooms?.length || 0;
      const activeClassrooms = classrooms?.filter(c => c.status === 'active').length || 0;

      // Get swipe counts
      const { data: swipes, error: swipesError } = await supabase
        .from('classroom_swipes')
        .select('id');

      if (swipesError) {
        console.error('Error fetching swipes:', swipesError);
        throw swipesError;
      }

      const totalSwipes = swipes?.length || 0;

      // Get monthly signups
      const thisMonth = new Date();
      thisMonth.setDate(1);
      thisMonth.setHours(0, 0, 0, 0);

      const { data: monthlyUsers, error: monthlyError } = await supabase
        .from('profiles')
        .select('id')
        .gte('created_at', thisMonth.toISOString());

      const monthlySignups = monthlyUsers?.length || 0;

      return {
        totalUsers,
        totalTeachers,
        totalStudents,
        totalClassrooms,
        activeClassrooms,
        totalSwipes,
        monthlySignups
      };
    } catch (error) {
      console.error('Error in getDashboardMetrics:', error);
      return {
        totalUsers: 0,
        totalTeachers: 0,
        totalStudents: 0,
        totalClassrooms: 0,
        activeClassrooms: 0,
        totalSwipes: 0,
        monthlySignups: 0
      };
    }
  }
}
