
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Settings, Award, BookOpen } from "lucide-react";
import Navigation from "@/components/Navigation";
import ClassroomCard from "@/components/ClassroomCard";
import CreateClassroomDialog from "@/components/CreateClassroomDialog";
import TeacherAnalytics from "@/components/TeacherAnalytics";
import UpcomingClasses from "@/components/UpcomingClasses";
import Footer from "@/components/Footer";
import TeacherSettingsTab from "@/components/TeacherSettingsTab";
import DashboardStats from "@/components/DashboardStats";
import DashboardTabs from "@/components/DashboardTabs";
import ClassScheduleManager from "@/components/ClassScheduleManager";
import TeacherEnrollments from "@/components/TeacherEnrollments";
import { useTeacherClassrooms, useDeleteClassroom, useUpdateClassroom } from "@/hooks/useClassrooms";
import { useTeacherAnalytics } from "@/hooks/useTeacherAnalytics";
import { useToast } from "@/hooks/use-toast";

const TeacherDashboard = () => {
  const { data: classrooms = [], isLoading, error } = useTeacherClassrooms();
  const { data: analytics } = useTeacherAnalytics();
  const deleteClassroom = useDeleteClassroom();
  const updateClassroom = useUpdateClassroom();
  const { toast } = useToast();
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const handleDeleteClassroom = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this classroom? This action cannot be undone.")) {
      try {
        await deleteClassroom.mutateAsync(id);
        toast({
          title: "Success",
          description: "Classroom deleted successfully!",
        });
      } catch (error) {
        console.error('Failed to delete classroom:', error);
        toast({
          title: "Error",
          description: "Failed to delete classroom. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleEditClassroom = async (classroom: any) => {
    // Simple example - toggle classroom status
    const newStatus = classroom.status === 'active' ? 'inactive' : 'active';
    
    try {
      await updateClassroom.mutateAsync({
        id: classroom.id,
        updates: { status: newStatus }
      });
      
      toast({
        title: "Classroom Updated",
        description: `"${classroom.name}" status changed to ${newStatus}.`,
      });
    } catch (error) {
      console.error('Failed to update classroom:', error);
      toast({
        title: "Error",
        description: "Failed to update classroom. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleViewAnalytics = (id: string) => {
    const classroom = classrooms.find(c => c.id === id);
    if (classroom) {
      // Switch to analytics tab and show classroom-specific data
      setActiveTab("analytics");
      toast({
        title: "Analytics View",
        description: `Now viewing analytics for "${classroom.name}".`,
      });
    }
  };

  // Use real analytics data
  const totalStudents = analytics?.totalStudents || 0;
  const totalRevenue = analytics?.totalRevenue || 0;
  const averageRating = analytics?.averageRating || 0;

  if (error) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center pt-16">
          <Card className="bg-white/10 backdrop-blur-md border-white/20 max-w-md hover:bg-white/15 transition-all duration-300">
            <CardContent className="p-6 text-center">
              <h2 className="text-xl font-semibold text-white mb-2">Error Loading Dashboard</h2>
              <p className="text-gray-300 mb-4">Please make sure you're logged in to access your teacher dashboard.</p>
              <Button 
                onClick={() => window.location.reload()} 
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-200"
              >
                Reload Page
              </Button>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-16">
        <div className="container mx-auto px-6 py-8">
          {/* Enhanced Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
            <div className="animate-fade-in-left">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg hover:scale-110 transition-transform duration-200">
                  <Award className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-4xl font-bold text-white">Teacher Dashboard</h1>
              </div>
              <p className="text-gray-300 text-lg">Welcome back! Manage your classrooms and track your teaching success</p>
            </div>
            <div className="flex gap-3 animate-fade-in-right">
              <Button 
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 hover:border-white/50 hover:shadow-lg hover:shadow-white/10 transition-all duration-200"
                onClick={() => setActiveTab("settings")}
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button 
                onClick={() => setIsCreateDialogOpen(true)}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-200"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Classroom
              </Button>
            </div>
          </div>

          {/* Enhanced Stats Cards */}
          <div className="animate-fade-in-up">
            <DashboardStats 
              totalStudents={totalStudents}
              totalClassrooms={classrooms.length}
              totalRevenue={totalRevenue}
              averageRating={averageRating}
            />
          </div>

          {/* Navigation Tabs */}
          <div className="animate-fade-in-up">
            <DashboardTabs activeTab={activeTab} onTabChange={setActiveTab} />
          </div>

          {/* Tab Content */}
          <div className="animate-fade-in-up">
            {activeTab === "overview" && (
              <div className="space-y-8">
                {/* Quick Overview */}
                <div className="grid lg:grid-cols-2 gap-6">
                  <UpcomingClasses />
                  <TeacherAnalytics />
                </div>
                
                {/* Recent Classrooms */}
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white">Your Recent Classrooms</h2>
                    {classrooms.length > 3 && (
                      <Button
                        variant="outline"
                        className="border-white/30 text-white hover:bg-white/10 hover:border-white/50 hover:shadow-lg hover:shadow-white/10 transition-all duration-200"
                        onClick={() => setActiveTab("classrooms")}
                      >
                        View All
                      </Button>
                    )}
                  </div>
                  {isLoading ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {[1, 2, 3].map((i) => (
                        <Card key={i} className="bg-white/10 backdrop-blur-md border-white/20 animate-pulse">
                          <CardContent className="p-6">
                            <div className="h-6 bg-white/20 rounded mb-4"></div>
                            <div className="h-4 bg-white/20 rounded mb-2"></div>
                            <div className="h-4 bg-white/20 rounded w-3/4"></div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : classrooms.length === 0 ? (
                    <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-300">
                      <CardContent className="p-12 text-center">
                        <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4 animate-bounce" />
                        <h3 className="text-xl font-semibold text-white mb-2">No Classrooms Yet</h3>
                        <p className="text-gray-300 mb-6">Create your first classroom to start teaching students online.</p>
                        <Button 
                          onClick={() => setIsCreateDialogOpen(true)}
                          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-200"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Create Your First Classroom
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {classrooms.slice(0, 3).map((classroom) => (
                        <ClassroomCard 
                          key={classroom.id} 
                          classroom={classroom}
                          onEdit={handleEditClassroom}
                          onDelete={handleDeleteClassroom}
                          onViewAnalytics={handleViewAnalytics}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "classrooms" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-white">All Classrooms</h2>
                  <div className="flex gap-3">
                    <Badge className="bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 transition-colors">
                      {classrooms.length} Total
                    </Badge>
                    <Button 
                      onClick={() => setIsCreateDialogOpen(true)}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-200"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      New Classroom
                    </Button>
                  </div>
                </div>
                
                {isLoading ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <Card key={i} className="bg-white/10 backdrop-blur-md border-white/20 animate-pulse">
                        <CardContent className="p-6">
                          <div className="h-6 bg-white/20 rounded mb-4"></div>
                          <div className="h-4 bg-white/20 rounded mb-2"></div>
                          <div className="h-4 bg-white/20 rounded w-3/4"></div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : classrooms.length === 0 ? (
                  <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-300">
                    <CardContent className="p-12 text-center">
                      <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4 animate-bounce" />
                      <h3 className="text-xl font-semibold text-white mb-2">No Classrooms Yet</h3>
                      <p className="text-gray-300 mb-6">Create your first classroom to start teaching students online.</p>
                      <Button 
                        onClick={() => setIsCreateDialogOpen(true)}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-200"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Create Your First Classroom
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {classrooms.map((classroom) => (
                      <ClassroomCard 
                        key={classroom.id} 
                        classroom={classroom}
                        onEdit={handleEditClassroom}
                        onDelete={handleDeleteClassroom}
                        onViewAnalytics={handleViewAnalytics}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "analytics" && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">Teaching Analytics</h2>
                <TeacherAnalytics detailed={true} />
              </div>
            )}

            {activeTab === "enrollments" && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">Student Enrollments</h2>
                <TeacherEnrollments />
              </div>
            )}

            {activeTab === "schedule" && (
              <ClassScheduleManager />
            )}

            {activeTab === "settings" && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">Teacher Settings</h2>
                <TeacherSettingsTab />
              </div>
            )}
          </div>
        </div>

        <CreateClassroomDialog 
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
        />
      </div>
      <Footer />
    </>
  );
};

export default TeacherDashboard;
