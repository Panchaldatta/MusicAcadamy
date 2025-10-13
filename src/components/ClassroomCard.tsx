
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Clock, Star, DollarSign, Edit, Trash2, BarChart3 } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type Classroom = Database['public']['Tables']['classrooms']['Row'];

interface ClassroomCardProps {
  classroom: Classroom;
  enrollmentCount?: number;
  onEdit?: (classroom: Classroom) => void;
  onDelete?: (id: string) => void;
  onViewAnalytics?: (id: string) => void;
}

const ClassroomCard = ({ classroom, enrollmentCount = 0, onEdit, onDelete, onViewAnalytics }: ClassroomCardProps) => {
  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner':
        return 'bg-green-500 hover:bg-green-600 shadow-green-500/25';
      case 'intermediate':
        return 'bg-yellow-500 hover:bg-yellow-600 shadow-yellow-500/25';
      case 'advanced':
        return 'bg-red-500 hover:bg-red-600 shadow-red-500/25';
      default:
        return 'bg-gray-500 hover:bg-gray-600 shadow-gray-500/25';
    }
  };

  const getSubjectIcon = (subject: string) => {
    // You can expand this with actual icons for each subject
    return "🎵";
  };

  const monthlyRevenue = enrollmentCount * classroom.price * (classroom.sessions_per_week || 2) * 4;

  return (
    <Card className="bg-card/50 backdrop-blur-md border-border hover:bg-accent/50 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 group cursor-pointer">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl group-hover:scale-110 transition-transform duration-200">
              {getSubjectIcon(classroom.subject)}
            </span>
            <Badge className={`${getLevelColor(classroom.level)} text-white transition-all duration-200 hover:shadow-lg`}>
              {classroom.level}
            </Badge>
          </div>
          <div className="flex items-center gap-1 group-hover:scale-110 transition-transform duration-200">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-white text-sm font-medium">4.8</span>
          </div>
        </div>
        
        <CardTitle className="text-white text-xl leading-tight group-hover:text-purple-200 transition-colors duration-200">
          {classroom.name}
        </CardTitle>
        <CardDescription className="text-gray-300 line-clamp-2 group-hover:text-gray-200 transition-colors duration-200">
          {classroom.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-4">
          {/* Stats Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-gray-300 group-hover:text-gray-200 transition-colors">
              <Users className="h-4 w-4 text-blue-400" />
              <span className="text-sm font-medium">{enrollmentCount}/{classroom.capacity} students</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300 group-hover:text-gray-200 transition-colors">
              <DollarSign className="h-4 w-4 text-green-400" />
              <span className="text-sm font-medium">${classroom.price}/session</span>
            </div>
          </div>
          
          {/* Schedule */}
          <div className="flex items-center gap-2 text-gray-300 group-hover:text-gray-200 transition-colors">
            <Clock className="h-4 w-4 text-purple-400" />
            <span className="text-sm">{classroom.schedule}</span>
          </div>

          {/* Additional Info */}
          <div className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors space-y-1">
            <div>Duration: {classroom.duration_weeks} weeks</div>
            <div>Sessions: {classroom.sessions_per_week}/week, {classroom.session_duration_minutes}min each</div>
          </div>

          {/* Revenue Info */}
          <div className="p-3 bg-muted/30 rounded-lg border border-border group-hover:bg-muted/50 group-hover:border-accent transition-all duration-200">
            <div className="flex justify-between items-center">
              <span className="text-gray-300 text-sm">Monthly Revenue</span>
              <span className="text-white font-semibold">${monthlyRevenue}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button 
              size="sm" 
              variant="outline" 
              className="flex-1 border-purple-500/50 text-purple-300 hover:bg-purple-500/20 hover:border-purple-400 hover:text-purple-200 hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-200"
              onClick={(e) => {
                e.stopPropagation();
                onViewAnalytics?.(classroom.id);
              }}
            >
              <BarChart3 className="h-4 w-4 mr-1" />
              Analytics
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="hover:bg-accent hover:text-accent-foreground transition-all duration-200"
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.(classroom);
              }}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="border-red-500/50 text-red-400 hover:bg-red-500/20 hover:border-red-400 hover:text-red-300 hover:shadow-lg hover:shadow-red-500/25 transition-all duration-200"
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.(classroom.id);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClassroomCard;
