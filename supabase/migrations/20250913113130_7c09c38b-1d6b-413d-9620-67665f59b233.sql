-- Add missing foreign key constraint between classrooms and teachers
-- The classrooms table has teacher_id but no foreign key constraint

ALTER TABLE public.classrooms 
ADD CONSTRAINT classrooms_teacher_id_fkey 
FOREIGN KEY (teacher_id) REFERENCES public.teachers(id) ON DELETE CASCADE;

-- Also ensure lesson_bookings has proper foreign key to teachers
ALTER TABLE public.lesson_bookings 
ADD CONSTRAINT lesson_bookings_teacher_id_fkey 
FOREIGN KEY (teacher_id) REFERENCES public.teachers(id) ON DELETE CASCADE;