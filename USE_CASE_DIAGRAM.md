# Use Case Diagram

## Overview
This document describes the use cases and interactions between different actors in the SoundSync application.

<lov-mermaid>
graph TB
    %% Actors
    Student[👨‍🎓 Student]
    Teacher[👨‍🏫 Teacher]  
    Admin[👨‍💼 Admin]
    System[🖥️ System]

    %% Student Use Cases
    Student --> UC1[Browse Teachers]
    Student --> UC2[Swipe on Teachers]
    Student --> UC3[Book Individual Lessons]
    Student --> UC4[Browse Classrooms]
    Student --> UC5[Enroll in Group Classes]
    Student --> UC6[Track Learning Progress]
    Student --> UC7[Manage Profile]
    Student --> UC8[Set Preferences]
    Student --> UC9[View Achievements]
    Student --> UC10[Access Gov Exam Roadmaps]
    Student --> UC11[Track Roadmap Progress]
    Student --> UC12[Complete Milestones]

    %% Teacher Use Cases
    Teacher --> UC13[Manage Profile]
    Teacher --> UC14[Create Classrooms]
    Teacher --> UC15[Manage Class Sessions]
    Teacher --> UC16[View Student Enrollments]
    Teacher --> UC17[Schedule Individual Lessons]
    Teacher --> UC18[View Analytics]
    Teacher --> UC19[Update Availability]
    Teacher --> UC20[Manage Pricing]

    %% Admin Use Cases
    Admin --> UC21[Manage Users]
    Admin --> UC22[Assign User Roles]
    Admin --> UC23[View Site Statistics]
    Admin --> UC24[Manage Teachers]
    Admin --> UC25[Manage Music Subjects]
    Admin --> UC26[Create Gov Exam Roadmaps]
    Admin --> UC27[Manage Roadmap Content]
    Admin --> UC28[View System Analytics]

    %% System Use Cases
    System --> UC29[Send Notifications]
    System --> UC30[Process Payments]
    System --> UC31[Update Statistics]
    System --> UC32[Backup Data]
    System --> UC33[Verify Email]
    System --> UC34[Handle Authentication]

    %% Use Case Details
    subgraph "Authentication & Profile Management"
        UC1
        UC7
        UC13
        UC34
        UC33
    end

    subgraph "Learning & Teaching"
        UC2
        UC3
        UC4
        UC5
        UC14
        UC15
        UC17
    end

    subgraph "Progress Tracking"
        UC6
        UC9
        UC10
        UC11
        UC12
        UC18
    end

    subgraph "Administration"
        UC21
        UC22
        UC23
        UC24
        UC25
        UC26
        UC27
        UC28
    end

    subgraph "System Operations"
        UC29
        UC30
        UC31
        UC32
    end

    %% Relationships
    UC3 -.-> UC30 : includes
    UC5 -.-> UC30 : includes
    UC2 -.-> UC1 : extends
    UC12 -.-> UC11 : extends
    UC15 -.-> UC14 : extends
    UC20 -.-> UC13 : extends
</lov-mermaid>

## Use Case Descriptions

### Student Use Cases

**UC1: Browse Teachers**
- **Actor**: Student
- **Description**: Student can browse and filter available teachers by subject, price, location, and rating
- **Preconditions**: User is logged in as student
- **Flow**: Access teacher directory → Apply filters → View teacher profiles → Save favorites

**UC2: Swipe on Teachers** 
- **Actor**: Student
- **Description**: Student can swipe left (dislike) or right (like) on teacher profiles
- **Preconditions**: User is logged in, teachers available
- **Flow**: View teacher card → Swipe left/right → Record preference → Show next teacher

**UC3: Book Individual Lessons**
- **Actor**: Student
- **Description**: Student can book one-on-one lessons with teachers
- **Preconditions**: Student profile complete, payment method available
- **Flow**: Select teacher → Choose time slot → Enter details → Process payment → Confirm booking

**UC4: Browse Classrooms**
- **Actor**: Student  
- **Description**: Student can explore available group classes
- **Preconditions**: User is logged in
- **Flow**: View classroom listings → Filter by subject/level → View details → Check availability

**UC5: Enroll in Group Classes**
- **Actor**: Student
- **Description**: Student can enroll in group classes
- **Preconditions**: Classroom has capacity, payment method available
- **Flow**: Select classroom → Review details → Process payment → Confirm enrollment

**UC6: Track Learning Progress**
- **Actor**: Student
- **Description**: Student can view their learning achievements and progress
- **Preconditions**: User has learning activities
- **Flow**: Access dashboard → View progress metrics → Review achievements → Set new goals

**UC10: Access Gov Exam Roadmaps**
- **Actor**: Student
- **Description**: Student can browse and start government exam preparation roadmaps
- **Preconditions**: User is logged in
- **Flow**: Browse roadmaps → Filter by category → View details → Start roadmap

**UC11: Track Roadmap Progress**
- **Actor**: Student
- **Description**: Student can monitor their progress through exam preparation roadmaps
- **Preconditions**: User has started a roadmap
- **Flow**: Access progress view → Review completed milestones → View current status

### Teacher Use Cases

**UC13: Manage Profile**
- **Actor**: Teacher
- **Description**: Teacher can update their professional profile information
- **Preconditions**: User is verified teacher
- **Flow**: Access profile → Edit information → Upload credentials → Save changes

**UC14: Create Classrooms**
- **Actor**: Teacher
- **Description**: Teacher can create new group classes
- **Preconditions**: Teacher profile is complete and verified
- **Flow**: Access classroom management → Enter class details → Set schedule → Publish classroom

**UC15: Manage Class Sessions**
- **Actor**: Teacher
- **Description**: Teacher can schedule, update, and manage individual class sessions
- **Preconditions**: Classroom exists
- **Flow**: View classroom → Schedule sessions → Update attendance → Add notes

**UC18: View Analytics**
- **Actor**: Teacher
- **Description**: Teacher can view their performance analytics and metrics
- **Preconditions**: Teacher has teaching activities
- **Flow**: Access analytics dashboard → Review metrics → Generate reports

### Admin Use Cases

**UC21: Manage Users**
- **Actor**: Admin
- **Description**: Admin can view, activate, deactivate, and manage user accounts
- **Preconditions**: User has admin privileges
- **Flow**: Access user management → Search users → Perform actions → Log changes

**UC22: Assign User Roles**
- **Actor**: Admin
- **Description**: Admin can assign and modify user roles
- **Preconditions**: User has admin privileges
- **Flow**: Select user → Choose new role → Confirm assignment → Notify user

**UC26: Create Gov Exam Roadmaps**
- **Actor**: Admin
- **Description**: Admin can create structured preparation plans for government examinations
- **Preconditions**: Admin access, content expertise
- **Flow**: Create roadmap → Define milestones → Add resources → Publish

## Actor Relationships

### Primary Actors
- **Student**: Primary user who consumes educational content
- **Teacher**: Content provider and educator
- **Admin**: System administrator with full access

### Secondary Actors  
- **System**: Automated processes and integrations
- **Payment Gateway**: External payment processing
- **Email Service**: Notification delivery system

## Use Case Priorities

### High Priority
- User authentication and profile management
- Teacher-student matching and booking
- Payment processing
- Basic classroom functionality

### Medium Priority
- Advanced analytics and reporting
- Government exam roadmaps
- Achievement tracking
- Notification system

### Low Priority
- Advanced search and filtering
- Automated recommendations
- Integration with external learning platforms
- Mobile app features