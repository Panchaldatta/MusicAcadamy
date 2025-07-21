
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

interface TeacherAnalyticsProps {
  detailed?: boolean;
}

const TeacherAnalytics = ({ detailed = false }: TeacherAnalyticsProps) => {
  const monthlyData = [
    { month: 'Jan', students: 20, revenue: 800 },
    { month: 'Feb', students: 25, revenue: 1000 },
    { month: 'Mar', students: 30, revenue: 1200 },
    { month: 'Apr', students: 35, revenue: 1400 },
    { month: 'May', students: 32, revenue: 1280 },
    { month: 'Jun', students: 38, revenue: 1520 }
  ];

  const subjectData = [
    { name: 'Piano', students: 15, color: '#8B5CF6' },
    { name: 'Guitar', students: 8, color: '#10B981' },
    { name: 'Vocals', students: 12, color: '#F59E0B' }
  ];

  if (!detailed) {
    return (
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <BarChart className="h-5 w-5 mr-2 text-purple-400" />
            Student Growth
          </CardTitle>
          <CardDescription className="text-gray-300">
            Your teaching progress over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151', 
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }} 
                />
                <Line type="monotone" dataKey="students" stroke="#8B5CF6" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Student Growth</CardTitle>
            <CardDescription className="text-gray-300">
              Monthly student enrollment trends
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151', 
                      borderRadius: '8px',
                      color: '#F9FAFB'
                    }} 
                  />
                  <Bar dataKey="students" fill="#8B5CF6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Subject Distribution</CardTitle>
            <CardDescription className="text-gray-300">
              Students by subject area
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={subjectData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="students"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {subjectData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151', 
                      borderRadius: '8px',
                      color: '#F9FAFB'
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Revenue Tracking</CardTitle>
          <CardDescription className="text-gray-300">
            Monthly revenue from all classrooms
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151', 
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }} 
                />
                <Line type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeacherAnalytics;
