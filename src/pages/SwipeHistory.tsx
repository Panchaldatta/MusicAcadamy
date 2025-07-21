
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SwipeHistory from "@/components/SwipeHistory";

const SwipeHistoryPage = () => {
  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-6 py-8">
          <SwipeHistory />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SwipeHistoryPage;
