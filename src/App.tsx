
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import LenisProvider from "@/components/providers/LenisProvider";
import Index from "./pages/Index";
import About from "./pages/About";
import Contact from "./pages/Contact";
import BrowseTeachers from "./pages/BrowseTeachers";
import BrowseClassrooms from "./pages/BrowseClassrooms";
import TeacherDashboard from "./pages/TeacherDashboard";
import TeacherDashboardAdmin from "./pages/TeacherDashboardAdmin";
import StudentDashboard from "./pages/StudentDashboard";
import ClassroomSwipeHistoryPage from "./pages/ClassroomSwipeHistoryPage";
import SwipeHistoryPage from "./pages/SwipeHistory";
import Auth from "./pages/Auth";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

// Create QueryClient instance outside the component to avoid React context issues
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <TooltipProvider>
            <LenisProvider>
              <Toaster />
              <Sonner />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/browse-teachers" element={<BrowseTeachers />} />
                <Route path="/browse-classrooms" element={<BrowseClassrooms />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/swipe-history" element={<SwipeHistoryPage />} />
                <Route path="/classroom-swipe-history" element={<ClassroomSwipeHistoryPage />} />
                <Route
                  path="/teacher-dashboard"
                  element={
                    <ProtectedRoute requireRole="teacher">
                      <TeacherDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/student-dashboard"
                  element={
                    <ProtectedRoute requireRole="student">
                      <StudentDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin-dashboard"
                  element={
                    <ProtectedRoute requireRole="admin">
                      <TeacherDashboardAdmin />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </LenisProvider>
          </TooltipProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
