-- Remove teacher role from admin user
-- Admin accounts should only have admin role, not multiple roles

DELETE FROM public.user_roles
WHERE user_id = 'a4637156-5159-46e0-8590-791e7629f643'
AND role = 'teacher';

-- Add a comment to clarify role assignment
COMMENT ON TABLE public.user_roles IS 'User roles table - users should typically have one primary role (admin, teacher, or student)';