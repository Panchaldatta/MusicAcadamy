
import { supabase } from '@/integrations/supabase/client';

export interface LessonBooking {
  id?: string;
  student_id: string;
  teacher_id: string;
  lesson_date: string;
  lesson_duration: number;
  price: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export class BookingService {
  static async createBooking(booking: Omit<LessonBooking, 'id' | 'created_at' | 'updated_at'>): Promise<LessonBooking> {
    const { data, error } = await supabase
      .from('lesson_bookings')
      .insert(booking)
      .select()
      .single();

    if (error) {
      console.error('Error creating booking:', error);
      throw error;
    }

    return data as LessonBooking;
  }

  static async getStudentBookings(studentId: string): Promise<LessonBooking[]> {
    const { data, error } = await supabase
      .from('lesson_bookings')
      .select('*')
      .eq('student_id', studentId)
      .order('lesson_date', { ascending: true });

    if (error) {
      console.error('Error fetching student bookings:', error);
      throw error;
    }

    return (data || []) as LessonBooking[];
  }

  static async updateBookingStatus(bookingId: string, status: LessonBooking['status']): Promise<void> {
    const { error } = await supabase
      .from('lesson_bookings')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', bookingId);

    if (error) {
      console.error('Error updating booking status:', error);
      throw error;
    }
  }

  static async cancelBooking(bookingId: string): Promise<void> {
    await this.updateBookingStatus(bookingId, 'cancelled');
  }
}
