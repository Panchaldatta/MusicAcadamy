
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, X, Star, MapPin, Clock, Award, User } from "lucide-react";
import { useSwipedTeachers } from "@/hooks/useUserSwipes";
import { useState } from "react";

const SwipeHistory = () => {
  const [filter, setFilter] = useState<'all' | 'left' | 'right'>('all');
  const { data: swipedTeachers, isLoading } = useSwipedTeachers(filter === 'all' ? undefined : filter);

  const filterCounts = {
    all: swipedTeachers?.length || 0,
    right: swipedTeachers?.filter(s => s.swipe_direction === 'right').length || 0,
    left: swipedTeachers?.filter(s => s.swipe_direction === 'left').length || 0,
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
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
          >
            <Heart className="h-4 w-4" />
            Liked ({filterCounts.right})
          </Button>
          <Button
            variant={filter === 'left' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('left')}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white"
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
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No swipes yet</h3>
          <p className="text-gray-600 mb-4">
            Start swiping on teachers to see your history here
          </p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {swipedTeachers.map((swipe) => (
            <Card key={swipe.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row">
                  {/* Teacher Image */}
                  <div className="relative w-full sm:w-48 h-48 sm:h-auto">
                    <img
                      src={swipe.teachers?.image_url || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face"}
                      alt={swipe.teachers?.name}
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
                      ₹{swipe.teachers?.price}/hr
                    </div>
                  </div>

                  {/* Teacher Info */}
                  <div className="flex-1 p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                          {swipe.teachers?.name}
                        </h3>
                        <p className="text-orange-600 font-semibold text-lg mb-2">
                          {swipe.teachers?.subject}
                        </p>
                      </div>
                      
                      {swipe.teachers?.verified && (
                        <Badge className="bg-emerald-100 text-emerald-700 mt-2 sm:mt-0">
                          Verified
                        </Badge>
                      )}
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-4 w-4 ${i < Math.floor(swipe.teachers?.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                        ))}
                      </div>
                      <span className="font-bold text-sm bg-gray-100 px-2 py-1 rounded-full">
                        {swipe.teachers?.rating}
                      </span>
                      <span className="text-gray-500 text-sm">
                        ({swipe.teachers?.reviews} reviews)
                      </span>
                    </div>

                    {/* Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4 text-blue-600" />
                        {swipe.teachers?.location}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="h-4 w-4 text-green-600" />
                        {swipe.teachers?.response_time}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Award className="h-4 w-4 text-purple-600" />
                        {swipe.teachers?.experience}
                      </div>
                    </div>

                    {/* Specialties */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {swipe.teachers?.specialties?.slice(0, 3).map((specialty, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                    </div>

                    {/* Swipe Date */}
                    <div className="text-xs text-gray-500">
                      Swiped on {new Date(swipe.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SwipeHistory;
