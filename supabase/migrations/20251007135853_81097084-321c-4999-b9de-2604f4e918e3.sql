-- Grant admin role to the currently logged-in user's account (swaradeveloperspvt@gmail.com)
-- Keeping existing roles; ensures idempotency on repeated runs
INSERT INTO public.user_roles (user_id, role)
VALUES ('a4637156-5159-46e0-8590-791e7629f643', 'admin'::app_role)
ON CONFLICT (user_id, role) DO UPDATE SET updated_at = now();