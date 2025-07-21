
-- Update the profiles table to better support Google OAuth data
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS google_id TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS provider TEXT DEFAULT 'email';

-- Update the handle_new_user function to support Google OAuth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (
    id, 
    first_name, 
    last_name, 
    email, 
    role,
    is_active,
    email_verified,
    google_id,
    provider,
    avatar_url
  )
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data ->> 'first_name', new.raw_user_meta_data ->> 'given_name'),
    COALESCE(new.raw_user_meta_data ->> 'last_name', new.raw_user_meta_data ->> 'family_name'),
    new.email,
    COALESCE(new.raw_user_meta_data ->> 'role', 'student'),
    true,
    COALESCE(new.email_confirmed_at IS NOT NULL, true), -- Google users are pre-verified
    new.raw_user_meta_data ->> 'sub',
    COALESCE(new.raw_user_meta_data ->> 'provider', 'google'),
    new.raw_user_meta_data ->> 'avatar_url'
  );
  RETURN new;
END;
$$;
