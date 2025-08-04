# SoundSync Database Documentation

## Overview
This document provides comprehensive information about all Supabase database tables, their structure, relationships, and Row Level Security (RLS) policies.

## Database Tables

### 1. **profiles** - User Profile Information
Stores comprehensive user profile data for all system users.

**Columns:**
- `id` (uuid, PK) - References auth.users.id
- `first_name` (text) - User's first name
- `last_name` (text) - User's last name  
- `email` (text) - User's email address
- `role` (text) - User role: 'student', 'teacher', 'admin'
- `avatar_url` (text) - Profile picture URL
- `phone` (text) - Contact phone number
- `bio` (text) - User biography
- `date_of_birth` (date) - User's birth date
- `address` (text) - Physical address
- `city` (varchar) - City
- `state` (varchar) - State/Province
- `zip_code` (varchar) - Postal code
- `country` (varchar) - Country (default: 'United States')
- `is_active` (boolean) - Account status
- `email_verified` (boolean) - Email verification status
- `google_id` (text) - Google OAuth ID
- `provider` (text) - Auth provider (default: 'email')
- `music_experience_level` (varchar) - Musical experience level
- `preferred_instruments` (text[]) - Array of preferred instruments
- `learning_goals` (text) - Learning objectives
- `availability` (text) - Available time slots
- `timezone` (varchar) - User timezone
- `emergency_contact_name` (varchar) - Emergency contact name
- `emergency_contact_phone` (varchar) - Emergency contact phone
- `emergency_contact_relationship` (varchar) - Relationship to emergency contact
- `created_at` (timestamptz) - Record creation time
- `updated_at` (timestamptz) - Last update time

**RLS Policies:**
- Users can view their own profile
- Users can update their own profile (except role)
- System can insert profiles 
- Teachers can view student profiles for their classrooms

### 2. **teachers** - Teacher Information
Contains detailed information about music teachers.

**Columns:**
- `id` (uuid, PK) - Unique identifier
- `name` (text) - Teacher's full name
- `subject` (text) - Music subject taught
- `experience` (text) - Years of experience
- `location` (text) - Teaching location
- `image_url` (text) - Profile image URL
- `rating` (numeric) - Average rating (0-5)
- `reviews` (integer) - Number of reviews
- `price` (integer) - Hourly rate in rupees
- `verified` (boolean) - Verification status
- `specialties` (text[]) - Array of specializations
- `response_time` (text) - Typical response time
- `languages` (text[]) - Languages spoken
- `created_at` (timestamptz) - Record creation time
- `updated_at` (timestamptz) - Last update time

**RLS Policies:**
- Anyone can view teachers
- Only admins can manage teachers

### 3. **classrooms** - Group Classes/Courses
Information about group classes offered by teachers.

**Columns:**
- `id` (uuid, PK) - Unique identifier
- `teacher_id` (uuid) - Reference to teacher
- `name` (text) - Class name
- `description` (text) - Class description
- `subject` (text) - Music subject
- `level` (text) - Difficulty level
- `price` (integer) - Course price
- `capacity` (integer) - Maximum students
- `duration_weeks` (integer) - Course duration
- `sessions_per_week` (integer) - Weekly session frequency
- `session_duration_minutes` (integer) - Session length
- `schedule` (text) - Class schedule
- `status` (text) - Class status (default: 'active')
- `image_url` (text) - Class image URL
- `materials` (text[]) - Required materials
- `prerequisites` (text) - Prerequisites
- `created_at` (timestamptz) - Record creation time
- `updated_at` (timestamptz) - Last update time

**RLS Policies:**
- Anyone can view active classrooms
- Teachers can create/update/delete their own classrooms
- Teachers can view their own classrooms

### 4. **music_subjects** - Music Subject Categories
Master list of available music subjects.

**Columns:**
- `id` (uuid, PK) - Unique identifier
- `name` (text) - Subject name
- `icon` (text) - Icon identifier
- `color` (text) - Color code
- `student_count` (integer) - Number of students learning this subject
- `created_at` (timestamptz) - Record creation time

**RLS Policies:**
- Anyone can view music subjects
- Only admins can manage music subjects

### 5. **user_swipes** - User Swipe Actions on Teachers
Tracks user interactions with teacher profiles.

