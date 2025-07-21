export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      admin_stats: {
        Row: {
          created_at: string
          id: string
          metric_category: string
          metric_name: string
          metric_value: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          metric_category: string
          metric_name: string
          metric_value?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          metric_category?: string
          metric_name?: string
          metric_value?: number
          updated_at?: string
        }
        Relationships: []
      }
      class_sessions: {
        Row: {
          classroom_id: string
          created_at: string
          end_time: string
          id: string
          location: string
          notes: string | null
          session_date: string
          start_time: string
          status: string
          student_count: number
          teacher_id: string
          updated_at: string
        }
        Insert: {
          classroom_id: string
          created_at?: string
          end_time: string
          id?: string
          location?: string
          notes?: string | null
          session_date: string
          start_time: string
          status?: string
          student_count?: number
          teacher_id: string
          updated_at?: string
        }
        Update: {
          classroom_id?: string
          created_at?: string
          end_time?: string
          id?: string
          location?: string
          notes?: string | null
          session_date?: string
          start_time?: string
          status?: string
          student_count?: number
          teacher_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "class_sessions_classroom_id_fkey"
            columns: ["classroom_id"]
            isOneToOne: false
            referencedRelation: "classrooms"
            referencedColumns: ["id"]
          },
        ]
      }
      classroom_enrollments: {
        Row: {
          classroom_id: string
          enrolled_at: string
          id: string
          status: string
          student_id: string
        }
        Insert: {
          classroom_id: string
          enrolled_at?: string
          id?: string
          status?: string
          student_id: string
        }
        Update: {
          classroom_id?: string
          enrolled_at?: string
          id?: string
          status?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "classroom_enrollments_classroom_id_fkey"
            columns: ["classroom_id"]
            isOneToOne: false
            referencedRelation: "classrooms"
            referencedColumns: ["id"]
          },
        ]
      }
      classroom_swipes: {
        Row: {
          classroom_id: string
          created_at: string
          id: string
          swipe_direction: string
          user_id: string
        }
        Insert: {
          classroom_id: string
          created_at?: string
          id?: string
          swipe_direction: string
          user_id: string
        }
        Update: {
          classroom_id?: string
          created_at?: string
          id?: string
          swipe_direction?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "classroom_swipes_classroom_id_fkey"
            columns: ["classroom_id"]
            isOneToOne: false
            referencedRelation: "classrooms"
            referencedColumns: ["id"]
          },
        ]
      }
      classrooms: {
        Row: {
          capacity: number
          created_at: string
          description: string | null
          duration_weeks: number | null
          id: string
          image_url: string | null
          level: string
          materials: string[] | null
          name: string
          prerequisites: string | null
          price: number
          schedule: string
          session_duration_minutes: number | null
          sessions_per_week: number | null
          status: string
          subject: string
          teacher_id: string
          updated_at: string
        }
        Insert: {
          capacity?: number
          created_at?: string
          description?: string | null
          duration_weeks?: number | null
          id?: string
          image_url?: string | null
          level: string
          materials?: string[] | null
          name: string
          prerequisites?: string | null
          price?: number
          schedule: string
          session_duration_minutes?: number | null
          sessions_per_week?: number | null
          status?: string
          subject: string
          teacher_id: string
          updated_at?: string
        }
        Update: {
          capacity?: number
          created_at?: string
          description?: string | null
          duration_weeks?: number | null
          id?: string
          image_url?: string | null
          level?: string
          materials?: string[] | null
          name?: string
          prerequisites?: string | null
          price?: number
          schedule?: string
          session_duration_minutes?: number | null
          sessions_per_week?: number | null
          status?: string
          subject?: string
          teacher_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      lesson_bookings: {
        Row: {
          created_at: string
          id: string
          lesson_date: string
          lesson_duration: number
          notes: string | null
          price: number
          status: string
          student_id: string
          teacher_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          lesson_date: string
          lesson_duration?: number
          notes?: string | null
          price: number
          status?: string
          student_id: string
          teacher_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          lesson_date?: string
          lesson_duration?: number
          notes?: string | null
          price?: number
          status?: string
          student_id?: string
          teacher_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lesson_bookings_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
        ]
      }
      music_subjects: {
        Row: {
          color: string
          created_at: string
          icon: string
          id: string
          name: string
          student_count: number
        }
        Insert: {
          color: string
          created_at?: string
          icon: string
          id?: string
          name: string
          student_count?: number
        }
        Update: {
          color?: string
          created_at?: string
          icon?: string
          id?: string
          name?: string
          student_count?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          availability: string | null
          avatar_url: string | null
          bio: string | null
          city: string | null
          country: string | null
          created_at: string
          date_of_birth: string | null
          email: string | null
          email_verified: boolean | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          emergency_contact_relationship: string | null
          first_name: string | null
          google_id: string | null
          id: string
          is_active: boolean | null
          last_name: string | null
          learning_goals: string | null
          music_experience_level: string | null
          phone: string | null
          preferred_instruments: string[] | null
          provider: string | null
          role: string | null
          state: string | null
          timezone: string | null
          updated_at: string
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          availability?: string | null
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          email_verified?: boolean | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          emergency_contact_relationship?: string | null
          first_name?: string | null
          google_id?: string | null
          id: string
          is_active?: boolean | null
          last_name?: string | null
          learning_goals?: string | null
          music_experience_level?: string | null
          phone?: string | null
          preferred_instruments?: string[] | null
          provider?: string | null
          role?: string | null
          state?: string | null
          timezone?: string | null
          updated_at?: string
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          availability?: string | null
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          email_verified?: boolean | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          emergency_contact_relationship?: string | null
          first_name?: string | null
          google_id?: string | null
          id?: string
          is_active?: boolean | null
          last_name?: string | null
          learning_goals?: string | null
          music_experience_level?: string | null
          phone?: string | null
          preferred_instruments?: string[] | null
          provider?: string | null
          role?: string | null
          state?: string | null
          timezone?: string | null
          updated_at?: string
          zip_code?: string | null
        }
        Relationships: []
      }
      site_stats: {
        Row: {
          created_at: string
          display_order: number
          id: string
          label: string
          updated_at: string
          value: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          id?: string
          label: string
          updated_at?: string
          value: string
        }
        Update: {
          created_at?: string
          display_order?: number
          id?: string
          label?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      student_achievements: {
        Row: {
          category: string | null
          created_at: string
          date_earned: string
          description: string | null
          id: string
          student_id: string
          title: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          date_earned: string
          description?: string | null
          id?: string
          student_id: string
          title: string
        }
        Update: {
          category?: string | null
          created_at?: string
          date_earned?: string
          description?: string | null
          id?: string
          student_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_achievements_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      student_preferences: {
        Row: {
          communication_preference: string | null
          created_at: string
          id: string
          lesson_duration_preference: number | null
          notification_settings: Json | null
          preferred_lesson_time: string | null
          privacy_settings: Json | null
          student_id: string
          updated_at: string
        }
        Insert: {
          communication_preference?: string | null
          created_at?: string
          id?: string
          lesson_duration_preference?: number | null
          notification_settings?: Json | null
          preferred_lesson_time?: string | null
          privacy_settings?: Json | null
          student_id: string
          updated_at?: string
        }
        Update: {
          communication_preference?: string | null
          created_at?: string
          id?: string
          lesson_duration_preference?: number | null
          notification_settings?: Json | null
          preferred_lesson_time?: string | null
          privacy_settings?: Json | null
          student_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_preferences_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      teachers: {
        Row: {
          created_at: string
          experience: string
          id: string
          image_url: string | null
          languages: string[]
          location: string
          name: string
          price: number
          rating: number
          response_time: string
          reviews: number
          specialties: string[]
          subject: string
          updated_at: string
          verified: boolean | null
        }
        Insert: {
          created_at?: string
          experience: string
          id?: string
          image_url?: string | null
          languages?: string[]
          location: string
          name: string
          price: number
          rating?: number
          response_time?: string
          reviews?: number
          specialties?: string[]
          subject: string
          updated_at?: string
          verified?: boolean | null
        }
        Update: {
          created_at?: string
          experience?: string
          id?: string
          image_url?: string | null
          languages?: string[]
          location?: string
          name?: string
          price?: number
          rating?: number
          response_time?: string
          reviews?: number
          specialties?: string[]
          subject?: string
          updated_at?: string
          verified?: boolean | null
        }
        Relationships: []
      }
      user_swipes: {
        Row: {
          created_at: string
          id: string
          swipe_direction: string
          teacher_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          swipe_direction: string
          teacher_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          swipe_direction?: string
          teacher_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_swipes_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { user_id?: string }
        Returns: string
      }
      is_student: {
        Args: { user_id?: string }
        Returns: boolean
      }
      is_teacher: {
        Args: { user_id?: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
