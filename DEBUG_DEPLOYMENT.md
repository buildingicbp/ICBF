# Debug Deployment Issues

## Step 1: Check Environment Variables

Open your deployed site and run this in the browser console:

```javascript
console.log("Environment Check:");
console.log("SUPABASE_URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log("ANON_KEY:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Present" : "Missing");
console.log("SERVICE_KEY:", process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY ? "Present" : "Missing");
```

## Step 2: Test Database Connection

Run this in browser console:

```javascript
// Test basic connection
supabase.from('members').select('count').limit(1).then(({data, error}) => {
  console.log("Basic connection:", error ? "FAILED" : "SUCCESS", error);
});

// Test service connection
supabaseService.from('members').select('count').limit(1).then(({data, error}) => {
  console.log("Service connection:", error ? "FAILED" : "SUCCESS", error);
});
```

## Step 3: Test RLS Policies

Run this in browser console:

```javascript
// Test if we can insert (this should work for authenticated users)
const testData = {
  user_id: 'test-' + Date.now(),
  username: 'testuser',
  email: 'test@example.com',
  contact: '+1234567890',
  full_name: 'Test User'
};

supabase.from('members').insert(testData).select().then(({data, error}) => {
  console.log("Insert test:", error ? "FAILED" : "SUCCESS", error);
  if (data) {
    console.log("Inserted data:", data);
    // Clean up
    supabase.from('members').delete().eq('user_id', testData.user_id);
  }
});
```

## Step 4: Check Current RLS Policies

Run this SQL in Supabase SQL Editor:

```sql
-- Check current policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('members', 'trainers');
```

## Step 5: Fix RLS Policies (Run this SQL)

```sql
-- Completely disable RLS temporarily for testing
ALTER TABLE members DISABLE ROW LEVEL SECURITY;
ALTER TABLE trainers DISABLE ROW LEVEL SECURITY;

-- Or create very permissive policies
DROP POLICY IF EXISTS "Members can insert own profile" ON members;
DROP POLICY IF EXISTS "Trainers can insert own profile" ON trainers;

CREATE POLICY "Allow all inserts" ON members FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all inserts" ON trainers FOR INSERT WITH CHECK (true);
```

## Step 6: Test Profile Creation

After fixing RLS, try signing up a new user and check the console logs. You should see:

1. "SignUp called with userType: trainer"
2. "Creating profile for user: [user-id]"
3. "UserType for profile creation: trainer"
4. "Creating trainer profile..."
5. "Trainer profile created successfully: [data]"

## Step 7: Check Database After Signup

After signing up, run this SQL to check if the profile was created:

```sql
-- Check members table
SELECT * FROM members ORDER BY created_at DESC LIMIT 5;

-- Check trainers table  
SELECT * FROM trainers ORDER BY created_at DESC LIMIT 5;
```

## Common Issues & Solutions:

### Issue 1: Environment Variables Not Loading
**Solution:** Check your deployment platform (Vercel/Netlify) environment variables

### Issue 2: RLS Policies Blocking Inserts
**Solution:** Run the RLS fix SQL above

### Issue 3: User Type Not Being Passed
**Solution:** Check console logs during signup

### Issue 4: Database Connection Failing
**Solution:** Verify Supabase URL and keys

## Quick Test Script

Copy this into browser console to run all tests:

```javascript
async function runAllTests() {
  console.log("🧪 Running all deployment tests...");
  
  // Test 1: Environment variables
  console.log("1. Environment Variables:");
  console.log("URL:", process.env.NEXT_PUBLIC_SUPABASE_URL ? "Present" : "Missing");
  console.log("ANON:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Present" : "Missing");
  console.log("SERVICE:", process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY ? "Present" : "Missing");
  
  // Test 2: Database connection
  console.log("2. Database Connection:");
  const {data, error} = await supabase.from('members').select('count').limit(1);
  console.log("Connection:", error ? "FAILED" : "SUCCESS", error);
  
  // Test 3: RLS policies
  console.log("3. RLS Policies:");
  const testData = {
    user_id: 'test-' + Date.now(),
    username: 'testuser',
    email: 'test@example.com',
    contact: '+1234567890',
    full_name: 'Test User'
  };
  
  const {data: insertData, error: insertError} = await supabase.from('members').insert(testData).select();
  console.log("Insert test:", insertError ? "FAILED" : "SUCCESS", insertError);
  
  if (insertData) {
    await supabase.from('members').delete().eq('user_id', testData.user_id);
    console.log("Test data cleaned up");
  }
  
  console.log("✅ All tests completed");
}

runAllTests();
```

Run this and tell me what errors you see! 