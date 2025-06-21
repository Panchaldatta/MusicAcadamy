
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Clock, Star, DollarSign, Edit, Trash2 } from "lucide-react";

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
}

const ClassroomCard = ({ classroom }: ClassroomCardProps) => {
  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner':
        return 'bg-green-500';
      case 'intermediate':
        return 'bg-yellow-500';
      case 'advanced':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-105">
      <CardHeader>
        <div className="flex justify-between items-start mb-2">
          <Badge className={`${getLevelColor(classroom.level)} text-white`}>
            {classroom.level}
          </Badge>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-white text-sm">{classroom.rating}</span>
          </div>
        </div>
        <CardTitle className="text-white text-lg">{classroom.name}</CardTitle>
        <CardDescription className="text-gray-300">
          {classroom.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-gray-300">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="text-sm">{classroom.studentsCount} students</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              <span className="text-sm">${classroom.price}/session</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-gray-300">
            <Clock className="h-4 w-4" />
            <span className="text-sm">{classroom.schedule}</span>
          </div>

          <div className="pt-4 flex gap-2">
            <Button size="sm" variant="outline" className="flex-1 border-white/30 text-white hover:bg-white/10">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button size="sm" variant="outline" className="border-red-500/50 text-red-400 hover:bg-red-500/10">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClassroomCard;
