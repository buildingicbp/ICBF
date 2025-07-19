// Browser Debug Script - Copy and paste this into your deployed site's console

async function debugDeployment() {
  console.log("🔍 Debugging deployment issues...");
  
  // Test 1: Check if Supabase clients are available
  console.log("1. Supabase Clients:");
  if (typeof supabase !== 'undefined') {
    console.log("✅ Supabase client available");
  } else {
    console.log("❌ Supabase client not available");
    return;
  }
  
  if (typeof supabaseService !== 'undefined') {
    console.log("✅ Supabase service client available");
  } else {
    console.log("❌ Supabase service client not available");
  }
  
  // Test 2: Database connection
  console.log("2. Database Connection:");
  try {
    const {data, error} = await supabase.from('members').select('count').limit(1);
    if (error) {
      console.log("❌ Connection failed:", error.message);
    } else {
      console.log("✅ Connection successful");
    }
  } catch (err) {
    console.log("❌ Connection error:", err);
  }
  
  // Test 3: RLS Policy Test
  console.log("3. RLS Policy Test:");
  try {
    const testData = {
      user_id: 'test-' + Date.now(),
      username: 'testuser',
      email: 'test@example.com',
      contact: '+1234567890',
      full_name: 'Test User'
    };
    
    const {data: insertData, error: insertError} = await supabase.from('members').insert(testData).select();
    
    if (insertError) {
      console.log("❌ Insert failed:", insertError.message);
      console.log("Error details:", insertError);
    } else {
      console.log("✅ Insert successful:", insertData);
      
      // Clean up
      await supabase.from('members').delete().eq('user_id', testData.user_id);
      console.log("🧹 Test data cleaned up");
    }
  } catch (err) {
    console.log("❌ Insert error:", err);
  }
  
  // Test 4: Check current user session
  console.log("4. Current Session:");
  const {data: sessionData} = await supabase.auth.getSession();
  if (sessionData.session) {
    console.log("✅ User logged in:", sessionData.session.user.email);
    console.log("User metadata:", sessionData.session.user.user_metadata);
  } else {
    console.log("ℹ️ No active session");
  }
  
  console.log("✅ Debug complete");
}

// Run the debug
debugDeployment(); 