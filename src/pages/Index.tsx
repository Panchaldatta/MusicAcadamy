
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import InfiniteSlider from "@/components/InfiniteSlider";
import MusicStats from "@/components/MusicStats";
import FeaturesSection from "@/components/FeaturesSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import CTASection from "@/components/CTASection";
import TeacherSwipeCards from "@/components/TeacherSwipeCards";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <HeroSection />
      <InfiniteSlider />
      <MusicStats />
      <FeaturesSection />
      
      {/* Teacher Swipe Section */}
      <div className="py-20 bg-gradient-to-br from-gray-50 to-orange-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Find Your Perfect Teacher
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Swipe through our verified music teachers and find the one that matches your learning style.
            </p>
          </div>
          <TeacherSwipeCards />
        </div>
      </div>
      
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
