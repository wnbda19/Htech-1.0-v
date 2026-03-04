#!/usr/bin/env node

/**
 * Supabase Database Seeder
 * Connects to Supabase PostgreSQL and seeds example data
 */

import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: '.env.local' });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://ghozcxjhmtwfbtlufoiy.supabase.co';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const DB_PASSWORD = process.env.SUPABASE_DB_PASSWORD;

// Extract project reference from URL
const projectRef = SUPABASE_URL.split('https://')[1].split('.supabase.co')[0];

console.log('\n' + '='.repeat(60));
console.log('🌱 SEEDING SUPABASE DATABASE');
console.log('='.repeat(60) + '\n');

console.log(`📌 Project Reference: ${projectRef}`);
console.log(`🔗 URL: ${SUPABASE_URL}\n`);

// Read seed SQL
const seedFilePath = path.join(__dirname, 'supabase', 'seed_example_data.sql');
let seedSQL;

try {
  seedSQL = fs.readFileSync(seedFilePath, 'utf-8');
  console.log(`✅ Read seed file: ${seedFilePath}`);
  console.log(`   Lines: ${seedSQL.split('\n').length}\n`);
} catch (error) {
  console.error('❌ Error reading seed file:', error.message);
  process.exit(1);
}

async function seedDatabase() {
  // Try multiple connection approaches
  
  console.log('🔍 Attempting database connection...\n');

  // First attempt: Direct PostgreSQL connection
  if (DB_PASSWORD) {
    try {
      const connectionString = `postgresql://postgres:${DB_PASSWORD}@db.${projectRef}.supabase.co:5432/postgres`;
      
      const client = new pg.Client({
        connectionString,
        ssl: { rejectUnauthorized: false },
      });

      console.log('⏳ Connecting to PostgreSQL...');
      await client.connect();
      console.log('✅ Connected to database!\n');

      // Execute the seed SQL
      console.log('📝 Executing seed SQL statements...\n');
      
      try {
        await client.query(seedSQL);
        console.log('✅ All SQL statements executed successfully!\n');
        
        console.log('🎉 DATABASE SEEDED SUCCESSFULLY!\n');
        console.log('📊 Created:');
        console.log('  ✅ 10 example patients');
        console.log('  ✅ 50+ glucose readings');
        console.log('  ✅ Test data for all UI states\n');
        
      } catch (sqlError) {
        console.error('⚠️  SQL Execution Error:');
        console.error(sqlError.message);
        console.log('\n💡 This might be OK if tables already exist');
        console.log('   Your data may already be seeded!\n');
      } finally {
        await client.end();
      }

    } catch (connError) {
      console.error('❌ Connection failed:', connError.message);
      showManualInstructions();
    }
    return;
  }

  // Second attempt: Check for local Supabase
  console.log('📍 Checking for local Supabase setup...\n');
  
  try {
    const client = new pg.Client({
      user: 'postgres',
      password: 'postgres', // Default local password
      host: 'localhost',
      port: 5432,
      database: 'postgres',
    });

    await client.connect();
    console.log('✅ Connected to local PostgreSQL!\n');

    console.log('📝 Executing seed SQL...\n');
    await client.query(seedSQL);
    
    console.log('✅ Local database seeded!\n');
    await client.end();
    return;

  } catch (error) {
    console.log('⚠️  Local Supabase not found\n');
  }

  // If all else fails, show manual instructions
  showManualInstructions();
}

function showManualInstructions() {
  console.log('='.repeat(60));
  console.log('📋 MANUAL SETUP REQUIRED');
  console.log('='.repeat(60) + '\n');

  console.log('⚙️  SETUP STEP 1: Set Database Password\n');
  console.log('Add this to your .env.local file:');
  console.log('  SUPABASE_DB_PASSWORD=[your_password_here]\n');
  console.log('Where [your_password_here] is your Supabase postgres password from:');
  console.log('  https://app.supabase.com/project/[your-project]/settings/database\n');

  console.log('⚙️  SETUP STEP 2: Or use Supabase Dashboard\n');
  console.log('1. Open: https://app.supabase.com/projects');
  console.log('2. Select your project');
  console.log('3. Go to SQL Editor');
  console.log('4. New Query');
  console.log('5. Paste contents of: supabase/seed_example_data.sql');
  console.log('6. Click RUN\n');

  console.log('='.repeat(60) + '\n');
}

// Run seeding
seedDatabase().catch(error => {
  console.error('Fatal error:', error);
  showManualInstructions();
  process.exit(1);
});
