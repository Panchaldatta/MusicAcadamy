
import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

const queryClient = new QueryClient();

// Lazy load pages for better performance
const Index = lazy(() => import("./pages/Index"));
const Auth = lazy(() => import("./pages/Auth"));
const TeacherDashboard = lazy(() => import("./pages/TeacherDashboard"));
const BrowseTeachers = lazy(() => import("./pages/BrowseTeachers"));
const BrowseClassrooms = lazy(() => import("./pages/BrowseClassrooms"));
const SwipeHistoryPage = lazy(() => import("./pages/SwipeHistory"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Loading component
const PageLoader = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-400"></div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Router>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              
              {/* Legacy login/signup routes - redirect to /auth */}
              <Route path="/login" element={<Auth />} />
              <Route path="/signup" element={<Auth />} />
              
              {/* Protected routes for authenticated users */}
              <Route path="/browse-teachers" element={
                <ProtectedRoute>
                  <BrowseTeachers />
                </ProtectedRoute>
              } />
              <Route path="/browse-classrooms" element={
                <ProtectedRoute>
                  <BrowseClassrooms />
                </ProtectedRoute>
              } />
              <Route path="/swipe-history" element={
                <ProtectedRoute>
                  <SwipeHistoryPage />
                </ProtectedRoute>
              } />
              
              {/* Teacher-only routes */}
              <Route path="/teacher-dashboard" element={
                <ProtectedRoute requireRole="teacher">
                  <TeacherDashboard />
                </ProtectedRoute>
              } />
              
              {/* 404 page */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </Router>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
