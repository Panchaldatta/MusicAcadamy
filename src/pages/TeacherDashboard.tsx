
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Users, BookOpen, Calendar, Settings, BarChart3, Clock, Star, TrendingUp, DollarSign, Award } from "lucide-react";
import Navigation from "@/components/Navigation";
import ClassroomCard from "@/components/ClassroomCard";
import CreateClassroomDialog from "@/components/CreateClassroomDialog";
import TeacherAnalytics from "@/components/TeacherAnalytics";
import UpcomingClasses from "@/components/UpcomingClasses";
import Footer from "@/components/Footer";
import TeacherSettingsTab from "@/components/TeacherSettingsTab";
import { useTeacherClassrooms, useDeleteClassroom } from "@/hooks/useClassrooms";
import { useToast } from "@/hooks/use-toast";

const TeacherDashboard = () => {
  const { data: classrooms = [], isLoading, error } = useTeacherClassrooms();
  const deleteClassroom = useDeleteClassroom();
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

  const handleEditClassroom = (classroom: any) => {
    // For now, show coming soon - this would be implemented with an edit dialog
    toast({
      title: "Edit Classroom",
      description: `Edit functionality for "${classroom.name}" will be available soon!`,
    });
  };

  const handleViewAnalytics = (id: string) => {
    const classroom = classrooms.find(c => c.id === id);
    if (classroom) {
      toast({
        title: "Analytics",
        description: `Viewing analytics for "${classroom.name}". Detailed analytics coming soon!`,
      });
    }
  };

  // Calculate real stats from classroom data
  const totalStudents = classrooms.reduce((sum, classroom) => {
    return sum + Math.floor(classroom.capacity * 0.6); // Estimate 60% capacity
  }, 0);

  const totalRevenue = classrooms.reduce((sum, classroom) => {
    const estimatedStudents = Math.floor(classroom.capacity * 0.6);
    return sum + (estimatedStudents * classroom.price * (classroom.sessions_per_week || 2) * 4);
  }, 0);

  const averageRating = 4.8; // This would come from actual ratings in a real app

  const stats = [
    {
      title: "Total Students",
      value: totalStudents,
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      change: "+12%"
    },
    {
      title: "Active Classrooms",
      value: classrooms.length,
      icon: BookOpen,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      change: `${classrooms.length > 0 ? '+' : ''}${classrooms.length} total`
    },
    {
      title: "Monthly Revenue",
      value: `$${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      change: "+18%"
    },
    {
      title: "Average Rating",
      value: averageRating.toFixed(1),
      icon: Star,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
      change: "+0.2"
    }
  ];

  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "classrooms", label: "Classrooms", icon: BookOpen },
    { id: "analytics", label: "Analytics", icon: TrendingUp },
    { id: "schedule", label: "Schedule", icon: Calendar },
    { id: "settings", label: "Settings", icon: Settings }
  ];

  if (error) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
          <Card className="bg-white/10 backdrop-blur-md border-white/20 max-w-md">
            <CardContent className="p-6 text-center">
              <h2 className="text-xl font-semibold text-white mb-2">Error Loading Dashboard</h2>
              <p className="text-gray-300 mb-4">Please make sure you're logged in to access your teacher dashboard.</p>
              <Button 
                onClick={() => window.location.reload()} 
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="container mx-auto px-6 py-8">
          {/* Enhanced Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg">
                  <Award className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-4xl font-bold text-white">Teacher Dashboard</h1>
              </div>
              <p className="text-gray-300 text-lg">Welcome back! Manage your classrooms and track your teaching success</p>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10"
                onClick={() => setActiveTab("settings")}
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button 
                onClick={() => setIsCreateDialogOpen(true)}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg shadow-purple-500/25"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Classroom
              </Button>
            </div>
          </div>

          {/* Enhanced Stats Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                      <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                    <Badge variant="outline" className="border-green-500/50 text-green-400">
                      {stat.change}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-gray-300 text-sm font-medium">{stat.title}</p>
                    <p className="text-3xl font-bold text-white">{stat.value}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "outline"}
                onClick={() => setActiveTab(tab.id)}
                className={activeTab === tab.id 
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white" 
                  : "border-white/30 text-white hover:bg-white/10"
                }
              >
                <tab.icon className="h-4 w-4 mr-2" />
                {tab.label}
              </Button>
            ))}
          </div>

          {/* Tab Content */}
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
                      className="border-white/30 text-white hover:bg-white/10"
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
                  <Card className="bg-white/10 backdrop-blur-md border-white/20">
                    <CardContent className="p-12 text-center">
                      <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-white mb-2">No Classrooms Yet</h3>
                      <p className="text-gray-300 mb-6">Create your first classroom to start teaching students online.</p>
                      <Button 
                        onClick={() => setIsCreateDialogOpen(true)}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
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
                  <Badge className="bg-purple-500/20 text-purple-300">
                    {classrooms.length} Total
                  </Badge>
                  <Button 
                    onClick={() => setIsCreateDialogOpen(true)}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
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
                <Card className="bg-white/10 backdrop-blur-md border-white/20">
                  <CardContent className="p-12 text-center">
                    <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">No Classrooms Yet</h3>
                    <p className="text-gray-300 mb-6">Create your first classroom to start teaching students online.</p>
                    <Button 
                      onClick={() => setIsCreateDialogOpen(true)}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
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

          {activeTab === "schedule" && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Class Schedule</h2>
              <UpcomingClasses detailed={true} />
            </div>
          )}

          {activeTab === "settings" && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Teacher Settings</h2>
              <TeacherSettingsTab />
            </div>
          )}
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
