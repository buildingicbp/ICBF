# Trainer-Member Interaction Feature

This document describes the new trainer-member interaction functionality that allows trainers to view member details and add daily actions that appear on the member dashboard.

## Features Implemented

### 1. Trainer Dashboard Enhancements
- **Clickable Member Cards**: Trainers can now click on any assigned member to view detailed information
- **Member Details Modal**: Comprehensive view of member information including:
  - Personal information (email, contact, age, gender)
  - Physical stats (height, weight, workout history)
  - Fitness goals and medical conditions
  - Training history and streaks

### 2. Daily Actions System
- **Action Creation**: Trainers can create daily actions for their members
- **Action Types**: 
  - Workout Plan
  - Diet Advice
  - Progress Note
  - Motivation
  - Reminder
  - Other
- **Priority Levels**: High, Medium, Low
- **Visibility Control**: Trainers can choose whether actions are visible to members

### 3. Member Dashboard Integration
- **Trainer Messages Card**: New section showing trainer actions
- **Real-time Updates**: Actions appear immediately on member dashboard
- **Action Details**: Shows action type, priority, date, and trainer information

## Database Schema

### New Table: `trainer_actions`
```sql
CREATE TABLE trainer_actions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  trainer_id UUID NOT NULL,
  member_id UUID REFERENCES members(id) ON DELETE CASCADE,
  action_date DATE NOT NULL DEFAULT CURRENT_DATE,
  action_type TEXT CHECK (action_type IN ('workout_plan', 'diet_advice', 'progress_note', 'motivation', 'reminder', 'other')) DEFAULT 'other',
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  priority TEXT CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
  is_visible_to_member BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_trainer_actions_trainer FOREIGN KEY (trainer_id) REFERENCES trainer_accounts(id) ON DELETE CASCADE
);
```

## API Endpoints

### 1. Trainer Actions Management
- **GET** `/api/trainer-actions` - Fetch trainer actions
  - Query params: `trainer_email`, `member_id`, `action_date`
- **POST** `/api/trainer-actions` - Create new trainer action

### 2. Member-Specific Actions
- **GET** `/api/trainer-actions/member/[memberId]` - Fetch actions for specific member
  - Query params: `limit`

### 3. Member Profile
- **GET** `/api/member-profile` - Fetch current user's member profile

## Components Created

### 1. MemberDetailsModal (`/components/member-details-modal.tsx`)
- Comprehensive member information display
- Tabbed interface (Details, Actions, New Action)
- Action creation form
- Action history view

### 2. TrainerActionsCard (`/components/trainer-actions-card.tsx`)
- Displays trainer messages on member dashboard
- Action type icons and priority badges
- Expandable list with "Show All" functionality

## Setup Instructions

### 1. Database Setup
Run the following SQL file to create the trainer_actions table:
```bash
# Execute the SQL file in your Supabase dashboard or via CLI
psql -f create-trainer-actions-table.sql
```

### 2. Required Dependencies
The implementation uses existing dependencies. Ensure these are installed:
- `@supabase/auth-helpers-nextjs`
- `lucide-react`
- All existing UI components

### 3. Environment Variables
No additional environment variables required. Uses existing Supabase configuration.

## Usage Flow

### For Trainers:
1. Login to trainer dashboard
2. View assigned members in the "My Assigned Members" section
3. Click on any member card to open detailed view
4. Navigate through tabs to view member info, past actions, or create new actions
5. Fill out the action form with type, priority, title, and description
6. Choose visibility (visible to member or private)
7. Submit action

### For Members:
1. Login to member dashboard
2. View "Trainer Messages" card in the right sidebar
3. See latest actions from assigned trainer
4. Click "View All" to see complete history
5. Actions show type, priority, date, and trainer information

## Security Features

### Row Level Security (RLS)
- Trainers can only view/create actions for their assigned members
- Members can only view actions marked as visible to them
- Admin can view all actions
- Service role has full access for system operations

### Data Validation
- Required fields validation on both frontend and backend
- Action type and priority constraints
- Trainer-member assignment verification before action creation

## File Structure
```
/app/api/
├── trainer-actions/
│   ├── route.ts
│   └── member/[memberId]/route.ts
└── member-profile/route.ts

/components/
├── member-details-modal.tsx
└── trainer-actions-card.tsx

/app/
├── trainer-dashboard/page.tsx (updated)
└── member-dashboard/page.tsx (updated)

create-trainer-actions-table.sql
```

## Testing Checklist

- [ ] Trainer can click on member cards
- [ ] Member details modal opens with correct information
- [ ] Trainer can create actions with all field types
- [ ] Actions appear on member dashboard immediately
- [ ] Privacy settings work (visible/hidden actions)
- [ ] Action history displays correctly
- [ ] Database constraints prevent unauthorized access
- [ ] Error handling works for invalid requests

## Future Enhancements

### Potential Improvements:
1. **Real-time Notifications**: WebSocket integration for instant action notifications
2. **Action Templates**: Pre-defined action templates for common scenarios
3. **File Attachments**: Allow trainers to attach workout plans or diet charts
4. **Member Responses**: Allow members to respond to trainer actions
5. **Action Scheduling**: Schedule actions for future dates
6. **Analytics Dashboard**: Track action engagement and member progress
7. **Mobile Optimization**: Enhanced mobile experience for the modal
8. **Action Categories**: More granular categorization of actions
9. **Bulk Actions**: Create actions for multiple members simultaneously
10. **Integration**: Connect with external fitness tracking apps

This feature significantly enhances the trainer-member relationship by providing a structured communication channel and improving the overall user experience for both trainers and members.
