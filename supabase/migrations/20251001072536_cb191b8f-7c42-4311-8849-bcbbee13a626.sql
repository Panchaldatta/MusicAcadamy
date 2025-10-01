-- Add meet_link column to class_sessions table
ALTER TABLE class_sessions
ADD COLUMN meet_link text;

-- Add RLS policy for students to view sessions of their enrolled classrooms
CREATE POLICY "Students can view sessions of enrolled classrooms"
ON class_sessions
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM classroom_enrollments
    WHERE classroom_enrollments.classroom_id = class_sessions.classroom_id
    AND classroom_enrollments.student_id = auth.uid()
    AND classroom_enrollments.status = 'active'
  )
);