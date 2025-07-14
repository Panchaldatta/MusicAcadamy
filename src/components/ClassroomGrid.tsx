
import SwipeableClassroomView from './SwipeableClassroomView';
import type { Database } from "@/integrations/supabase/types";

type Classroom = Database['public']['Tables']['classrooms']['Row'];

interface ClassroomGridProps {
  classrooms: Classroom[];
}

const ClassroomGrid = ({ classrooms }: ClassroomGridProps) => {
  return <SwipeableClassroomView classrooms={classrooms} />;
};

export default ClassroomGrid;
