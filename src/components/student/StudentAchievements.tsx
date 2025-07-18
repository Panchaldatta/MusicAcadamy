
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Trophy, Plus, CalendarIcon, Music, Award, Star, Zap, Target, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const achievementSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  date_earned: z.date(),
  category: z.string().default('general'),
});

type AchievementFormData = z.infer<typeof achievementSchema>;

interface Achievement {
  id: string;
  title: string;
  description: string | null;
  date_earned: string;
  category: string;
  created_at: string;
}

const categoryIcons = {
  general: Trophy,
  performance: Music,
  practice: Target,
  theory: Award,
  technique: Star,
  milestone: Zap,
};

const categoryColors = {
  general: 'bg-blue-100 text-blue-800',
  performance: 'bg-purple-100 text-purple-800',
  practice: 'bg-green-100 text-green-800',
  theory: 'bg-yellow-100 text-yellow-800',
  technique: 'bg-red-100 text-red-800',
  milestone: 'bg-orange-100 text-orange-800',
};

const StudentAchievements = () => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AchievementFormData>({
    resolver: zodResolver(achievementSchema),
    defaultValues: {
      title: '',
      description: '',
      date_earned: new Date(),
      category: 'general',
    },
  });

  const fetchAchievements = async () => {
    if (!profile?.id) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('student_achievements')
        .select('*')
        .eq('student_id', profile.id)
        .order('date_earned', { ascending: false });

      if (error) throw error;
      setAchievements(data || []);
    } catch (error) {
      console.error('Error fetching achievements:', error);
      toast({
        title: "Error",
        description: "Failed to load achievements. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAchievements();
  }, [profile?.id]);

  const onSubmit = async (data: AchievementFormData) => {
    if (!profile?.id) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('student_achievements')
        .insert({
          student_id: profile.id,
          title: data.title,
          description: data.description || null,
          date_earned: format(data.date_earned, 'yyyy-MM-dd'),
          category: data.category,
        });

      if (error) throw error;

      toast({
        title: "Achievement added",
        description: "Your achievement has been successfully recorded.",
      });

      form.reset();
      setIsDialogOpen(false);
      fetchAchievements();
    } catch (error) {
      console.error('Error adding achievement:', error);
      toast({
        title: "Error",
        description: "Failed to add achievement. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Achievements</h2>
          <p className="text-muted-foreground">Track your musical accomplishments and milestones</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Achievement
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Achievement</DialogTitle>
              <DialogDescription>
                Record a new musical achievement or milestone you've reached.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Achievement Title</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g., Completed first recital" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="general">General</SelectItem>
                          <SelectItem value="performance">Performance</SelectItem>
                          <SelectItem value="practice">Practice</SelectItem>
                          <SelectItem value="theory">Theory</SelectItem>
                          <SelectItem value="technique">Technique</SelectItem>
                          <SelectItem value="milestone">Milestone</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="date_earned"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date Achieved</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date > new Date()}
                            initialFocus
                            className="p-3 pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          placeholder="Describe this achievement in more detail..."
                          rows={3}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Add Achievement
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : achievements.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Trophy className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No Achievements Yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Start tracking your musical accomplishments and milestones!
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Achievement
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {achievements.map((achievement) => {
            const IconComponent = categoryIcons[achievement.category as keyof typeof categoryIcons] || Trophy;
            const colorClass = categoryColors[achievement.category as keyof typeof categoryColors] || categoryColors.general;
            
            return (
              <Card key={achievement.id} className="transition-all hover:shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full flex-shrink-0">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground mb-1">
                            {achievement.title}
                          </h3>
                          {achievement.description && (
                            <p className="text-muted-foreground text-sm mb-2">
                              {achievement.description}
                            </p>
                          )}
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className={colorClass}>
                              {achievement.category}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {format(new Date(achievement.date_earned), 'MMM d, yyyy')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StudentAchievements;
