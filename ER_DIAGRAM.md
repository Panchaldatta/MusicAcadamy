# Entity Relationship Diagram

## Overview
This document illustrates the database schema and relationships between entities in the SoundSync application.

<lov-mermaid>
erDiagram
    %% Core User Management
    PROFILES {
        uuid id PK
        text first_name
        text last_name
        text email
        text role
        text phone
        text bio
        text avatar_url
        date date_of_birth
        text address
        varchar city
        varchar state
        varchar zip_code
        varchar country
        varchar emergency_contact_name
        varchar emergency_contact_phone
        varchar emergency_contact_relationship
        varchar music_experience_level
        text_array preferred_instruments
        text learning_goals
        text availability
        varchar timezone
        boolean is_active
        boolean email_verified
        text google_id
        text provider
        timestamptz created_at
        timestamptz updated_at
    }

    TEACHERS {
        uuid id PK
        text name
        text subject
        text experience
        text location
        integer price
        text image_url
        text_array specialties
        text_array languages
        text response_time
        numeric rating
        integer reviews
        boolean verified
        timestamptz created_at
        timestamptz updated_at
    }

    %% Learning Content
    MUSIC_SUBJECTS {
        uuid id PK
        text name
        text icon
        text color
        integer student_count
        timestamptz created_at
    }

    CLASSROOMS {
        uuid id PK
        uuid teacher_id FK
        text name
        text subject
        text level
        text description
        text schedule
        integer price
        integer capacity
        integer duration_weeks
        integer sessions_per_week
        integer session_duration_minutes
        text_array materials
        text prerequisites
        text status
        text image_url
        timestamptz created_at
        timestamptz updated_at
    }

    CLASS_SESSIONS {
        uuid id PK
        uuid classroom_id FK
        uuid teacher_id FK
        date session_date
        time start_time
        time end_time
        text location
        text status
        integer student_count
        text notes
        timestamptz created_at
        timestamptz updated_at
    }

    %% Government Exam Roadmaps
    GOV_EXAM_ROADMAPS {
        uuid id PK
        text exam_name
        text category
        text description
        integer duration_months
        text difficulty_level
        jsonb syllabus
        jsonb milestones
        jsonb resources
        boolean is_active
        timestamptz created_at
        timestamptz updated_at
    }

    USER_ROADMAP_PROGRESS {
        uuid id PK
        uuid user_id FK
        uuid roadmap_id FK
        integer current_milestone
        jsonb completed_milestones
        timestamptz started_at
        timestamptz last_updated
    }

    %% Bookings and Enrollments
    LESSON_BOOKINGS {
        uuid id PK
        uuid student_id FK
        uuid teacher_id FK
        timestamptz lesson_date
        integer lesson_duration
        numeric price
        text status
        text notes
        timestamptz created_at
        timestamptz updated_at
    }

    CLASSROOM_ENROLLMENTS {
        uuid id PK
        uuid classroom_id FK
        uuid student_id FK
        timestamptz enrolled_at
        text status
    }

    %% User Interactions
    USER_SWIPES {
        uuid id PK
        uuid user_id FK
        uuid teacher_id FK
        text swipe_direction
        timestamptz created_at
    }

    CLASSROOM_SWIPES {
        uuid id PK
        uuid user_id FK
        uuid classroom_id FK
        text swipe_direction
        timestamptz created_at
    }

    %% Student Data
    STUDENT_PREFERENCES {
        uuid id PK
        uuid student_id FK
        varchar communication_preference
        varchar preferred_lesson_time
        integer lesson_duration_preference
        jsonb notification_settings
        jsonb privacy_settings
        timestamptz created_at
        timestamptz updated_at
    }

    STUDENT_ACHIEVEMENTS {
        uuid id PK
        uuid student_id FK
        varchar title
        text description
        varchar category
        date date_earned
        timestamptz created_at
    }

    %% System Data
    SITE_STATS {
        uuid id PK
        text label
        text value
        integer display_order
        timestamptz created_at
        timestamptz updated_at
    }

    ADMIN_STATS {
        uuid id PK
        text metric_name
        text metric_category
        numeric metric_value
        timestamptz created_at
        timestamptz updated_at
    }

    %% Relationships
    PROFILES ||--o{ TEACHERS : "teacher_profile"
    PROFILES ||--o{ USER_SWIPES : "user_swipes"
    PROFILES ||--o{ CLASSROOM_SWIPES : "user_classroom_swipes"
    PROFILES ||--o{ LESSON_BOOKINGS : "student_bookings"
    PROFILES ||--o{ CLASSROOM_ENROLLMENTS : "student_enrollments"
    PROFILES ||--o{ STUDENT_PREFERENCES : "student_preferences"
    PROFILES ||--o{ STUDENT_ACHIEVEMENTS : "student_achievements"
    PROFILES ||--o{ USER_ROADMAP_PROGRESS : "user_progress"

    TEACHERS ||--o{ CLASSROOMS : "teaches"
    TEACHERS ||--o{ USER_SWIPES : "teacher_swipes"
    TEACHERS ||--o{ LESSON_BOOKINGS : "teacher_bookings"
    TEACHERS ||--o{ CLASS_SESSIONS : "teacher_sessions"

    CLASSROOMS ||--o{ CLASSROOM_ENROLLMENTS : "classroom_students"
    CLASSROOMS ||--o{ CLASSROOM_SWIPES : "classroom_swipes"
    CLASSROOMS ||--o{ CLASS_SESSIONS : "classroom_sessions"

    GOV_EXAM_ROADMAPS ||--o{ USER_ROADMAP_PROGRESS : "roadmap_progress"
</lov-mermaid>

## Relationship Details

### Core Relationships

**PROFILES → TEACHERS (1:0..1)**
- A profile can have at most one teacher record
- Teacher records extend profile data for users with teacher role
- Relationship: `teachers.id = profiles.id`

**TEACHERS → CLASSROOMS (1:N)**
- A teacher can create multiple classrooms
- Each classroom belongs to exactly one teacher
- Relationship: `classrooms.teacher_id = teachers.id`

**CLASSROOMS → CLASS_SESSIONS (1:N)**
- A classroom can have multiple scheduled sessions
- Each session belongs to exactly one classroom
- Relationship: `class_sessions.classroom_id = classrooms.id`

### Student Relationships

**PROFILES → LESSON_BOOKINGS (1:N)**
- A student can book multiple individual lessons
- Each booking has one student and one teacher
- Relationships: 
  - `lesson_bookings.student_id = profiles.id`
  - `lesson_bookings.teacher_id = teachers.id`

**PROFILES → CLASSROOM_ENROLLMENTS (1:N)**
- A student can enroll in multiple classrooms
- Each enrollment links one student to one classroom
- Relationships:
  - `classroom_enrollments.student_id = profiles.id`
  - `classroom_enrollments.classroom_id = classrooms.id`

**PROFILES → STUDENT_PREFERENCES (1:0..1)**
- A student profile can have one set of preferences
- Relationship: `student_preferences.student_id = profiles.id`

**PROFILES → STUDENT_ACHIEVEMENTS (1:N)**
- A student can earn multiple achievements
- Relationship: `student_achievements.student_id = profiles.id`

### Interaction Relationships

**PROFILES → USER_SWIPES (1:N)**
- A user can swipe on multiple teachers
- Each swipe records user preference for a teacher
- Relationships:
  - `user_swipes.user_id = profiles.id`
  - `user_swipes.teacher_id = teachers.id`

**PROFILES → CLASSROOM_SWIPES (1:N)**
- A user can swipe on multiple classrooms
- Each swipe records user preference for a classroom
- Relationships:
  - `classroom_swipes.user_id = profiles.id`
  - `classroom_swipes.classroom_id = classrooms.id`

### Government Exam Roadmap Relationships

**GOV_EXAM_ROADMAPS → USER_ROADMAP_PROGRESS (1:N)**
- A roadmap can be started by multiple users
- Each progress record tracks one user's journey through one roadmap
- Relationships:
  - `user_roadmap_progress.user_id = profiles.id`
  - `user_roadmap_progress.roadmap_id = gov_exam_roadmaps.id`

## Key Constraints

### Primary Keys
- All tables use UUID primary keys
- UUIDs are generated using `gen_random_uuid()`

### Foreign Keys
- All foreign key relationships maintain referential integrity
- Cascade rules protect data consistency
- Some relationships allow null values for optional connections

### Unique Constraints
- Email addresses are unique across profiles
- User can only have one swipe per teacher/classroom
- User can only enroll once per classroom

### Check Constraints
- Ratings must be between 0 and 5
- Prices must be positive values
- Dates must be logical (end_time > start_time)
- Status fields have predefined valid values

## Indexes

### Performance Indexes
- `profiles.email` - for authentication lookups
- `teachers.subject` - for subject-based filtering
- `classrooms.teacher_id` - for teacher's classroom queries
- `user_swipes.user_id` - for user preference queries
- `lesson_bookings.student_id` - for student booking history
- `classroom_enrollments.classroom_id` - for enrollment counts

### Composite Indexes
- `(user_id, teacher_id)` on user_swipes - for duplicate prevention
- `(user_id, classroom_id)` on classroom_swipes - for duplicate prevention
- `(student_id, classroom_id)` on classroom_enrollments - for enrollment checks

## Data Integrity Rules

### Row Level Security (RLS)
- Users can only access their own data
- Teachers can access their students' data through enrollments
- Admins have full access to manage system data
- Public data (like teacher profiles) is accessible to all authenticated users

### Audit Trail
- All tables include `created_at` timestamps
- Most tables include `updated_at` timestamps with automatic updates
- Critical operations are logged for compliance and debugging

### Data Validation
- Email format validation
- Phone number format validation
- Price and rating range validation
- Status field enumeration validation