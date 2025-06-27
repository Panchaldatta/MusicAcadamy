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

interface Classroom {
  id: string;
  name: string;
  description: string;
  subject: string;
  studentsCount: number;
  schedule: string;
  level: string;
  price: number;
  rating: number;
  image?: string;
}

const TeacherDashboard = () => {
  const [classrooms, setClassrooms] = useState<Classroom[]>([
    {
      id: "1",
      name: "Piano Fundamentals",
      description: "Learn the basics of piano playing with proper finger technique and music theory.",
      subject: "Piano",
      studentsCount: 15,
      schedule: "Mon, Wed, Fri - 4:00 PM",
      level: "Beginner",
      price: 25,
      rating: 4.8
    },
    {
      id: "2",
      name: "Guitar Masterclass",
      description: "Advanced guitar techniques including jazz, classical, and contemporary styles.",
      subject: "Guitar",
      studentsCount: 8,
      schedule: "Tue, Thu - 6:00 PM",
      level: "Advanced",
      price: 40,
      rating: 4.9
    },
    {
      id: "3",
      name: "Vocal Training Basics",
      description: "Develop your voice with proper breathing techniques and vocal exercises.",
      subject: "Vocals",
      studentsCount: 12,
      schedule: "Mon, Wed - 5:30 PM",
      level: "Beginner",
      price: 30,
      rating: 4.7
    }
  ]);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const handleCreateClassroom = (newClassroom: Omit<Classroom, 'id' | 'studentsCount' | 'rating'>) => {
    const classroom: Classroom = {
      ...newClassroom,
      id: Date.now().toString(),
      studentsCount: 0,
      rating: 0
    };
    setClassrooms([...classrooms, classroom]);
    setIsCreateDialogOpen(false);
  };

  const totalStudents = classrooms.reduce((sum, classroom) => sum + classroom.studentsCount, 0);
  const totalRevenue = classrooms.reduce((sum, classroom) => sum + (classroom.studentsCount * classroom.price), 0);
  const averageRating = classrooms.length > 0 ? (classrooms.reduce((sum, classroom) => sum + classroom.rating, 0) / classrooms.length) : 0;

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
      change: "+2 new"
    },
    {
      title: "Monthly Revenue",
      value: `$${totalRevenue}`,
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
                <h2 className="text-2xl font-bold text-white mb-6">Your Recent Classrooms</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {classrooms.slice(0, 3).map((classroom) => (
                    <ClassroomCard key={classroom.id} classroom={classroom} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "classrooms" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">All Classrooms</h2>
                <Badge className="bg-purple-500/20 text-purple-300">
                  {classrooms.length} Total
                </Badge>
              </div>
              
              {classrooms.length === 0 ? (
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
                    <ClassroomCard key={classroom.id} classroom={classroom} />
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
              <div className="grid lg:grid-cols-2 gap-6">
                <Card className="bg-white/10 backdrop-blur-md border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white">Profile Settings</CardTitle>
                    <CardDescription className="text-gray-300">
                      Manage your teaching profile and preferences
                    </CardDescription>
                  </CardHeader>
                </Card>
                <Card className="bg-white/10 backdrop-blur-md border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white">Notification Settings</CardTitle>
                    <CardDescription className="text-gray-300">
                      Configure how you receive notifications
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </div>
          )}
        </div>

        <CreateClassroomDialog 
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          onCreateClassroom={handleCreateClassroom}
        />
      </div>
      <Footer />
    </>
  );
};

export default TeacherDashboard;
