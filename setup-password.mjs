#!/usr/bin/env node

/**
 * Get Supabase Database Password
 * Step-by-step guide to find and save your password
 */

import readline from 'readline';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function main() {
  console.clear();
  console.log('\n' + '='.repeat(70));
  console.log('🔑 SUPABASE DATABASE PASSWORD SETUP');
  console.log('='.repeat(70) + '\n');

  console.log('I need your Supabase PostgreSQL database password to seed the data.\n');
  console.log('📍 HOW TO FIND YOUR PASSWORD:\n');
  console.log('Step 1: Open https://app.supabase.com/projects\n');
  console.log('Step 2: Click on your project "Htech-1.0-v"\n');
  console.log('Step 3: Go to Settings → Database\n');
  console.log('Step 4: Look for the "Database" section showing:\n');
  console.log('        Connection String / Password field\n');
  console.log('Step 5: Copy the PASSWORD (not the full connection string)\n');
  console.log('Step 6: If you don\'t see it, click "Reset Password" button\n');
  console.log('        (⚠️  This will reset your database password!)\n');

  console.log('='.repeat(70) + '\n');

  const password = await question('👉 Paste your database password here: ');
  
  if (!password) {
    console.log('\n❌ Password is required!\n');
    rl.close();
    return;
  }

  // Save to .env.local
  const envLocalPath = path.join(__dirname, '.env.local');
  let existingEnv = '';
  
  try {
    if (fs.existsSync(envLocalPath)) {
      existingEnv = fs.readFileSync(envLocalPath, 'utf-8');
    }
  } catch (error) {
    console.error('Error reading .env.local:', error.message);
  }

  // Add or update the password
  let newEnv = existingEnv;
  if (existingEnv.includes('SUPABASE_DB_PASSWORD=')) {
    // Replace existing
    newEnv = existingEnv.replace(
      /SUPABASE_DB_PASSWORD=.*/,
      `SUPABASE_DB_PASSWORD=${password}`
    );
  } else {
    // Add new
    newEnv = existingEnv + (existingEnv && !existingEnv.endsWith('\n') ? '\n' : '');
    newEnv += `SUPABASE_DB_PASSWORD=${password}\n`;
  }

  try {
    fs.writeFileSync(envLocalPath, newEnv, 'utf-8');
    console.log('\n✅ Password saved to .env.local\n');
    console.log('🔄 Now running database seeder...\n');
    
    rl.close();
    
    // Run the actual seeder
    await runSeeder(password);
    
  } catch (error) {
    console.error('❌ Error saving password:', error.message);
    rl.close();
  }
}

async function runSeeder(password) {
  const pg = (await import('pg')).default;
  const seedFilePath = path.join(__dirname, 'supabase', 'seed_example_data.sql');
  
  let seedSQL;
  try {
    seedSQL = fs.readFileSync(seedFilePath, 'utf-8');
  } catch (error) {
    console.error('❌ Could not read seed file:', error.message);
    process.exit(1);
  }

  const projectRef = 'ghozcxjhmtwfbtlufoiy';

  try {
    console.log('⏳ Connecting to Supabase...');
    
    const client = new pg.Client({
      connectionString: `postgresql://postgres:${password}@db.${projectRef}.supabase.co:5432/postgres`,
      ssl: { rejectUnauthorized: false },
    });

    await client.connect();
    console.log('✅ Connected to database!\n');

    console.log('📝 Executing seed SQL (22 statements)...\n');
    
    await client.query(seedSQL);
    
    console.log('✅ SQL executed successfully!\n');
    console.log('='.repeat(70));
    console.log('🎉 DATABASE SEEDED SUCCESSFULLY!');
    console.log('='.repeat(70) + '\n');
    
    console.log('📊 CREATED:');
    console.log('  ✅ 10 example patients');
    console.log('  ✅ 50+ glucose readings');
    console.log('  ✅ Type 1 & Type 2 diabetes examples');
    console.log('  ✅ Normal, Warning, & Critical statuses\n');

    console.log('📱 NEXT STEPS:');
    console.log('  1. Open http://localhost:5173/');
    console.log('  2. Make sure you\'re logged in as a caregiver');
    console.log('  3. Go to "Caregiver Page"');
    console.log('  4. You should see 10 patients!\n');

    console.log('='.repeat(70) + '\n');

    await client.end();

  } catch (error) {
    console.error('\n❌ Database Error:', error.message);
    
    if (error.message.includes('password')) {
      console.log('\n💡 The password might be incorrect.');
      console.log('   Try resetting it in Supabase Settings → Database\n');
    } else if (error.message.includes('table')) {
      console.log('\n💡 A table might already exist.');
      console.log('   Try deleting and recreating tables in Supabase\n');
    }
  }
}

main().catch(console.error);
