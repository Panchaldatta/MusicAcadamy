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
  UserCheck
} from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { AdminService } from "@/services/adminService";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const TeacherDashboardAdmin = () => {
  const [adminStats, setAdminStats] = useState<any[]>([]);
  const [dashboardMetrics, setDashboardMetrics] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [isAdmin, setIsAdmin] = useState(false);
  const { loading: authLoading } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const checkAdminAndLoad = async () => {
      if (authLoading) return;

      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setIsAdmin(false);
          setLoading(false);
          return;
        }

        const { data: roleData } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'admin')
          .maybeSingle();

        if (!roleData) {
          setIsAdmin(false);
          setLoading(false);
          toast({
            title: "Access Denied",
            description: "You don't have permission to access the admin dashboard.",
            variant: "destructive"
          });
          return;
        }

        setIsAdmin(true);
        await loadDashboardData();
      } catch (error) {
        console.error('Error checking admin role:', error);
        setIsAdmin(false);
        setLoading(false);
      }
    };

    checkAdminAndLoad();
  }, [authLoading, toast]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [stats, metrics] = await Promise.all([
        AdminService.getAdminStats(),
        AdminService.getDashboardMetrics()
      ]);
      
      setAdminStats(stats);
      setDashboardMetrics(metrics);
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

  const refreshStats = async () => {
    await loadDashboardData();
    toast({
      title: "Stats Updated",
      description: "Dashboard statistics have been refreshed",
    });
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "users", label: "Users", icon: Users },
    { id: "classrooms", label: "Classrooms", icon: BookOpen },
    { id: "analytics", label: "Analytics", icon: TrendingUp },
    { id: "settings", label: "Settings", icon: Settings }
  ];

  const statCards = [
    {
      title: "Total Users",
      value: dashboardMetrics.totalUsers || 0,
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      description: "Registered users"
    },
    {
      title: "Teachers",
      value: dashboardMetrics.totalTeachers || 0,
      icon: UserCheck,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      description: "Active teachers"
    },
    {
      title: "Students",
      value: dashboardMetrics.totalStudents || 0,
      icon: Users,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      description: "Active students"
    },
    {
      title: "Classrooms",
      value: dashboardMetrics.totalClassrooms || 0,
      icon: BookOpen,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
      description: "Total classrooms"
    },
    {
      title: "Active Classes",
      value: dashboardMetrics.activeClassrooms || 0,
      icon: Activity,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
      description: "Currently active"
    },
    {
      title: "Total Swipes",
      value: dashboardMetrics.totalSwipes || 0,
      icon: TrendingUp,
      color: "text-pink-500",
      bgColor: "bg-pink-500/10",
      description: "User interactions"
    }
  ];

  if (authLoading || loading) {
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

  if (!isAdmin) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
          <Card className="bg-white/10 backdrop-blur-md border-white/20 max-w-md">
            <CardContent className="p-8 text-center">
              <Shield className="h-16 w-16 text-red-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-white mb-2">Access Denied</h2>
              <p className="text-gray-300">You don't have permission to access the admin dashboard.</p>
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
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
            {statCards.map((stat, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                      <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-300 text-sm font-medium">{stat.title}</p>
                    <p className="text-3xl font-bold text-white">{stat.value}</p>
                    <p className="text-gray-400 text-xs mt-1">{stat.description}</p>
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
            <div className="space-y-6">
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Platform Statistics</CardTitle>
                  <CardDescription className="text-gray-300">
                    Current metrics from the database
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-gray-300">Metric</TableHead>
                        <TableHead className="text-gray-300">Value</TableHead>
                        <TableHead className="text-gray-300">Category</TableHead>
                        <TableHead className="text-gray-300">Last Updated</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {adminStats.map((stat) => (
                        <TableRow key={stat.id}>
                          <TableCell className="text-white font-medium">{stat.metric_name}</TableCell>
                          <TableCell className="text-white">{stat.metric_value}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">{stat.metric_category}</Badge>
                          </TableCell>
                          <TableCell className="text-gray-300">
                            {new Date(stat.updated_at).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Other tabs content would go here */}
          {activeTab !== "overview" && (
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardContent className="p-12 text-center">
                <Eye className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Coming Soon</h3>
                <p className="text-gray-300">This section is under development.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default TeacherDashboardAdmin;
