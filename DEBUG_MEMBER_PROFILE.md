# Debug Member Profile Creation Issue

## Problem
Getting error: "Error creating member profile: {}" when trying to create new accounts.

## Quick Fix Steps

### 1. Check Environment Variables
Make sure you have these environment variables set in your `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 2. Get Your Service Role Key
1. Go to your Supabase Dashboard
2. Navigate to Settings > API
3. Copy the "service_role" key (NOT the anon key)
4. Add it to your `.env.local` file

### 3. Test Database Connection
Open your browser console and run:

```javascript
// Test if the table exists and is accessible
window.testDatabaseInsertion()

// Test RLS policies
window.testRLSPolicies()

// Debug database connection
window.debugDatabase()
```

### 4. Alternative: Use Regular Client
If service role key is not available, the code will automatically fall back to the regular client.

### 5. Check Table Creation
Make sure you ran the SQL query from `create-members-table.sql` in your Supabase SQL Editor.

### 6. Verify Table Structure
Run this query in Supabase SQL Editor to check if the table exists:

```sql
SELECT * FROM members LIMIT 0;
```

## Common Issues

### Issue 1: Missing Service Role Key
**Solution**: Add the service role key to your environment variables

### Issue 2: Table Doesn't Exist
**Solution**: Run the SQL query from `create-members-table.sql`

### Issue 3: RLS Policies Too Restrictive
**Solution**: The code should handle this automatically, but you can temporarily disable RLS for testing:

```sql
ALTER TABLE members DISABLE ROW LEVEL SECURITY;
```

### Issue 4: Environment Variables Not Loading
**Solution**: Restart your development server after adding environment variables

## Test the Fix

1. Add the service role key to your environment variables
2. Restart your development server
3. Try creating a new account
4. Check the browser console for success messages

## Expected Success Flow

When working correctly, you should see these console messages:
1. "Creating member profile with data: {...}"
2. "Member profile created successfully: {...}"
3. "Account created successfully! Welcome to ICBF!"
4. Redirect to member dashboard 