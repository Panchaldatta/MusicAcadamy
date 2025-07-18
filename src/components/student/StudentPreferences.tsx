
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { Loader2, Settings, Bell, Shield, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const preferencesSchema = z.object({
  lesson_duration_preference: z.number().min(15).max(180).default(60),
  preferred_lesson_time: z.string().optional(),
  communication_preference: z.enum(['email', 'phone', 'text']).default('email'),
  email_notifications: z.boolean().default(true),
  sms_notifications: z.boolean().default(false),
  push_notifications: z.boolean().default(true),
  profile_visible: z.boolean().default(true),
  contact_visible: z.boolean().default(false),
});

type PreferencesFormData = z.infer<typeof preferencesSchema>;

interface StudentPreference {
  id: string;
  lesson_duration_preference: number;
  preferred_lesson_time: string | null;
  communication_preference: string;
  notification_settings: any;
  privacy_settings: any;
}

const StudentPreferences = () => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preferences, setPreferences] = useState<StudentPreference | null>(null);

  const form = useForm<PreferencesFormData>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: {
      lesson_duration_preference: 60,
      preferred_lesson_time: '',
      communication_preference: 'email',
      email_notifications: true,
      sms_notifications: false,
      push_notifications: true,
      profile_visible: true,
      contact_visible: false,
    },
  });

  const fetchPreferences = async () => {
    if (!profile?.id) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('student_preferences')
        .select('*')
        .eq('student_id', profile.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setPreferences(data);
        const notificationSettings = data.notification_settings || {};
        const privacySettings = data.privacy_settings || {};

        // Safely access properties with proper type checking
        const emailNotifications = typeof notificationSettings === 'object' && notificationSettings !== null && 'email' in notificationSettings 
          ? Boolean(notificationSettings.email) : true;
        const smsNotifications = typeof notificationSettings === 'object' && notificationSettings !== null && 'sms' in notificationSettings 
          ? Boolean(notificationSettings.sms) : false;
        const pushNotifications = typeof notificationSettings === 'object' && notificationSettings !== null && 'push' in notificationSettings 
          ? Boolean(notificationSettings.push) : true;
        const profileVisible = typeof privacySettings === 'object' && privacySettings !== null && 'profile_visible' in privacySettings 
          ? Boolean(privacySettings.profile_visible) : true;
        const contactVisible = typeof privacySettings === 'object' && privacySettings !== null && 'contact_visible' in privacySettings 
          ? Boolean(privacySettings.contact_visible) : false;

        form.reset({
          lesson_duration_preference: data.lesson_duration_preference || 60,
          preferred_lesson_time: data.preferred_lesson_time || '',
          communication_preference: data.communication_preference as 'email' | 'phone' | 'text' || 'email',
          email_notifications: emailNotifications,
          sms_notifications: smsNotifications,
          push_notifications: pushNotifications,
          profile_visible: profileVisible,
          contact_visible: contactVisible,
        });
      }
    } catch (error) {
      console.error('Error fetching preferences:', error);
      toast({
        title: "Error",
        description: "Failed to load preferences. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPreferences();
  }, [profile?.id]);

  const onSubmit = async (data: PreferencesFormData) => {
    if (!profile?.id) return;

    setIsSubmitting(true);
    try {
      const updateData = {
        student_id: profile.id,
        lesson_duration_preference: data.lesson_duration_preference,
        preferred_lesson_time: data.preferred_lesson_time || null,
        communication_preference: data.communication_preference,
        notification_settings: {
          email: data.email_notifications,
          sms: data.sms_notifications,
          push: data.push_notifications,
        },
        privacy_settings: {
          profile_visible: data.profile_visible,
          contact_visible: data.contact_visible,
        },
      };

      if (preferences) {
        // Update existing preferences
        const { error } = await supabase
          .from('student_preferences')
          .update(updateData)
          .eq('student_id', profile.id);

        if (error) throw error;
      } else {
        // Create new preferences
        const { error } = await supabase
          .from('student_preferences')
          .insert(updateData);

        if (error) throw error;
      }

      toast({
        title: "Preferences updated",
        description: "Your preferences have been successfully saved.",
      });

      fetchPreferences(); // Refresh data
    } catch (error) {
      console.error('Error updating preferences:', error);
      toast({
        title: "Update failed",
        description: "There was an error updating your preferences. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Preferences</h2>
        <p className="text-muted-foreground">Customize your learning experience and communication settings</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Learning Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Learning Preferences
              </CardTitle>
              <CardDescription>
                Set your preferred lesson settings and schedule
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="lesson_duration_preference"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preferred Lesson Duration (minutes)</FormLabel>
                    <Select 
                      onValueChange={(value) => field.onChange(parseInt(value))} 
                      defaultValue={field.value.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="45">45 minutes</SelectItem>
                        <SelectItem value="60">60 minutes</SelectItem>
                        <SelectItem value="90">90 minutes</SelectItem>
                        <SelectItem value="120">120 minutes</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="preferred_lesson_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preferred Time of Day</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select preferred time" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="morning">Morning (6:00 AM - 12:00 PM)</SelectItem>
                        <SelectItem value="afternoon">Afternoon (12:00 PM - 6:00 PM)</SelectItem>
                        <SelectItem value="evening">Evening (6:00 PM - 10:00 PM)</SelectItem>
                        <SelectItem value="flexible">Flexible</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Communication Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Communication Preferences
              </CardTitle>
              <CardDescription>
                Choose how you'd like to be contacted by teachers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="communication_preference"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preferred Communication Method</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="phone">Phone Call</SelectItem>
                        <SelectItem value="text">Text Message</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
              <CardDescription>
                Manage how you receive updates and reminders
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="email_notifications"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Email Notifications</FormLabel>
                      <FormDescription>
                        Receive lesson reminders and updates via email
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sms_notifications"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">SMS Notifications</FormLabel>
                      <FormDescription>
                        Get text message reminders for upcoming lessons
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="push_notifications"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Push Notifications</FormLabel>
                      <FormDescription>
                        Receive instant notifications in your browser
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Privacy Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Privacy Settings
              </CardTitle>
              <CardDescription>
                Control what information is visible to others
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="profile_visible"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Profile Visibility</FormLabel>
                      <FormDescription>
                        Allow teachers to view your profile information
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contact_visible"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Contact Information Visibility</FormLabel>
                      <FormDescription>
                        Show your contact details to teachers you're connected with
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Preferences
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default StudentPreferences;