**Columns:**
- `id` (uuid, PK) - Unique identifier
- `user_id` (uuid) - User who swiped
- `teacher_id` (uuid) - Teacher being swiped
- `swipe_direction` (text) - 'left' (pass) or 'right' (like)
- `created_at` (timestamptz) - Swipe timestamp

**RLS Policies:**
- Users can create their own swipes
- Users can view/update/delete their own swipes

### 6. **classroom_swipes** - User Swipe Actions on Classrooms
Tracks user interactions with classroom listings.

**Columns:**
- `id` (uuid, PK) - Unique identifier
- `user_id` (uuid) - User who swiped
- `classroom_id` (uuid) - Classroom being swiped
- `swipe_direction` (text) - 'left' (pass) or 'right' (like)
- `created_at` (timestamptz) - Swipe timestamp

**RLS Policies:**
- Users can create their own classroom swipes
- Users can view their own classroom swipes
- Admins can view all classroom swipes

### 7. **lesson_bookings** - Individual Lesson Bookings
Records for one-on-one lesson bookings between students and teachers.

**Columns:**
- `id` (uuid, PK) - Unique identifier
- `student_id` (uuid) - Student booking the lesson
- `teacher_id` (uuid) - Teacher providing the lesson
- `lesson_date` (timestamptz) - Scheduled lesson date/time
- `lesson_duration` (integer) - Lesson duration in minutes
- `price` (numeric) - Lesson price
- `status` (text) - Booking status ('pending', 'confirmed', 'cancelled')
- `notes` (text) - Additional notes
- `created_at` (timestamptz) - Booking creation time
- `updated_at` (timestamptz) - Last update time

**RLS Policies:**
- Students can create/view/update/delete their own bookings

### 8. **classroom_enrollments** - Classroom Enrollment Records
Tracks student enrollments in group classes.

**Columns:**
- `id` (uuid, PK) - Unique identifier
- `classroom_id` (uuid) - Classroom being enrolled in
- `student_id` (uuid) - Student enrolling
- `enrolled_at` (timestamptz) - Enrollment timestamp
- `status` (text) - Enrollment status (default: 'active')

**RLS Policies:**
- Students can enroll themselves
- Students can view their own enrollments
- Teachers can view their classroom enrollments

### 9. **class_sessions** - Individual Class Sessions
Records for scheduled class sessions within classrooms.

**Columns:**
- `id` (uuid, PK) - Unique identifier
- `classroom_id` (uuid) - Associated classroom
- `teacher_id` (uuid) - Session teacher
- `session_date` (date) - Session date
- `start_time` (time) - Session start time
- `end_time` (time) - Session end time
- `location` (text) - Session location (default: 'Online')
- `status` (text) - Session status (default: 'scheduled')
- `student_count` (integer) - Number of attending students
- `notes` (text) - Session notes
- `created_at` (timestamptz) - Record creation time
- `updated_at` (timestamptz) - Last update time

**RLS Policies:**
- Teachers can create/view/update/delete their own sessions

### 10. **student_preferences** - Student Learning Preferences
Stores student-specific preferences and settings.

**Columns:**
- `id` (uuid, PK) - Unique identifier
- `student_id` (uuid) - Student reference
- `communication_preference` (varchar) - Preferred communication method
- `lesson_duration_preference` (integer) - Preferred lesson duration
- `preferred_lesson_time` (varchar) - Preferred lesson time slots
- `notification_settings` (jsonb) - Notification preferences
- `privacy_settings` (jsonb) - Privacy settings
- `created_at` (timestamptz) - Record creation time
- `updated_at` (timestamptz) - Last update time

**RLS Policies:**
- Students can create/view/update their own preferences

### 11. **student_achievements** - Student Achievement Records
Tracks student accomplishments and milestones.

**Columns:**
- `id` (uuid, PK) - Unique identifier
- `student_id` (uuid) - Student reference
- `title` (varchar) - Achievement title
- `description` (text) - Achievement description
- `category` (varchar) - Achievement category (default: 'general')
- `date_earned` (date) - Date achievement was earned
- `created_at` (timestamptz) - Record creation time

**RLS Policies:**
- Students can create/view/update/delete their own achievements

### 12. **site_stats** - Website Statistics
General website statistics and metrics.

