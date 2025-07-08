
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SwipeView from "@/components/SwipeView";

const SwipeTeachersPage = () => {
  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gray-50 pt-20">
        <SwipeView />
      </div>
      <Footer />
    </>
  );
};

export default SwipeTeachersPage;
