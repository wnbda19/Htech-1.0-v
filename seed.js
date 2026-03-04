#!/usr/bin/env node

/**
 * Database Seeding Script
 * This script reads the seed data SQL and provides options to execute it
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read environment
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://ghozcxjhmtwfbtlufoiy.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Read the seed SQL file
const seedFilePath = path.join(__dirname, 'supabase', 'seed_example_data.sql');
let seedSQL;

try {
  seedSQL = fs.readFileSync(seedFilePath, 'utf-8');
} catch (error) {
  console.error('❌ Error reading seed file:', error.message);
  process.exit(1);
}

console.log('='.repeat(60));
console.log('🌱 DATABASE SEEDING TOOL');
console.log('='.repeat(60));
console.log();

if (!SUPABASE_SERVICE_KEY) {
  console.log('⚠️  Service Role Key not found in environment\n');
  console.log('📋 MANUAL SETUP INSTRUCTIONS:\n');
  console.log('1. Open Supabase Dashboard');
  console.log('   👉 https://app.supabase.com/projects\n');
  console.log('2. Select your project: "Htech-1.0-v"\n');
  console.log('3. Click "SQL Editor" in the left sidebar\n');
  console.log('4. Click "New Query" or "+ New"\n');
  console.log('5. Open the file: supabase/seed_example_data.sql\n');
  console.log('6. Copy ALL contents from the file\n');
  console.log('7. Paste into the SQL Editor\n');
  console.log('8. Click "RUN" button (⚡)\n');
  console.log('='.repeat(60));
  console.log();
  console.log('✅ Once done, refresh your browser at http://localhost:5173/');
  console.log();
  console.log('The example patients will appear in your dashboard.\n');
  process.exit(0);
}

// If we have the service key, try to execute
console.log('✅ Service Role Key found\n');
console.log('🔄 Seeding database...\n');

async function seedDatabase() {
  try {
    // Parse Supabase URL to get project reference
    const projectRef = SUPABASE_URL.split('https://')[1].split('.supabase.co')[0];
    
    // Make request to Supabase REST API with RLS disabled (using service key)
    const dbUrl = `${SUPABASE_URL}/rest/v1/schema_migrations?select=*`;
    
    // First, check connection
    const checkResponse = await new Promise((resolve, reject) => {
      const options = {
        hostname: SUPABASE_URL.replace('https://', ''),
        port: 443,
        path: '/rest/v1/schema_migrations?select=*',
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
          'apikey': SUPABASE_SERVICE_KEY,
        },
      };

      https.get(options, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => resolve({ status: res.statusCode, data }));
      }).on('error', reject);
    });

    if (checkResponse.status === 200) {
      console.log('✅ Successfully connected to Supabase!\n');
      console.log('📝 SQL Statements to execute: ', seedSQL.split(';').filter(s => s.trim()).length);
      console.log('\n⚠️  LIMITATION: REST API doesn\'t support arbitrary SQL\n');
      console.log('📋 Please use SQL Editor for direct execution:\n');
      console.log('1. Copy: supabase/seed_example_data.sql');
      console.log('2. Paste into Supabase SQL Editor');
      console.log('3. Click RUN\n');
      process.exit(0);
    }

  } catch (error) {
    console.error('❌ Connection error:', error.message);
    console.log('\n📋 MANUAL SETUP:\n');
    console.log('Visit: https://app.supabase.com/projects');
    console.log('And run the SQL file through the SQL Editor\n');
    process.exit(1);
  }
}

seedDatabase();
