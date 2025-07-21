
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ClassroomSwipeHistory from "@/components/ClassroomSwipeHistory";

const ClassroomSwipeHistoryPage = () => {
  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-6 py-8">
          <ClassroomSwipeHistory />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ClassroomSwipeHistoryPage;
