
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, BookOpen, DollarSign, Star } from "lucide-react";

interface DashboardStatsProps {
  totalStudents: number;
  totalClassrooms: number;
  totalRevenue: number;
  averageRating: number;
}

const DashboardStats = ({ totalStudents, totalClassrooms, totalRevenue, averageRating }: DashboardStatsProps) => {
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
      value: totalClassrooms,
      icon: BookOpen,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      change: `${totalClassrooms > 0 ? '+' : ''}${totalClassrooms} total`
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

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <Card 
          key={index} 
          className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-white/10 group"
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.bgColor} group-hover:scale-110 transition-transform duration-200`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <Badge 
                variant="outline" 
                className="border-green-500/50 text-green-400 hover:border-green-400 hover:bg-green-500/10 transition-colors"
              >
                {stat.change}
              </Badge>
            </div>
            <div>
              <p className="text-gray-300 text-sm font-medium group-hover:text-gray-200 transition-colors">
                {stat.title}
              </p>
              <p className="text-3xl font-bold text-white group-hover:text-purple-200 transition-colors">
                {stat.value}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DashboardStats;
