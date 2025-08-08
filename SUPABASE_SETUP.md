# Supabase Authentication Setup

This guide will help you set up Supabase authentication for your ICBF application.

## 1. Install Dependencies

First, install the required Supabase package:

```bash
npm install @supabase/supabase-js
```

## 2. Set Up Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Once your project is created, go to Settings > API
3. Copy your Project URL and anon/public key

## 3. Environment Variables

Create a `.env.local` file in your project root and add:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Replace the values with your actual Supabase project credentials.

## 4. Configure Authentication

In your Supabase dashboard:

1. Go to Authentication > Settings
2. Configure your site URL (e.g., `http://localhost:3000` for development)
3. Add redirect URLs:
   - `http://localhost:3000/auth/callback` (for development)
   - `https://yourdomain.com/auth/callback` (for production)

## 5. Enable Google OAuth (Optional)

To enable Google sign-in:

1. Go to Authentication > Providers
2. Enable Google provider
3. Add your Google OAuth credentials (Client ID and Secret)
4. Configure redirect URLs in Google Console

## 6. Database Schema (Optional)

If you want to store additional user data, create a `profiles` table:

```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  username TEXT,
  contact TEXT,
  user_type TEXT CHECK (user_type IN ('member', 'trainer')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
```

## 7. Usage

The authentication is now integrated into your signin page. Users can:

- Sign up with email/password
- Sign in with email/password
- Sign in with Google (if configured)
- Toggle between member and trainer registration

## 8. Features

- ✅ Email/password authentication
- ✅ Google OAuth authentication
- ✅ User type selection (member/trainer)
- ✅ Form validation
- ✅ Loading states
- ✅ Error handling with toast notifications
- ✅ Remember me functionality
- ✅ Responsive design

## 9. Next Steps

1. Create protected routes using the `useAuth` hook
2. Add user profile management
3. Implement role-based access control
4. Add password reset functionality
5. Set up email verification templates 