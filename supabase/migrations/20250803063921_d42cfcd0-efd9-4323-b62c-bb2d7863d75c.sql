-- Insert more diverse teacher data to make the browse teachers dynamic
INSERT INTO teachers (
  name, subject, experience, location, price, rating, reviews, 
  image_url, specialties, languages, verified, response_time
) VALUES
  -- Vocal coaches
  ('Priya Sharma', 'Classical Vocals', '15+ years', 'Mumbai', 1200, 4.9, 127, 
   'https://images.unsplash.com/photo-1494790108755-2616c9e87d54?w=400', 
   ARRAY['Hindustani Classical', 'Bhajans', 'Thumri'], ARRAY['Hindi', 'English'], true, '< 2 hours'),
  
  ('Dr. Raghavan Iyer', 'Carnatic Vocals', '25+ years', 'Chennai', 1500, 5.0, 89, 
   'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400', 
   ARRAY['Carnatic Classical', 'Devotional', 'Ragam Tanam Pallavi'], ARRAY['Tamil', 'English', 'Sanskrit'], true, '< 1 hour'),

  -- Sitar masters
  ('Ustad Rajesh Kumar', 'Sitar', '20+ years', 'Delhi', 1800, 4.8, 156, 
   'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', 
   ARRAY['Hindustani Classical', 'Ragas', 'Alap'], ARRAY['Hindi', 'English', 'Urdu'], true, '< 3 hours'),
  
  ('Smt. Lakshmi Devi', 'Sitar', '18+ years', 'Varanasi', 1400, 4.7, 98, 
   'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400', 
   ARRAY['Classical Ragas', 'Dhrupad Style', 'Meditation Music'], ARRAY['Hindi', 'English'], true, '< 2 hours'),

  -- Tabla experts
  ('Pandit Amit Mishra', 'Tabla', '22+ years', 'Kolkata', 1300, 4.9, 203, 
   'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400', 
   ARRAY['Classical Tabla', 'Solo Performance', 'Accompaniment'], ARRAY['Bengali', 'Hindi', 'English'], true, '< 1 hour'),
  
  ('Zakir Hussain Jr.', 'Tabla', '12+ years', 'Online', 1100, 4.6, 145, 
   'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400', 
   ARRAY['Fusion Tabla', 'World Music', 'Contemporary'], ARRAY['English', 'Hindi'], true, '< 4 hours'),

  -- Flute teachers
  ('Pt. Suresh Chandra', 'Bansuri Flute', '16+ years', 'Rishikesh', 1000, 4.8, 87, 
   'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400', 
   ARRAY['Classical Flute', 'Meditation Music', 'Folk Tunes'], ARRAY['Hindi', 'English'], true, '< 2 hours'),

  -- Harmonium specialists
  ('Smt. Meera Joshi', 'Harmonium', '14+ years', 'Pune', 900, 4.7, 134, 
   'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400', 
   ARRAY['Devotional Music', 'Classical Accompaniment', 'Kirtan'], ARRAY['Marathi', 'Hindi', 'English'], true, '< 3 hours'),

  -- Violin masters
  ('Dr. Kanyakumari Subramanian', 'Violin', '28+ years', 'Madras', 1600, 5.0, 67, 
   'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=400', 
   ARRAY['Carnatic Violin', 'Classical Compositions', 'Improvisation'], ARRAY['Tamil', 'English', 'Telugu'], true, '< 1 hour'),

  -- Sarod teacher
  ('Ustad Ali Ahmed Khan', 'Sarod', '19+ years', 'Lucknow', 1700, 4.9, 76, 
   'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=400', 
   ARRAY['Hindustani Classical', 'Dhrupad', 'Khayal'], ARRAY['Urdu', 'Hindi', 'English'], true, '< 2 hours')

ON CONFLICT (id) DO NOTHING;