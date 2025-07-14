
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SwipeableClassroomView from "@/components/SwipeableClassroomView";
import { useActiveClassrooms } from "@/hooks/useClassrooms";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Heart, Music, Users, Clock } from "lucide-react";

const BrowseClassrooms = () => {
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || "");
  const [selectedSubject, setSelectedSubject] = useState(searchParams.get('subject') || "all");
  const { toast } = useToast();
  
  const { data: classrooms = [], isLoading, error } = useActiveClassrooms();

  // Initialize search term from URL params
  useEffect(() => {
    const searchParam = searchParams.get('search');
    const subjectParam = searchParams.get('subject');
    
    if (searchParam) setSearchTerm(searchParam);
    if (subjectParam) setSelectedSubject(subjectParam);
    
    if (searchParam || subjectParam) {
      toast({
        title: "Search Applied",
        description: `Showing results for your search criteria`,
      });
    }
  }, [searchParams, toast]);

  if (error) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50 pt-20">
          <div className="container mx-auto px-6 py-8">
            <Card className="bg-red-50 border-red-200 max-w-md mx-auto">
              <CardContent className="p-6 text-center">
                <h2 className="text-xl font-semibold text-red-800 mb-2">Error Loading Classrooms</h2>
                <p className="text-red-600">There was an issue loading the classrooms. Please try again later.</p>
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50 pt-16">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-600/10 to-red-600/10" />
          <div className="relative container mx-auto px-6 py-12">
            <div className="text-center max-w-4xl mx-auto">
              <div className="flex justify-center mb-6">
                <div className="bg-gradient-to-r from-orange-500 to-red-500 p-4 rounded-2xl shadow-lg">
                  <Heart className="h-8 w-8 text-white" />
                </div>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-6">
                Discover Your Perfect Music Class
              </h1>
              
              <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-8">
                Swipe through handpicked Indian classical music classes. Like what you see? Swipe right to join amazing learning experiences.
              </p>

              {/* Stats */}
              <div className="flex justify-center gap-8 mb-8">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 text-2xl font-bold text-orange-600 mb-1">
                    <Music className="h-6 w-6" />
                    <span>{classrooms.length}</span>
                  </div>
                  <p className="text-gray-500 text-sm">Classes Available</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 text-2xl font-bold text-red-600 mb-1">
                    <Users className="h-6 w-6" />
                    <span>500+</span>
                  </div>
                  <p className="text-gray-500 text-sm">Active Students</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 text-2xl font-bold text-amber-600 mb-1">
                    <Clock className="h-6 w-6" />
                    <span>24/7</span>
                  </div>
                  <p className="text-gray-500 text-sm">Available</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-6 pb-16">
          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-orange-200 max-w-sm mx-auto">
                <div className="flex items-center justify-center mb-4">
                  <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
                </div>
                <p className="text-gray-600 text-center font-medium">Loading amazing classrooms...</p>
                <p className="text-gray-400 text-center text-sm mt-2">Get ready to discover your perfect match!</p>
              </div>
            </div>
          )}

          {/* Swipe View */}
          {!isLoading && (
            <div className="max-w-2xl mx-auto">
              <SwipeableClassroomView classrooms={classrooms} />
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BrowseClassrooms;
