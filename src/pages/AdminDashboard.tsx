import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Shield, 
  Users, 
  BookOpen, 
  TrendingUp, 
  Activity, 
  Settings,
  BarChart3,
  RefreshCw,
  Eye,
  UserCheck,
  GraduationCap,
  DollarSign,
  AlertCircle,
  CheckCircle,
  XCircle,
  Edit,
  Trash2
} from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { AdminService } from "@/services/adminService";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const AdminDashboard = () => {
  const [dashboardMetrics, setDashboardMetrics] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [recentClassrooms, setRecentClassrooms] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [allClassrooms, setAllClassrooms] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const metrics = await AdminService.getDashboardMetrics();
      setDashboardMetrics(metrics);

      // Fetch recent users (for overview)
      const { data: users } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      setRecentUsers(users || []);

      // Fetch ALL users (for user management tab)
      const { data: allUsersData } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      setAllUsers(allUsersData || []);

      // Fetch recent classrooms with teacher info from profiles
      const { data: classrooms, error: classroomsError } = await supabase
        .from('classrooms')
        .select(`
          *,
          teacher:profiles!teacher_id(first_name, last_name)
        `)
        .order('created_at', { ascending: false })
        .limit(10);

      if (classroomsError) {
        console.error('Error fetching classrooms:', classroomsError);
      }
      
      setRecentClassrooms(classrooms || []);

      // Fetch ALL classrooms (for classroom management tab)
      const { data: allClassroomsData, error: allClassroomsError } = await supabase
        .from('classrooms')
        .select(`
          *,
          teacher:profiles!teacher_id(first_name, last_name)
        `)
        .order('created_at', { ascending: false });

      if (allClassroomsError) {
        console.error('Error fetching all classrooms:', allClassroomsError);
      }
      
      setAllClassrooms(allClassroomsData || []);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleClassroomStatus = async (classroomId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      const { error } = await supabase
        .from('classrooms')
        .update({ status: newStatus })
        .eq('id', classroomId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Classroom ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`,
      });

      await loadDashboardData();
    } catch (error) {
      console.error('Error toggling classroom status:', error);
      toast({
        title: "Error",
        description: "Failed to update classroom status",
        variant: "destructive"
      });
    }
  };

  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_active: !currentStatus })
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `User ${!currentStatus ? 'activated' : 'deactivated'} successfully`,
      });

      await loadDashboardData();
    } catch (error) {
      console.error('Error toggling user status:', error);
      toast({
        title: "Error",
        description: "Failed to update user status",
        variant: "destructive"
      });
    }
  };

  const deleteClassroom = async (classroomId: string) => {
    if (!confirm('Are you sure you want to delete this classroom? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('classrooms')
        .delete()
        .eq('id', classroomId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Classroom deleted successfully",
      });

      await loadDashboardData();
    } catch (error) {
      console.error('Error deleting classroom:', error);
      toast({
        title: "Error",
        description: "Failed to delete classroom",
        variant: "destructive"
      });
    }
  };

  const refreshStats = async () => {
    await loadDashboardData();
    toast({
      title: "Stats Updated",
      description: "Dashboard statistics have been refreshed",
    });
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "users", label: "User Management", icon: Users },
    { id: "classrooms", label: "Classroom Management", icon: BookOpen },
    { id: "analytics", label: "Platform Analytics", icon: TrendingUp },
    { id: "settings", label: "System Settings", icon: Settings }
  ];

  const statCards = [
    {
      title: "Total Users",
      value: dashboardMetrics.totalUsers || 0,
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      description: "Registered users",
      trend: `${dashboardMetrics.monthlySignups || 0} this month`
    },
    {
      title: "Teachers",
      value: dashboardMetrics.totalTeachers || 0,
      icon: GraduationCap,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      description: "Active teachers",
      trend: `${Math.round((dashboardMetrics.totalTeachers / (dashboardMetrics.totalUsers || 1)) * 100)}% of users`
    },
    {
      title: "Students",
      value: dashboardMetrics.totalStudents || 0,
      icon: UserCheck,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      description: "Active students",
      trend: `${Math.round((dashboardMetrics.totalStudents / (dashboardMetrics.totalUsers || 1)) * 100)}% of users`
    },
    {
      title: "Total Classrooms",
      value: dashboardMetrics.totalClassrooms || 0,
      icon: BookOpen,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
      description: "All classrooms",
      trend: `${dashboardMetrics.totalClassrooms || 0} total`
    },
    {
      title: "Active Classes",
      value: dashboardMetrics.activeClassrooms || 0,
      icon: Activity,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
      description: "Currently active",
      trend: `${Math.round((dashboardMetrics.activeClassrooms / (dashboardMetrics.totalClassrooms || 1)) * 100) || 0}% active`
    },
    {
      title: "Platform Activity",
      value: dashboardMetrics.totalSwipes || 0,
      icon: TrendingUp,
      color: "text-pink-500",
      bgColor: "bg-pink-500/10",
      description: "Total interactions",
      trend: `${dashboardMetrics.totalSwipes || 0} total swipes`
    }
  ];

  if (loading) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin text-white mx-auto mb-4" />
            <p className="text-white">Loading admin dashboard...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-16">
        <div className="container mx-auto px-6 py-8">
          {/* Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-gradient-to-r from-red-600 to-orange-600 rounded-lg">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-4xl font-bold text-white">Admin Dashboard</h1>
              </div>
              <p className="text-gray-300 text-lg">Monitor and manage your music education platform</p>
            </div>
            <div className="flex gap-3">
              <Button 
                onClick={refreshStats}
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button 
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10"
                onClick={() => setActiveTab("settings")}
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {statCards.map((stat, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                      <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {stat.trend}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-gray-300 text-sm font-medium">{stat.title}</p>
                    <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                    <p className="text-gray-400 text-xs">{stat.description}</p>
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
                  ? "bg-gradient-to-r from-red-600 to-orange-600 text-white" 
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
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Recent Users */}
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Recent Users
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    Latest user registrations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentUsers.slice(0, 5).map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <div>
                          <p className="text-white font-medium">{user.first_name} {user.last_name}</p>
                          <p className="text-gray-400 text-sm">{user.email}</p>
                        </div>
                        <Badge variant="secondary">{user.role}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Classrooms */}
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Recent Classrooms
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    Latest classroom creations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentClassrooms.slice(0, 5).map((classroom) => (
                      <div key={classroom.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <div>
                          <p className="text-white font-medium">{classroom.name}</p>
                          <p className="text-gray-400 text-sm">{classroom.subject}</p>
                        </div>
                        <Badge 
                          variant={classroom.status === 'active' ? 'default' : 'secondary'}
                          className={classroom.status === 'active' ? 'bg-green-500/20 text-green-300' : ''}
                        >
                          {classroom.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "users" && (
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white">User Management</CardTitle>
                <CardDescription className="text-gray-300">
                  Manage all platform users ({allUsers.length} total)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-gray-300">Name</TableHead>
                        <TableHead className="text-gray-300">Email</TableHead>
                        <TableHead className="text-gray-300">Role</TableHead>
                        <TableHead className="text-gray-300">Status</TableHead>
                        <TableHead className="text-gray-300">Joined</TableHead>
                        <TableHead className="text-gray-300 text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {allUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="text-white font-medium">
                            {user.first_name} {user.last_name}
                          </TableCell>
                          <TableCell className="text-gray-300">{user.email}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">{user.role}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={user.is_active ? 'default' : 'secondary'}
                              className={user.is_active ? 'bg-green-500/20 text-green-300' : 'bg-gray-500/20 text-gray-300'}
                            >
                              {user.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-gray-300">
                            {new Date(user.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              size="sm"
                              variant={user.is_active ? "destructive" : "default"}
                              onClick={() => toggleUserStatus(user.id, user.is_active)}
                              className="text-xs"
                            >
                              {user.is_active ? (
                                <>
                                  <XCircle className="h-3 w-3 mr-1" />
                                  Deactivate
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Activate
                                </>
                              )}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "classrooms" && (
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Classroom Management</CardTitle>
                <CardDescription className="text-gray-300">
                  Monitor and manage all classrooms ({allClassrooms.length} total)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-gray-300">Classroom</TableHead>
                        <TableHead className="text-gray-300">Subject</TableHead>
                        <TableHead className="text-gray-300">Teacher</TableHead>
                        <TableHead className="text-gray-300">Status</TableHead>
                        <TableHead className="text-gray-300">Price</TableHead>
                        <TableHead className="text-gray-300">Level</TableHead>
                        <TableHead className="text-gray-300">Created</TableHead>
                        <TableHead className="text-gray-300 text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {allClassrooms.map((classroom) => (
                        <TableRow key={classroom.id}>
                          <TableCell className="text-white font-medium">{classroom.name}</TableCell>
                          <TableCell className="text-gray-300">{classroom.subject}</TableCell>
                          <TableCell className="text-gray-300">
                            {classroom.teacher ? `${classroom.teacher.first_name} ${classroom.teacher.last_name}` : 'N/A'}
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={classroom.status === 'active' ? 'default' : 'secondary'}
                              className={classroom.status === 'active' ? 'bg-green-500/20 text-green-300' : 'bg-gray-500/20 text-gray-300'}
                            >
                              {classroom.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-gray-300">${classroom.price}</TableCell>
                          <TableCell className="text-gray-300">
                            <Badge variant="outline" className="text-xs">
                              {classroom.level}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-gray-300">
                            {new Date(classroom.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex gap-2 justify-end">
                              <Button
                                size="sm"
                                variant={classroom.status === 'active' ? "outline" : "default"}
                                onClick={() => toggleClassroomStatus(classroom.id, classroom.status)}
                                className="text-xs"
                              >
                                {classroom.status === 'active' ? (
                                  <>
                                    <XCircle className="h-3 w-3 mr-1" />
                                    Deactivate
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Activate
                                  </>
                                )}
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => deleteClassroom(classroom.id)}
                                className="text-xs"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "analytics" && (
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Platform Growth</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                      <div className="flex items-center gap-3">
                        <TrendingUp className="h-5 w-5 text-green-400" />
                        <span className="text-white">Monthly Signups</span>
                      </div>
                      <span className="text-2xl font-bold text-white">
                        {dashboardMetrics.monthlySignups || 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Activity className="h-5 w-5 text-blue-400" />
                        <span className="text-white">Active Rate</span>
                      </div>
                      <span className="text-2xl font-bold text-white">
                        {Math.round((dashboardMetrics.activeClassrooms / dashboardMetrics.totalClassrooms) * 100) || 0}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">System Health</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                      <span className="text-white">Database</span>
                      <Badge className="bg-green-500/20 text-green-300">Healthy</Badge>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                      <span className="text-white">API</span>
                      <Badge className="bg-green-500/20 text-green-300">Operational</Badge>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                      <span className="text-white">Storage</span>
                      <Badge className="bg-green-500/20 text-green-300">Normal</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "settings" && (
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardContent className="p-12 text-center">
                <Settings className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">System Settings</h3>
                <p className="text-gray-300">Platform configuration and system settings coming soon.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AdminDashboard;
