# Deployment Setup Guide

This guide will help you fix the deployment issues with user data insertion and dashboard routing.

## 1. Environment Variables Setup

### Required Environment Variables

You need to set these environment variables in your deployment platform (Vercel, Netlify, etc.):

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### How to Get These Values

1. **Go to your Supabase Dashboard**
2. **Navigate to Settings > API**
3. **Copy the following values:**
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → `NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY`

### Important Notes

- The **service role key** is crucial for bypassing RLS policies during user profile creation
- Never expose the service role key in client-side code (it's safe to use with `NEXT_PUBLIC_` prefix in Next.js as it's only used server-side)
- Make sure all three variables are set correctly

## 2. Database Setup Verification

### Check Database Tables

Ensure your database has the correct tables and policies:

1. **Go to Supabase Dashboard > SQL Editor**
2. **Run the database schema from `database-schema.sql`**
3. **Verify tables exist:**
   ```sql
   SELECT table_name FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name IN ('members', 'trainers', 'sessions', 'workouts', 'goals');
   ```

### Check RLS Policies

Verify Row Level Security policies are set up correctly:

```sql
-- Check RLS policies for members table
SELECT * FROM pg_policies WHERE tablename = 'members';

-- Check RLS policies for trainers table
SELECT * FROM pg_policies WHERE tablename = 'trainers';
```

### Test Database Connection

Create a simple test to verify database connectivity:

```sql
-- Test inserting a member (this should work with service role)
INSERT INTO members (user_id, username, email, contact, full_name)
VALUES ('test-user-id', 'test_user', 'test@example.com', '+1234567890', 'Test User')
ON CONFLICT (user_id) DO NOTHING;
```

## 3. Authentication Configuration

### Supabase Auth Settings

1. **Go to Authentication > Settings**
2. **Configure Site URL:**
   - Development: `http://localhost:3000`
   - Production: `https://yourdomain.com`
3. **Add Redirect URLs:**
   - `http://localhost:3000/auth/callback`
   - `https://yourdomain.com/auth/callback`

### Google OAuth Setup (if using)

1. **Go to Authentication > Providers**
2. **Enable Google provider**
3. **Add your Google OAuth credentials**
4. **Configure redirect URLs in Google Console**

## 4. Common Deployment Issues & Solutions

### Issue 1: User Data Not Inserting

**Symptoms:**
- Users can sign up/sign in but no profile is created
- Console shows database errors

**Solutions:**
1. **Check service role key is set correctly**
2. **Verify database tables exist**
3. **Check RLS policies allow service role access**
4. **Review console logs for specific error messages**

### Issue 2: Wrong Dashboard Routing

**Symptoms:**
- Trainers redirected to member dashboard
- Members redirected to trainer dashboard

**Solutions:**
1. **Clear browser cache and cookies**
2. **Check user metadata is being set correctly**
3. **Verify database profile creation is working**
4. **Check console logs for user type detection**

### Issue 3: Environment Variables Not Loading

**Symptoms:**
- App works locally but not in production
- Database connection errors

**Solutions:**
1. **Verify all environment variables are set in deployment platform**
2. **Check variable names match exactly (case-sensitive)**
3. **Redeploy after setting environment variables**
4. **Clear deployment cache if available**

## 5. Testing Checklist

### Before Deployment

- [ ] All environment variables set correctly
- [ ] Database tables created and populated
- [ ] RLS policies configured
- [ ] Auth providers configured
- [ ] Redirect URLs set up

### After Deployment

- [ ] Test user registration (both member and trainer)
- [ ] Test user sign-in (both member and trainer)
- [ ] Test Google OAuth (if enabled)
- [ ] Verify correct dashboard routing
- [ ] Check user profiles are created in database
- [ ] Test admin access (if applicable)

## 6. Debugging Tools

### Console Logs

The application includes extensive logging. Check browser console for:

- User authentication status
- Database operation results
- User type detection logic
- Profile creation attempts

### Database Queries

Use Supabase Dashboard > SQL Editor to run diagnostic queries:

```sql
-- Check if user exists in members table
SELECT * FROM members WHERE email = 'user@example.com';

-- Check if user exists in trainers table
SELECT * FROM trainers WHERE email = 'trainer@example.com';

-- Check user metadata
SELECT * FROM auth.users WHERE email = 'user@example.com';
```

### Network Tab

Check browser Network tab for:
- Failed API requests
- Authentication errors
- Database operation failures

## 7. Performance Optimization

### Database Indexes

Ensure proper indexes are created:

```sql
-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_members_user_id ON members(user_id);
CREATE INDEX IF NOT EXISTS idx_trainers_user_id ON trainers(user_id);
CREATE INDEX IF NOT EXISTS idx_members_email ON members(email);
CREATE INDEX IF NOT EXISTS idx_trainers_email ON trainers(email);
```

### Caching

Consider implementing caching for:
- User profile data
- Dashboard statistics
- Frequently accessed data

## 8. Security Considerations

### RLS Policies

Ensure RLS policies are properly configured:

```sql
-- Example: Members can only access their own data
CREATE POLICY "Members can view own profile" ON members
  FOR SELECT USING (auth.uid() = user_id);

-- Example: Service role can bypass RLS
-- (This is handled automatically by the service role key)
```

### Environment Variables

- Never commit sensitive keys to version control
- Use environment variables for all sensitive data
- Regularly rotate service role keys
- Monitor for unauthorized access

## 9. Monitoring & Maintenance

### Regular Checks

- Monitor database performance
- Check for failed authentication attempts
- Review user registration success rates
- Monitor dashboard access patterns

### Backup Strategy

- Enable automatic database backups
- Test restore procedures regularly
- Keep multiple backup copies
- Document recovery procedures

## 10. Support

If you continue to experience issues:

1. **Check the console logs for specific error messages**
2. **Verify all environment variables are set correctly**
3. **Test with a fresh browser session**
4. **Check Supabase dashboard for any service issues**
5. **Review the application logs in your deployment platform**

This setup guide should resolve the deployment issues you're experiencing. The key is ensuring all environment variables are properly configured and the database is set up correctly. 