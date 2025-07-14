
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SwipeableClassroomView from "@/components/SwipeableClassroomView";
import { useActiveClassrooms } from "@/hooks/useClassrooms";
import { Sparkles, Loader2 } from "lucide-react";

const BrowseClassrooms = () => {
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || "");
  const [selectedSubject, setSelectedSubject] = useState(searchParams.get('subject') || "all");
  const { toast } = useToast();
  
  const { data: classrooms = [], isLoading, error } = useActiveClassrooms();

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
        <div className="min-h-screen bg-background pt-20 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-6">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">😕</span>
            </div>
            <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
            <p className="text-muted-foreground">We couldn't load the classrooms. Please try refreshing the page.</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <div className="pt-20 pb-8">
          <div className="text-center px-6">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-2 rounded-full mb-6">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Find Your Perfect Class</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              Swipe to Discover
            </h1>
            <p className="text-muted-foreground text-lg max-w-md mx-auto">
              Swipe right to like, left to pass. Find your ideal music class in seconds.
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="pb-16 px-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground font-medium">Loading classes...</p>
            </div>
          ) : (
            <SwipeableClassroomView classrooms={classrooms} />
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BrowseClassrooms;
