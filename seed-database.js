import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get Supabase credentials from environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://ghozcxjhmtwfbtlufoiy.supabase.co';
// For seeding, we need a service role key (not anon key)
// This should be loaded from environment or .env.local
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
  console.error('❌ Error: SUPABASE_SERVICE_ROLE_KEY environment variable is not set');
  console.error('Please set the service role key from your Supabase dashboard');
  process.exit(1);
}

// Create Supabase client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function seedDatabase() {
  try {
    console.log('🔄 Starting database seeding...\n');

    // Read the seed SQL file
    const seedFilePath = path.join(__dirname, 'supabase', 'seed_example_data.sql');
    const seedSQL = fs.readFileSync(seedFilePath, 'utf-8');

    // Split SQL into individual statements
    // Handle both `;` and `\n` delimiters
    const statements = seedSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    console.log(`📝 Found ${statements.length} SQL statements to execute\n`);

    // Get the database connection
    const { data: { session } } = await supabase.auth.getSession();

    // Use the RPC or direct query approach
    // Since we can't execute arbitrary SQL directly, we'll use the REST API
    // or we need to use the postgres client
    
    // Alternative: Use @supabase/auth-js to execute as admin
    const { data, error } = await supabase.rpc('execute_sql', {
      sql: seedSQL,
    }).catch(err => {
      // RPC might not exist, try different approach
      console.log('ℹ️  RPC method not available, attempting direct execution...\n');
      return { error: err };
    });

    if (error && error.message && error.message.includes('execute_sql')) {
      console.log('⚠️  Direct SQL execution requires manual setup.\n');
      console.log('📋 Please execute the following in your Supabase Dashboard:\n');
      console.log('1. Go to SQL Editor');
      console.log('2. Open: supabase/seed_example_data.sql');
      console.log('3. Copy all contents');
      console.log('4. Paste into Supabase SQL Editor');
      console.log('5. Click "RUN"\n');
      console.log('🔗 Dashboard: https://app.supabase.com/projects\n');
      process.exit(1);
    }

    if (error) {
      throw error;
    }

    console.log('✅ Database seeding completed successfully!\n');
    console.log('🎉 You now have 10 example patients with glucose readings\n');
    console.log('📊 Patients created:');
    console.log('  1. Ahmed Hassan (Type 1 - Normal)');
    console.log('  2. Leila Ahmed (Type 2 - Warning)');
    console.log('  3. Omar Mohamed (Type 2 - Stable)');
    console.log('  4. Fatima Ali (Type 1 - Excellent)');
    console.log('  5. Mohammed Ibrahim (Type 2 - Critical)');
    console.log('  6. Sarah Al-Rashid (Type 1 - Normal)');
    console.log('  7. Hassan Abdul Rahman (Type 2 - Warning)');
    console.log('  8. Noor Mohammed (Type 2 - Normal)');
    console.log('  9. Ali Hassan (Type 1 - Excellent)');
    console.log('  10. Mona Abdullah (Type 2 - Critical)\n');

  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    console.error('\n📋 Manual Setup Instructions:\n');
    console.error('1. Go to: https://app.supabase.com/projects');
    console.error('2. Select your project');
    console.error('3. Open SQL Editor');
    console.error('4. Copy contents from: supabase/seed_example_data.sql');
    console.error('5. Paste and execute\n');
    process.exit(1);
  }
}

// Run the seeding function
seedDatabase();