**Columns:**
- `id` (uuid, PK) - Unique identifier
- `label` (text) - Statistic label
- `value` (text) - Statistic value
- `display_order` (integer) - Display order
- `created_at` (timestamptz) - Record creation time
- `updated_at` (timestamptz) - Last update time

**RLS Policies:**
- Anyone can view site stats
- Only admins can manage site stats

### 13. **admin_stats** - Administrative Statistics
Administrative metrics for system monitoring.

**Columns:**
- `id` (uuid, PK) - Unique identifier
- `metric_name` (text) - Metric name
- `metric_category` (text) - Metric category
- `metric_value` (numeric) - Metric value
- `created_at` (timestamptz) - Record creation time
- `updated_at` (timestamptz) - Last update time

**RLS Policies:**
- Only admins can view/manage admin stats

## Database Functions

### User Management Functions
- `handle_new_user()` - Creates profile on user signup
- `handle_user_email_confirmed()` - Updates profile on email confirmation
- `get_user_role(user_id)` - Returns user's role
- `is_teacher(user_id)` - Checks if user is a teacher
- `is_student(user_id)` - Checks if user is a student
- `assign_user_role(user_id, role)` - Assigns role to user (admin only)
- `register_teacher(user_id, teacher_data)` - Registers user as teacher

### Utility Functions
- `update_updated_at_column()` - Updates updated_at timestamp
- `update_student_preferences_updated_at()` - Updates student preferences timestamp

## Payment Flow

### Post-Payment Process
When a user completes payment through Stripe:

1. **Payment Creation**: User initiates payment via `create-payment` edge function
2. **Stripe Checkout**: User completes payment on Stripe's hosted page
3. **Payment Verification**: `verify-payment` edge function processes the result
4. **Database Update**: Booking status updated to 'confirmed' or 'cancelled'
5. **Email Notification**: Confirmation email sent via `send-payment-confirmation`

### Payment States
- **pending** - Initial booking state before payment
- **confirmed** - Payment successful, lesson confirmed
- **cancelled** - Payment failed or cancelled

## Security

### Row Level Security (RLS)
All tables have RLS enabled with appropriate policies:
- Users can only access their own data
- Teachers can access their classroom/student data
- Admins have broader access for management
- Public data (teachers, music subjects) accessible to all

### Authentication
- Supabase Auth integration
- Email/password and Google OAuth support
- JWT-based session management
- Profile auto-creation on signup

## Edge Functions

### Payment Functions
- `create-payment` - Creates Stripe checkout session
- `verify-payment` - Verifies payment completion
- `send-payment-confirmation` - Sends confirmation emails

### Function Secrets
- `STRIPE_SECRET_KEY` - Stripe API key
- `RESEND_API_KEY` - Email service key
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_ANON_KEY` - Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key
- `SUPABASE_DB_URL` - Database connection URL

## Data Relationships

### Key Relationships
- `profiles.id` → `auth.users.id` (1:1)
- `teachers.id` → `profiles.id` (1:1 for teacher profiles)
- `classrooms.teacher_id` → `teachers.id` (1:many)
- `user_swipes.user_id` → `profiles.id` (1:many)
- `user_swipes.teacher_id` → `teachers.id` (1:many)
- `classroom_swipes.user_id` → `profiles.id` (1:many)
- `classroom_swipes.classroom_id` → `classrooms.id` (1:many)
- `lesson_bookings.student_id` → `profiles.id` (1:many)
- `lesson_bookings.teacher_id` → `teachers.id` (1:many)
- `classroom_enrollments.student_id` → `profiles.id` (1:many)
- `classroom_enrollments.classroom_id` → `classrooms.id` (1:many)

### Data Flow
1. User signs up → Profile created automatically
2. User browses teachers/classrooms → Swipe actions recorded
3. User likes teacher/classroom → Payment flow initiated
4. Payment completed → Booking/enrollment confirmed
5. Lessons/classes scheduled → Sessions tracked

## Backup and Maintenance

### Regular Maintenance
- Monitor RLS policy effectiveness
- Review payment transaction logs
- Clean up old swipe data (optional)
- Update teacher ratings based on reviews
- Sync student counts in music_subjects

### Performance Considerations
- Index on frequently queried fields (user_id, teacher_id, etc.)
- Optimize swipe queries with proper indexing
- Monitor payment function performance
- Regular database statistics updates