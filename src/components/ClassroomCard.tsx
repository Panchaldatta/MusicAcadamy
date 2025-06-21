
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Clock, Star, DollarSign, Edit, Trash2, Settings, BarChart3 } from "lucide-react";

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

interface ClassroomCardProps {
  classroom: Classroom;
  onEdit?: (classroom: Classroom) => void;
  onDelete?: (id: string) => void;
  onViewAnalytics?: (id: string) => void;
}

const ClassroomCard = ({ classroom, onEdit, onDelete, onViewAnalytics }: ClassroomCardProps) => {
  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner':
        return 'bg-green-500 hover:bg-green-600';
      case 'intermediate':
        return 'bg-yellow-500 hover:bg-yellow-600';
      case 'advanced':
        return 'bg-red-500 hover:bg-red-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  const getSubjectIcon = (subject: string) => {
    // You can expand this with actual icons for each subject
    return "🎵";
  };

  return (
    <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-105 group">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{getSubjectIcon(classroom.subject)}</span>
            <Badge className={`${getLevelColor(classroom.level)} text-white transition-colors`}>
              {classroom.level}
            </Badge>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-white text-sm font-medium">{classroom.rating}</span>
          </div>
        </div>
        
        <CardTitle className="text-white text-xl leading-tight group-hover:text-purple-200 transition-colors">
          {classroom.name}
        </CardTitle>
        <CardDescription className="text-gray-300 line-clamp-2">
          {classroom.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-4">
          {/* Stats Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-gray-300">
              <Users className="h-4 w-4 text-blue-400" />
              <span className="text-sm font-medium">{classroom.studentsCount} students</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <DollarSign className="h-4 w-4 text-green-400" />
              <span className="text-sm font-medium">${classroom.price}/session</span>
            </div>
          </div>
          
          {/* Schedule */}
          <div className="flex items-center gap-2 text-gray-300">
            <Clock className="h-4 w-4 text-purple-400" />
            <span className="text-sm">{classroom.schedule}</span>
          </div>

          {/* Revenue Info */}
          <div className="p-3 bg-white/5 rounded-lg border border-white/10">
            <div className="flex justify-between items-center">
              <span className="text-gray-300 text-sm">Monthly Revenue</span>
              <span className="text-white font-semibold">${classroom.studentsCount * classroom.price}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button 
              size="sm" 
              variant="outline" 
              className="flex-1 border-purple-500/50 text-purple-300 hover:bg-purple-500/10 hover:border-purple-400"
              onClick={() => onViewAnalytics?.(classroom.id)}
            >
              <BarChart3 className="h-4 w-4 mr-1" />
              Analytics
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="border-white/30 text-white hover:bg-white/10"
              onClick={() => onEdit?.(classroom)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="border-red-500/50 text-red-400 hover:bg-red-500/10 hover:border-red-400"
              onClick={() => onDelete?.(classroom.id)}
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
