
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import BrowseClassrooms from "./pages/BrowseClassrooms";
import BrowseTeachers from "./pages/BrowseTeachers";
import TeacherDashboard from "./pages/TeacherDashboard";
import SwipeHistoryPage from "./pages/SwipeHistory";
import SwipeTeachersPage from "./pages/SwipeTeachers";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/browse-classrooms" element={<BrowseClassrooms />} />
          <Route path="/browse-teachers" element={<BrowseTeachers />} />
          <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
          <Route path="/swipe-teachers" element={<SwipeTeachersPage />} />
          <Route path="/swipe-history" element={<SwipeHistoryPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
