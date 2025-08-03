
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, X, Star, MapPin, Clock, Award, User } from "lucide-react";
import { useSwipedTeachers } from "@/hooks/useUserSwipes";
import { useState } from "react";

const SwipeHistory = () => {
  const [filter, setFilter] = useState<'all' | 'left' | 'right'>('all');
  const { data: swipedTeachers, isLoading, error } = useSwipedTeachers(filter === 'all' ? undefined : filter);

  console.log('SwipeHistory - swipedTeachers:', swipedTeachers);
  console.log('SwipeHistory - isLoading:', isLoading);
  console.log('SwipeHistory - error:', error);

  // Calculate filter counts from all data
  const { data: allSwipes } = useSwipedTeachers();
  const filterCounts = {
    all: allSwipes?.length || 0,
    right: allSwipes?.filter(s => s.swipe_direction === 'right').length || 0,
    left: allSwipes?.filter(s => s.swipe_direction === 'left').length || 0,
  };

  if (isLoading) {
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

  if (error) {
    console.error('Error loading swipe history:', error);
    return (
      <Card className="p-8 text-center">
        <div className="w-16 h-16 bg-red-200 rounded-full flex items-center justify-center mx-auto mb-4">
          <X className="h-8 w-8 text-red-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading History</h3>
        <p className="text-gray-600 mb-4">
          There was an error loading your swipe history. Please try again.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Your Swipe History</h2>
        
        <div className="flex gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
            className="flex items-center gap-2"
          >
            <User className="h-4 w-4" />
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

      {!swipedTeachers || swipedTeachers.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {filter === 'all' ? 'No swipes yet' : `No ${filter === 'right' ? 'liked' : 'passed'} teachers`}
          </h3>
          <p className="text-gray-600 mb-4">
            {filter === 'all' 
              ? 'Start swiping on teachers to see your history here'
              : `You haven't ${filter === 'right' ? 'liked' : 'passed'} any teachers yet`
            }
          </p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {swipedTeachers.map((swipe) => {
            const teacher = swipe.teachers;
            
            if (!teacher) {
              console.log('Missing teacher data for swipe:', swipe);
              return null;
            }

            return (
              <Card key={swipe.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="flex flex-col sm:flex-row">
                    {/* Teacher Image */}
                    <div className="relative w-full sm:w-48 h-48 sm:h-auto">
                      <img
                        src={teacher.image_url || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face"}
                        alt={teacher.name}
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
                        ₹{teacher.price}/hr
                      </div>
                    </div>

                    {/* Teacher Info */}
                    <div className="flex-1 p-6">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-1">
                            {teacher.name}
                          </h3>
                          <p className="text-orange-600 font-semibold text-lg mb-2">
                            {teacher.subject}
                          </p>
                        </div>
                        
                        {teacher.verified && (
                          <Badge className="bg-emerald-100 text-emerald-700 mt-2 sm:mt-0">
                            Verified
                          </Badge>
                        )}
                      </div>

                      {/* Rating */}
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`h-4 w-4 ${i < Math.floor(teacher.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                          ))}
                        </div>
                        <span className="font-bold text-sm bg-gray-100 px-2 py-1 rounded-full">
                          {teacher.rating}
                        </span>
                        <span className="text-gray-500 text-sm">
                          ({teacher.reviews} reviews)
                        </span>
                      </div>

                      {/* Details */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="h-4 w-4 text-blue-600" />
                          {teacher.location}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="h-4 w-4 text-green-600" />
                          {teacher.response_time}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Award className="h-4 w-4 text-purple-600" />
                          {teacher.experience}
                        </div>
                      </div>

                      {/* Specialties */}
                      {teacher.specialties && teacher.specialties.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {teacher.specialties.slice(0, 3).map((specialty, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {/* Action Buttons for Liked Teachers */}
                      {swipe.swipe_direction === 'right' && (
                        <div className="flex flex-col sm:flex-row gap-2 mb-4">
                          <Button 
                            size="sm"
                            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white flex-1"
                            onClick={() => {
                              // Create payment functionality
                              const paymentData = {
                                teacherId: teacher.id,
                                teacherName: teacher.name,
                                price: teacher.price,
                                subject: teacher.subject
                              };
                              
                              // Show payment confirmation
                              const confirmPayment = window.confirm(
                                `Book a lesson with ${teacher.name} for ₹${teacher.price}/hour?`
                              );
                              
                              if (confirmPayment) {
                                alert('Payment successful! Lesson booked. Check your email for details.');
                              }
                            }}
                          >
                            💳 Pay & Book Lesson
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="border-orange-200 text-orange-600 hover:bg-orange-50"
                          >
                            👤 View Profile
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
    </div>
  );
};

export default SwipeHistory;
