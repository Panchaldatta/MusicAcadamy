# Data Dictionary

## Overview
This document provides detailed information about all database tables, columns, data types, and relationships in the SoundSync application.

## Tables

### profiles
**Description**: Stores user profile information for students, teachers, and administrators.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | No | - | Primary key, references auth.users |
| first_name | text | Yes | - | User's first name |
| last_name | text | Yes | - | User's last name |
| email | text | Yes | - | User's email address |
| role | text | Yes | 'student' | User role (student, teacher, admin) |
| phone | text | Yes | - | Contact phone number |
| bio | text | Yes | - | User biography |
| avatar_url | text | Yes | - | Profile picture URL |
| date_of_birth | date | Yes | - | User's birth date |
| address | text | Yes | - | Street address |
| city | varchar | Yes | - | City |
| state | varchar | Yes | - | State/Province |
| zip_code | varchar | Yes | - | Postal code |
| country | varchar | Yes | 'United States' | Country |
| emergency_contact_name | varchar | Yes | - | Emergency contact full name |
| emergency_contact_phone | varchar | Yes | - | Emergency contact phone |
| emergency_contact_relationship | varchar | Yes | - | Relationship to emergency contact |
| music_experience_level | varchar | Yes | 'beginner' | Experience level (beginner, intermediate, advanced) |
| preferred_instruments | text[] | Yes | - | Array of preferred instruments |
| learning_goals | text | Yes | - | Student's learning objectives |
| availability | text | Yes | - | Available time slots |
| timezone | varchar | Yes | 'America/New_York' | User's timezone |
| is_active | boolean | Yes | true | Account status |
| email_verified | boolean | Yes | false | Email verification status |
| google_id | text | Yes | - | Google OAuth ID |
| provider | text | Yes | 'email' | Authentication provider |
| created_at | timestamptz | No | now() | Record creation timestamp |
| updated_at | timestamptz | No | now() | Last update timestamp |

### teachers
**Description**: Additional information specific to teacher profiles.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | No | gen_random_uuid() | Primary key |
| name | text | No | - | Teacher's display name |
| subject | text | No | - | Primary subject taught |
| experience | text | No | - | Years of experience |
| location | text | No | - | Teaching location |
| price | integer | No | - | Hourly rate in cents |
| image_url | text | Yes | - | Profile image URL |
| specialties | text[] | No | '{}' | Array of teaching specialties |
| languages | text[] | No | '{}' | Languages spoken |
| response_time | text | No | '< 1 hour' | Average response time |
| rating | numeric | No | 0 | Average rating (0-5) |
| reviews | integer | No | 0 | Number of reviews |
| verified | boolean | Yes | false | Verification status |
| created_at | timestamptz | No | now() | Record creation timestamp |
| updated_at | timestamptz | No | now() | Last update timestamp |

### classrooms
**Description**: Group classes offered by teachers.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | No | gen_random_uuid() | Primary key |
| teacher_id | uuid | No | - | Foreign key to teachers table |
| name | text | No | - | Classroom name |
| subject | text | No | - | Subject being taught |
| level | text | No | - | Difficulty level |
| description | text | Yes | - | Detailed description |
| schedule | text | No | - | Class schedule |
| price | integer | No | 0 | Price per student in cents |
| capacity | integer | No | 20 | Maximum number of students |
| duration_weeks | integer | Yes | 12 | Course duration in weeks |
| sessions_per_week | integer | Yes | 2 | Number of sessions per week |
| session_duration_minutes | integer | Yes | 60 | Duration of each session |
| materials | text[] | Yes | - | Required materials |
| prerequisites | text | Yes | - | Course prerequisites |
| status | text | No | 'active' | Status (active, inactive, completed) |
| image_url | text | Yes | - | Classroom image URL |
| created_at | timestamptz | No | now() | Record creation timestamp |
| updated_at | timestamptz | No | now() | Last update timestamp |

### music_subjects
**Description**: Master list of music subjects and instruments.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | No | gen_random_uuid() | Primary key |
| name | text | No | - | Subject name |
| icon | text | No | - | Icon identifier |
| color | text | No | - | Color theme |
| student_count | integer | No | 0 | Number of students learning this subject |
| created_at | timestamptz | No | now() | Record creation timestamp |

### gov_exam_roadmaps
**Description**: Structured preparation plans for government examinations.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | No | gen_random_uuid() | Primary key |
| exam_name | text | No | - | Name of the examination |
| category | text | No | - | Exam category |
| description | text | Yes | - | Detailed description |
| duration_months | integer | No | 12 | Preparation duration in months |
| difficulty_level | text | No | 'intermediate' | Difficulty level |
| syllabus | jsonb | Yes | - | Detailed syllabus structure |
| milestones | jsonb | Yes | - | Study milestones and checkpoints |
| resources | jsonb | Yes | - | Study resources and materials |
| is_active | boolean | No | true | Active status |
| created_at | timestamptz | No | now() | Record creation timestamp |
| updated_at | timestamptz | No | now() | Last update timestamp |

### user_roadmap_progress
**Description**: Tracks user progress through government exam roadmaps.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | No | gen_random_uuid() | Primary key |
| user_id | uuid | No | - | Foreign key to profiles table |
| roadmap_id | uuid | No | - | Foreign key to gov_exam_roadmaps table |
| current_milestone | integer | No | 1 | Current milestone number |
| completed_milestones | jsonb | Yes | '[]' | Array of completed milestone IDs |
| started_at | timestamptz | No | now() | When user started the roadmap |
| last_updated | timestamptz | No | now() | Last progress update |

