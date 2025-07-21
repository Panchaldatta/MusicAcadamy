
import { Teacher } from "@/hooks/useTeachers";
import TeacherModernCard from "./TeacherModernCard";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

interface TeacherGridProps {
  teachers: Teacher[];
}

const TeacherGrid = ({ teachers }: TeacherGridProps) => {
  if (teachers.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-32 h-32 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center mx-auto mb-8">
          <Star className="h-16 w-16 text-orange-600" />
        </div>
        <h3 className="text-3xl font-bold text-gray-900 mb-4">No teachers found</h3>
        <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
          Try adjusting your search criteria or filters to discover amazing music teachers perfect for your learning journey.
        </p>
        <Button className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700">
          Clear All Filters
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {teachers.map((teacher) => (
        <TeacherModernCard 
          key={teacher.id} 
          teacher={teacher}
        />
      ))}
    </div>
  );
};

export default TeacherGrid;
