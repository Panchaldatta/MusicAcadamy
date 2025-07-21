
import { Card, CardContent } from "@/components/ui/card";
import { Piano, Guitar, Music2, Drum, Mic, BookOpen } from "lucide-react";
import { MusicSubject } from "@/hooks/useMusicSubjects";

interface MusicSubjectCardProps {
  subject: MusicSubject;
  isSelected?: boolean;
  onClick?: () => void;
}

const iconMap: Record<string, any> = {
  Piano,
  Guitar,
  Music2,
  Drum,
  Mic,
  BookOpen,
};

const MusicSubjectCard = ({ subject, isSelected, onClick }: MusicSubjectCardProps) => {
  const IconComponent = iconMap[subject.icon] || Music2;

  return (
    <Card 
      className={`cursor-pointer hover:shadow-lg transition-all duration-300 border-2 ${
        isSelected ? 'border-blue-500 bg-blue-50' : 'hover:border-blue-200'
      }`}
      onClick={onClick}
    >
      <CardContent className="p-6 text-center">
        <div className={`w-12 h-12 ${subject.color} rounded-full flex items-center justify-center mx-auto mb-3`}>
          <IconComponent className="h-6 w-6 text-white" />
        </div>
        <h3 className="font-semibold text-gray-900 mb-1">{subject.name}</h3>
        <p className="text-sm text-gray-500">{subject.student_count} students</p>
      </CardContent>
    </Card>
  );
};

export default MusicSubjectCard;
