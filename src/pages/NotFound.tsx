
import { Button } from "@/components/ui/button";
import { Music, Home, ArrowLeft, Search, BookOpen, Users, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";

const NotFound = () => {
  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 flex items-center justify-center pt-20">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-32 h-32 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-8">
              <Music className="h-16 w-16 text-white" />
            </div>
            
            <h1 className="text-8xl font-bold text-gray-900 mb-4">404</h1>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Page Not Found</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-lg mx-auto">
              Oops! The page you're looking for seems to have wandered off like a melody in the wind. 
              Let's get you back to making beautiful music!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link to="/">
                <Button size="lg" className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white">
                  <Home className="mr-2 h-5 w-5" />
                  Go Home
                </Button>
              </Link>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-orange-600 text-orange-600 hover:bg-orange-50"
                onClick={() => window.history.back()}
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                Go Back
              </Button>
            </div>

            <div className="p-6 bg-white/50 backdrop-blur-sm rounded-lg border border-orange-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Pages</h3>
              <div className="grid grid-cols-2 gap-4">
                <Link to="/browse-classrooms" className="flex items-center text-orange-600 hover:text-orange-700 hover:underline">
                  <Users className="mr-2 h-4 w-4" />
                  Browse Teachers
                </Link>
                <Link to="/about" className="flex items-center text-orange-600 hover:text-orange-700 hover:underline">
                  <Music className="mr-2 h-4 w-4" />
                  About Us
                </Link>
                <Link to="/contact" className="flex items-center text-orange-600 hover:text-orange-700 hover:underline">
                  <Phone className="mr-2 h-4 w-4" />
                  Contact
                </Link>
                <Link to="/courses" className="flex items-center text-orange-600 hover:text-orange-700 hover:underline">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Courses
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFound;
