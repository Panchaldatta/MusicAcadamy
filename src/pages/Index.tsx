
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import InfiniteSlider from "@/components/InfiniteSlider";
import MusicStats from "@/components/MusicStats";
import FeaturesSection from "@/components/FeaturesSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import CTASection from "@/components/CTASection";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <HeroSection />
      <InfiniteSlider />
      <MusicStats />
      <FeaturesSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
