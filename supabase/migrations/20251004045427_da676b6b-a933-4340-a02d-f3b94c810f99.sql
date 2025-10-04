-- Assign admin role to user
INSERT INTO public.user_roles (user_id, role)
VALUES ('a3f6818e-ab1f-4034-a998-12c35819fefc', 'admin'::app_role)
ON CONFLICT (user_id, role) DO NOTHING;