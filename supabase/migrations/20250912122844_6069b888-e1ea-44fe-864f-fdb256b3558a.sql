-- Add admin privileges for viewing all data
-- Allow admins to view all profiles
CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 
    FROM public.profiles admin_check 
    WHERE admin_check.id = auth.uid() 
    AND admin_check.role = 'admin'
  )
);

-- Allow admins to view all classrooms
CREATE POLICY "Admins can view all classrooms" 
ON public.classrooms 
FOR SELECT 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 
    FROM public.profiles admin_check 
    WHERE admin_check.id = auth.uid() 
    AND admin_check.role = 'admin'
  )
);

-- Create a direct admin user for immediate access
-- Only run this if no admin exists yet
DO $$
BEGIN
  -- Check if any admin users exist
  IF NOT EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.raw_user_meta_data->>'role' = 'admin'
  ) THEN
    -- Insert a test admin user directly
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      recovery_sent_at,
      last_sign_in_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'admin@soundsync.com',
      crypt('Admin@123', gen_salt('bf')),
      now(),
      now(),
      now(),
      '{"provider": "email", "providers": ["email"]}',
      '{"first_name": "Admin", "last_name": "User", "role": "admin"}',
      now(),
      now(),
      '',
      '',
      '',
      ''
    );
    
    -- Insert the corresponding profile
    INSERT INTO public.profiles (
      id,
      first_name,
      last_name,
      email,
      role,
      email_verified,
      is_active,
      created_at,
      updated_at
    ) 
    SELECT 
      id,
      'Admin',
      'User', 
      'admin@soundsync.com',
      'admin',
      true,
      true,
      now(),
      now()
    FROM auth.users 
    WHERE email = 'admin@soundsync.com'
    AND NOT EXISTS (
      SELECT 1 FROM public.profiles WHERE email = 'admin@soundsync.com'
    );
  END IF;
END $$;