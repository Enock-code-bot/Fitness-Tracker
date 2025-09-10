// Simple OAuth Test Script
// Run with: node test-oauth.js

const { createClient } = require('@supabase/supabase-js');

// Test Supabase connection and OAuth setup
async function testOAuthSetup() {
  console.log('🔍 Testing OAuth Configuration...\n');

  // Check environment variables
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

  console.log('📋 Environment Variables:');
  console.log(`   VITE_SUPABASE_URL: ${supabaseUrl ? '✅ Set' : '❌ Missing'}`);
  console.log(`   VITE_SUPABASE_ANON_KEY: ${supabaseKey ? '✅ Set' : '❌ Missing'}\n`);

  if (!supabaseUrl || !supabaseKey) {
    console.log('❌ Missing environment variables. Please check your .env file.');
    return;
  }

  // Test Supabase connection
  console.log('🔗 Testing Supabase Connection...');
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data, error } = await supabase.auth.getSession();

    if (error) {
      console.log('❌ Supabase connection failed:', error.message);
      return;
    }

    console.log('✅ Supabase connection successful');

    // Test OAuth providers
    console.log('\n🔐 Testing OAuth Providers...');
    const { data: providers, error: providersError } = await supabase.auth.getProviders();

    if (providersError) {
      console.log('❌ Failed to get providers:', providersError.message);
      return;
    }

    console.log('Available providers:', providers);

    if (providers.includes('google')) {
      console.log('✅ Google OAuth provider is configured');
    } else {
      console.log('❌ Google OAuth provider is NOT configured');
      console.log('   Please enable Google provider in Supabase dashboard');
    }

  } catch (error) {
    console.log('❌ Test failed:', error.message);
  }
}

// Instructions
console.log('🚀 OAuth Configuration Test\n');
console.log('This script will test your Supabase OAuth setup.\n');
console.log('Make sure you have:');
console.log('1. Created .env file with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
console.log('2. Configured Google OAuth in Supabase dashboard');
console.log('3. Set up Google Cloud Console credentials\n');

// Run the test
testOAuthSetup().then(() => {
  console.log('\n✨ Test completed!');
  console.log('If all checks pass, your OAuth should work.');
  console.log('If not, follow the setup guide in google-oauth-setup.md');
});
