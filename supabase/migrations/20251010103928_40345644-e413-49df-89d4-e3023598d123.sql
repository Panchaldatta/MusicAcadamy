-- Fix RLS policies to ensure all user roles can properly manage their data

-- 1. Allow teachers to view their own lesson bookings
CREATE POLICY "Teachers can view their own bookings"
ON public.lesson_bookings
FOR SELECT
TO authenticated
USING (auth.uid() = teacher_id);

-- 2. Allow teachers to update their own lesson bookings (e.g., change status)
CREATE POLICY "Teachers can update their own bookings"
ON public.lesson_bookings
FOR UPDATE
TO authenticated
USING (auth.uid() = teacher_id)
WITH CHECK (auth.uid() = teacher_id);

-- 3. Allow teachers to manage enrollments in their classrooms
CREATE POLICY "Teachers can update enrollments in their classrooms"
ON public.classroom_enrollments
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.classrooms
    WHERE classrooms.id = classroom_enrollments.classroom_id
    AND classrooms.teacher_id = auth.uid()
  )
);

CREATE POLICY "Teachers can delete enrollments in their classrooms"
ON public.classroom_enrollments
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.classrooms
    WHERE classrooms.id = classroom_enrollments.classroom_id
    AND classrooms.teacher_id = auth.uid()
  )
);

-- 4. Allow teachers to view student preferences for enrolled students
CREATE POLICY "Teachers can view preferences of their enrolled students"
ON public.student_preferences
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 
    FROM public.classroom_enrollments ce
    JOIN public.classrooms c ON c.id = ce.classroom_id
    WHERE ce.student_id = student_preferences.student_id
    AND c.teacher_id = auth.uid()
  )
);