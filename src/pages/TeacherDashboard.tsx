
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Users, BookOpen, Calendar, Settings, BarChart3, Clock, Star } from "lucide-react";
import Navigation from "@/components/Navigation";
import ClassroomCard from "@/components/ClassroomCard";
import CreateClassroomDialog from "@/components/CreateClassroomDialog";

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
    }
  ]);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

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

  const stats = [
    {
      title: "Total Students",
      value: classrooms.reduce((sum, classroom) => sum + classroom.studentsCount, 0),
      icon: Users,
      color: "text-blue-500"
    },
    {
      title: "Active Classrooms",
      value: classrooms.length,
      icon: BookOpen,
      color: "text-green-500"
    },
    {
      title: "This Week's Classes",
      value: 12,
      icon: Calendar,
      color: "text-purple-500"
    },
    {
      title: "Average Rating",
      value: classrooms.length > 0 ? (classrooms.reduce((sum, classroom) => sum + classroom.rating, 0) / classrooms.length).toFixed(1) : "0.0",
      icon: Star,
      color: "text-yellow-500"
    }
  ];

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="container mx-auto px-6 py-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Teacher Dashboard</h1>
              <p className="text-gray-300">Manage your classrooms and track student progress</p>
            </div>
            <Button 
              onClick={() => setIsCreateDialogOpen(true)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Classroom
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-md border-white/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-300 text-sm font-medium">{stat.title}</p>
                      <p className="text-3xl font-bold text-white">{stat.value}</p>
                    </div>
                    <stat.icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Classrooms Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">Your Classrooms</h2>
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

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-300 cursor-pointer">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-purple-400" />
                  Analytics
                </CardTitle>
                <CardDescription className="text-gray-300">
                  View detailed insights about your teaching performance
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-300 cursor-pointer">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-green-400" />
                  Schedule
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Manage your teaching schedule and upcoming classes
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-300 cursor-pointer">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Settings className="h-5 w-5 mr-2 text-blue-400" />
                  Settings
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Configure your teaching preferences and profile
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>

        <CreateClassroomDialog 
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          onCreateClassroom={handleCreateClassroom}
        />
      </div>
    </>
  );
};

export default TeacherDashboard;
