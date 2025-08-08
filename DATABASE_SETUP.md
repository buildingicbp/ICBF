# Database Setup Guide

This guide will help you set up the database tables for the ICBF fitness platform.

## 1. Supabase Database Setup

### Step 1: Create Tables
1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Copy and paste the entire contents of `database-schema.sql`
4. Execute the SQL script

### Step 2: Verify Tables
After running the script, you should see these tables:
- `members` - Member profiles and data
- `trainers` - Trainer profiles and data
- `sessions` - Training sessions
- `workouts` - Member workout records
- `goals` - Member fitness goals

## 2. Table Structure

### Members Table
Stores comprehensive member information:
- **Basic Info**: username, email, contact, full_name
- **Personal Details**: date_of_birth, gender, height, weight
- **Fitness Data**: goals, experience_level, medical_conditions
- **Progress Tracking**: total_workouts, streaks, calories_burned
- **Membership**: membership_type, join_date

### Trainers Table
Stores trainer-specific information:
- **Basic Info**: username, email, contact, full_name
- **Professional Details**: specialization, certifications, experience_years
- **Business Data**: hourly_rate, rating, total_clients
- **Availability**: is_verified, is_available, working_hours
- **Performance**: total_sessions, active_clients

### Sessions Table
Tracks training sessions between trainers and members:
- **Session Details**: type, date, duration, status
- **Feedback**: rating, review
- **Relationships**: trainer_id, member_id

### Workouts Table
Records individual member workouts:
- **Workout Data**: type, date, duration, calories_burned
- **Exercise Details**: exercises (JSONB format)
- **Notes**: additional workout information

### Goals Table
Manages member fitness goals:
- **Goal Info**: type, target_value, current_value, unit
- **Progress**: status, target_date
- **Tracking**: creation and update timestamps

## 3. Security Features

### Row Level Security (RLS)
All tables have RLS enabled with specific policies:

#### Member Policies
- Members can only view/update their own profile
- Members can only access their own workouts and goals

#### Trainer Policies
- Trainers can only view/update their own profile
- Trainers can manage sessions they're involved in

#### Admin Policies
- Admin (`icanbefitter@gmail.com`) can view all data
- Full access to all tables and records

### Data Validation
- Email and username uniqueness constraints
- Gender and status field validation
- Rating range validation (1-5)
- Date and numeric field constraints

## 4. Performance Optimizations

### Indexes
Created indexes for common queries:
- `user_id` lookups
- `email` and `username` searches
- `session_date` and `workout_date` filtering
- `status` filtering for goals

### Triggers
Automatic `updated_at` timestamp updates on all relevant tables.

## 5. Data Flow

### User Registration
1. User signs up with email/password
2. Supabase creates auth user
3. Profile record created in appropriate table (members/trainers)
4. User redirected to role-specific dashboard

### Profile Management
- Members can update their fitness goals, measurements, etc.
- Trainers can update their specializations, rates, availability
- All updates are tracked with timestamps

### Session Management
- Trainers create sessions with members
- Sessions tracked with status (scheduled/active/completed/cancelled)
- Members can rate and review sessions

### Workout Tracking
- Members log their workouts
- Workout data stored with exercise details
- Progress tracked over time

## 6. API Functions

The system provides these database functions:

### Profile Management
- `createMemberProfile()` - Create new member profile
- `createTrainerProfile()` - Create new trainer profile
- `getMemberProfile()` - Fetch member data
- `getTrainerProfile()` - Fetch trainer data
- `updateMemberProfile()` - Update member data
- `updateTrainerProfile()` - Update trainer data

### Data Retrieval
- `getAllMembers()` - Get all members (admin only)
- `getAllTrainers()` - Get all trainers (admin only)

## 7. Usage Examples

### Creating a Member Profile
```typescript
const { data, error } = await createMemberProfile({
  user_id: 'user-uuid',
  username: 'john_doe',
  email: 'john@example.com',
  contact: '+1234567890',
  full_name: 'John Doe'
})
```

### Updating Member Data
```typescript
const { data, error } = await updateMemberProfile(userId, {
  height: 175,
  weight: 70,
  fitness_goals: ['weight_loss', 'strength'],
  experience_level: 'intermediate'
})
```

### Fetching Trainer Profile
```typescript
const { data, error } = await getTrainerProfile(userId)
if (data) {
  console.log('Trainer rating:', data.rating)
  console.log('Total clients:', data.total_clients)
}
```

## 8. Testing

### Test Data Insertion
You can insert test data using the Supabase dashboard:

```sql
-- Insert test member
INSERT INTO members (user_id, username, email, contact, full_name)
VALUES ('test-user-id', 'test_member', 'test@example.com', '+1234567890', 'Test Member');

-- Insert test trainer
INSERT INTO trainers (user_id, username, email, contact, full_name, specialization)
VALUES ('test-trainer-id', 'test_trainer', 'trainer@example.com', '+1234567890', 'Test Trainer', ARRAY['strength', 'cardio']);
```

## 9. Monitoring

### Database Health
Monitor these metrics:
- Table sizes and growth
- Query performance
- RLS policy effectiveness
- Index usage

### Backup Strategy
- Enable automatic backups in Supabase
- Test restore procedures regularly
- Monitor backup success rates

## 10. Troubleshooting

### Common Issues
1. **RLS Policy Errors**: Check user authentication and policy conditions
2. **Unique Constraint Violations**: Ensure email/username uniqueness
3. **Foreign Key Errors**: Verify referenced user exists in auth.users
4. **Permission Denied**: Check admin email configuration

### Debug Queries
```sql
-- Check user profiles
SELECT * FROM members WHERE email = 'user@example.com';
SELECT * FROM trainers WHERE email = 'trainer@example.com';

-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename = 'members';
```

This database setup provides a robust foundation for the ICBF fitness platform with proper security, performance, and scalability. 