### lesson_bookings
**Description**: One-on-one lesson bookings between students and teachers.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | No | gen_random_uuid() | Primary key |
| student_id | uuid | No | - | Foreign key to profiles table |
| teacher_id | uuid | No | - | Foreign key to teachers table |
| lesson_date | timestamptz | No | - | Scheduled lesson date and time |
| lesson_duration | integer | No | 60 | Lesson duration in minutes |
| price | numeric | No | - | Lesson price |
| status | text | No | 'pending' | Booking status |
| notes | text | Yes | - | Additional notes |
| created_at | timestamptz | No | now() | Record creation timestamp |
| updated_at | timestamptz | No | now() | Last update timestamp |

### classroom_enrollments
**Description**: Student enrollments in group classes.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | No | gen_random_uuid() | Primary key |
| classroom_id | uuid | No | - | Foreign key to classrooms table |
| student_id | uuid | No | - | Foreign key to profiles table |
| enrolled_at | timestamptz | No | now() | Enrollment timestamp |
| status | text | No | 'active' | Enrollment status |

### class_sessions
**Description**: Individual sessions within group classes.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | No | gen_random_uuid() | Primary key |
| classroom_id | uuid | No | - | Foreign key to classrooms table |
| teacher_id | uuid | No | - | Foreign key to teachers table |
| session_date | date | No | - | Session date |
| start_time | time | No | - | Session start time |
| end_time | time | No | - | Session end time |
| location | text | No | 'Online' | Session location |
| status | text | No | 'scheduled' | Session status |
| student_count | integer | No | 0 | Number of attending students |
| notes | text | Yes | - | Session notes |
| created_at | timestamptz | No | now() | Record creation timestamp |
| updated_at | timestamptz | No | now() | Last update timestamp |

### user_swipes
**Description**: User swipe interactions with teacher profiles.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | No | gen_random_uuid() | Primary key |
| user_id | uuid | No | - | Foreign key to profiles table |
| teacher_id | uuid | No | - | Foreign key to teachers table |
| swipe_direction | text | No | - | Direction ('left' or 'right') |
| created_at | timestamptz | No | now() | Swipe timestamp |

### classroom_swipes
**Description**: User swipe interactions with classroom profiles.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | No | gen_random_uuid() | Primary key |
| user_id | uuid | No | - | Foreign key to profiles table |
| classroom_id | uuid | No | - | Foreign key to classrooms table |
| swipe_direction | text | No | - | Direction ('left' or 'right') |
| created_at | timestamptz | No | now() | Swipe timestamp |

### student_preferences
**Description**: Student-specific learning preferences and settings.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | No | gen_random_uuid() | Primary key |
| student_id | uuid | No | - | Foreign key to profiles table |
| communication_preference | varchar | Yes | 'email' | Preferred communication method |
| preferred_lesson_time | varchar | Yes | - | Preferred lesson time |
| lesson_duration_preference | integer | Yes | 60 | Preferred lesson duration |
| notification_settings | jsonb | Yes | {...} | Notification preferences |
| privacy_settings | jsonb | Yes | {...} | Privacy settings |
| created_at | timestamptz | No | now() | Record creation timestamp |
| updated_at | timestamptz | No | now() | Last update timestamp |

### student_achievements
**Description**: Student accomplishments and badges.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | No | gen_random_uuid() | Primary key |
| student_id | uuid | No | - | Foreign key to profiles table |
| title | varchar | No | - | Achievement title |
| description | text | Yes | - | Achievement description |
| category | varchar | Yes | 'general' | Achievement category |
| date_earned | date | No | - | Date achievement was earned |
| created_at | timestamptz | No | now() | Record creation timestamp |

### site_stats
**Description**: Public website statistics.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | No | gen_random_uuid() | Primary key |
| label | text | No | - | Statistic label |
| value | text | No | - | Statistic value |
| display_order | integer | No | 0 | Display order |
| created_at | timestamptz | No | now() | Record creation timestamp |
| updated_at | timestamptz | No | now() | Last update timestamp |

### admin_stats
**Description**: Administrative metrics and analytics.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | No | gen_random_uuid() | Primary key |
| metric_name | text | No | - | Metric name |
| metric_category | text | No | - | Metric category |
| metric_value | numeric | No | 0 | Metric value |
| created_at | timestamptz | No | now() | Record creation timestamp |
| updated_at | timestamptz | No | now() | Last update timestamp |

## Data Types Reference

- **uuid**: Universally unique identifier
- **text**: Variable-length text
- **varchar**: Variable-length character string with limit
- **integer**: 32-bit integer
- **numeric**: Arbitrary precision number
- **boolean**: True/false value
- **date**: Date (no time)
- **time**: Time of day (no date)
- **timestamptz**: Timestamp with timezone
- **jsonb**: Binary JSON data
- **text[]**: Array of text values

## Constraints and Indexes

- All tables have primary keys on `id` columns
- Foreign key relationships maintain referential integrity
- Row Level Security (RLS) policies control data access
- Timestamps automatically update on record changes
- Default values ensure data consistency