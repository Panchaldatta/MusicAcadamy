
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, X, Star, Users, Clock, BookOpen, DollarSign } from "lucide-react";
import { useState, useEffect } from "react";
import { ClassroomService } from "@/services/classroomService";
import { useToast } from "@/hooks/use-toast";
import ClassroomPaymentDialog from "@/components/ClassroomPaymentDialog";
import type { Database } from "@/integrations/supabase/types";

type ClassroomSwipe = Database['public']['Tables']['classroom_swipes']['Row'] & {
  classrooms: Database['public']['Tables']['classrooms']['Row'] | null;
};

const ClassroomSwipeHistory = () => {
  const [filter, setFilter] = useState<'all' | 'left' | 'right'>('all');
  const [swipes, setSwipes] = useState<ClassroomSwipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClassroom, setSelectedClassroom] = useState<Database['public']['Tables']['classrooms']['Row'] | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadSwipeHistory();
  }, []);

  const loadSwipeHistory = async () => {
    try {
      setLoading(true);
      const swipeData = await ClassroomService.getUserSwipes();
      setSwipes(swipeData as ClassroomSwipe[]);
    } catch (error) {
      console.error('Error loading swipe history:', error);
      toast({
        title: "Error",
        description: "Failed to load swipe history",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredSwipes = filter === 'all' 
    ? swipes 
    : swipes.filter(swipe => swipe.swipe_direction === filter);

  const filterCounts = {
    all: swipes.length,
    right: swipes.filter(s => s.swipe_direction === 'right').length,
    left: swipes.filter(s => s.swipe_direction === 'left').length,
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 rounded-lg h-32"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Classroom Swipe History</h2>
        
        <div className="flex gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
            className="flex items-center gap-2"
          >
            <BookOpen className="h-4 w-4" />
            All ({filterCounts.all})
          </Button>
          <Button
            variant={filter === 'right' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('right')}
            className={`flex items-center gap-2 ${filter === 'right' ? 'bg-green-600 hover:bg-green-700 text-white' : 'text-green-600 hover:bg-green-50'}`}
          >
            <Heart className="h-4 w-4" />
            Liked ({filterCounts.right})
          </Button>
          <Button
            variant={filter === 'left' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('left')}
            className={`flex items-center gap-2 ${filter === 'left' ? 'bg-red-600 hover:bg-red-700 text-white' : 'text-red-600 hover:bg-red-50'}`}
          >
            <X className="h-4 w-4" />
            Passed ({filterCounts.left})
          </Button>
        </div>
      </div>

      {filteredSwipes.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {filter === 'all' ? 'No swipes yet' : `No ${filter === 'right' ? 'liked' : 'passed'} classrooms`}
          </h3>
          <p className="text-gray-600 mb-4">
            {filter === 'all' 
              ? 'Start swiping on classrooms to see your history here'
              : `You haven't ${filter === 'right' ? 'liked' : 'passed'} any classrooms yet`
            }
          </p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredSwipes.map((swipe) => {
            const classroom = swipe.classrooms;
            
            if (!classroom) {
              return null;
            }

            return (
              <Card key={swipe.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="flex flex-col sm:flex-row">
                    {/* Classroom Image */}
                    <div className="relative w-full sm:w-48 h-48 sm:h-auto">
                      <img
                        src={classroom.image_url || "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop"}
                        alt={classroom.name}
                        className="w-full h-full object-cover"
                      />
                      
                      {/* Swipe Direction Badge */}
                      <div className="absolute top-3 right-3">
                        {swipe.swipe_direction === 'right' ? (
                          <Badge className="bg-green-500 text-white flex items-center gap-1">
                            <Heart className="h-3 w-3" />
                            Liked
                          </Badge>
                        ) : (
                          <Badge className="bg-red-500 text-white flex items-center gap-1">
                            <X className="h-3 w-3" />
                            Passed
                          </Badge>
                        )}
                      </div>

                      {/* Price */}
                      <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-orange-600 px-2 py-1 rounded-full text-sm font-bold">
                        ₹{classroom.price}
                      </div>
                    </div>

                    {/* Classroom Info */}
                    <div className="flex-1 p-6">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-1">
                            {classroom.name}
                          </h3>
                          <p className="text-orange-600 font-semibold text-lg mb-2">
                            {classroom.subject}
                          </p>
                        </div>
                        
                        <Badge className="bg-blue-100 text-blue-700 mt-2 sm:mt-0">
                          {classroom.level}
                        </Badge>
                      </div>

                      {/* Description */}
                      {classroom.description && (
                        <p className="text-gray-600 mb-4 line-clamp-2">
                          {classroom.description}
                        </p>
                      )}

                      {/* Details */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Users className="h-4 w-4 text-blue-600" />
                          {classroom.capacity} students
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="h-4 w-4 text-green-600" />
                          {classroom.duration_weeks} weeks
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <BookOpen className="h-4 w-4 text-purple-600" />
                          {classroom.sessions_per_week}x/week
                        </div>
                      </div>

                      {/* Schedule */}
                      <div className="mb-4">
                        <Badge variant="outline" className="text-xs">
                          {classroom.schedule}
                        </Badge>
                      </div>

                      {/* Action Buttons for Liked Classrooms */}
                      {swipe.swipe_direction === 'right' && (
                        <div className="flex flex-col sm:flex-row gap-2 mb-4">
                          <Button 
                            size="sm"
                            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white flex-1"
                            onClick={() => setSelectedClassroom(classroom)}
                          >
                            💳 Enroll Now (₹{classroom.price})
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="border-green-200 text-green-600 hover:bg-green-50"
                          >
                            📋 View Details
                          </Button>
                        </div>
                      )}

                      {/* Swipe Date */}
                      <div className="text-xs text-gray-500">
                        Swiped on {new Date(swipe.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Payment Dialog */}
      {selectedClassroom && (
        <ClassroomPaymentDialog
          classroom={selectedClassroom}
          isOpen={!!selectedClassroom}
          onClose={() => setSelectedClassroom(null)}
          onPaymentComplete={() => {
            toast({
              title: "Payment Initiated 🚀",
              description: "Please complete your payment to confirm enrollment.",
            });
          }}
        />
      )}
    </div>
  );
};

export default ClassroomSwipeHistory;
