import { supabase } from "@/integrations/supabase/client";

export interface PaymentSessionData {
  teacherId?: string;
  teacherName?: string;
  classroomId?: string;
  classroomName?: string;
  price: number;
  duration?: number;
  lessonDate?: string;
  notes?: string;
  type: 'lesson' | 'classroom';
}

export class StripeService {
  static async createLessonPayment(paymentData: PaymentSessionData) {
    const { data, error } = await supabase.functions.invoke('create-payment', {
      body: {
        teacherId: paymentData.teacherId,
        teacherName: paymentData.teacherName,
        price: paymentData.price,
        duration: paymentData.duration,
        lessonDate: paymentData.lessonDate,
        notes: paymentData.notes
      }
    });

    if (error) {
      console.error('Error creating lesson payment:', error);
      throw error;
    }

    return data;
  }

  static async createClassroomPayment(paymentData: PaymentSessionData) {
    // For now, redirect to a placeholder since we don't have classroom payment function yet
    const { data, error } = await supabase.functions.invoke('create-classroom-payment', {
      body: {
        classroomId: paymentData.classroomId,
        classroomName: paymentData.classroomName,
        price: paymentData.price,
        duration: paymentData.duration
      }
    });

    if (error) {
      console.error('Error creating classroom payment:', error);
      throw error;
    }

    return data;
  }

  static async verifyPayment(sessionId: string) {
    const { data, error } = await supabase.functions.invoke('verify-payment', {
      body: { sessionId }
    });

    if (error) {
      console.error('Error verifying payment:', error);
      throw error;
    }

    return data;
  }
}