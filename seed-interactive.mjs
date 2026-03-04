#!/usr/bin/env node

/**
 * Interactive Database Seeder
 * Guides you through the seeding process
 */

import readline from 'readline';
import pg from 'pg';
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
  console.log('\n' + '='.repeat(70));
  console.log('🌱 INTERACTIVE DATABASE SEEDER');
  console.log('='.repeat(70) + '\n');

  console.log('This helper will seed your Supabase database with example data.\n');
  console.log('We need your database credentials. You can find them at:\n');
  console.log('👉 https://app.supabase.com → Select Project → Settings → Database\n');

  const useCloudAnswer = await question('Are you using Supabase Cloud? (yes/no): ');
  
  if (useCloudAnswer.toLowerCase() === 'yes' || useCloudAnswer.toLowerCase() === 'y') {
    await seedCloud();
  } else {
    await seedLocal();
  }

  rl.close();
}

async function seedCloud() {
  console.log('\n📍 SUPABASE CLOUD SETUP\n');
  
  const password = await question('Enter your PostgreSQL password: ');
  
  if (!password) {
    console.log('❌ Password is required\n');
    return;
  }

  const projectRef = 'ghozcxjhmtwfbtlufoiy'; // From the URL

  try {
    console.log('\n⏳ Connecting to database...');
    
    const client = new pg.Client({
      connectionString: `postgresql://postgres:${password}@db.${projectRef}.supabase.co:5432/postgres`,
      ssl: { rejectUnauthorized: false },
    });

    await client.connect();
    console.log('✅ Connected!\n');

    // Read seed file
    const seedFilePath = path.join(__dirname, 'supabase', 'seed_example_data.sql');
    const seedSQL = fs.readFileSync(seedFilePath, 'utf-8');

    console.log('📝 Executing SQL statements...\n');
    
    try {
      await client.query(seedSQL);
      console.log('✅ Success!\n');
      console.log('🎉 DATABASE SEEDED\n');
      console.log('📊 Created:');
      console.log('  ✅ 10 example patients');
      console.log('  ✅ 50+ glucose readings\n');
      console.log('👉 Refresh http://localhost:5173/ to see the data!\n');
    } finally {
      await client.end();
    }

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.log('\n💡 Troubleshooting:');
    console.log('  • Check your password is correct');
    console.log('  • Make sure schema.sql was run first');
    console.log('  • Try manual setup through Supabase Dashboard\n');
  }
}

async function seedLocal() {
  console.log('\n📍 LOCAL SUPABASE SETUP\n');
  
  const host = await question('PostgreSQL host (default: localhost): ') || 'localhost';
  const port = await question('PostgreSQL port (default: 5432): ') || '5432';
  const user = await question('PostgreSQL user (default: postgres): ') || 'postgres';
  const password = await question('PostgreSQL password: ');
  const database = await question('Database (default: postgres): ') || 'postgres';

  try {
    console.log('\n⏳ Connecting to database...');
    
    const client = new pg.Client({
      host,
      port: parseInt(port),
      user,
      password,
      database,
    });

    await client.connect();
    console.log('✅ Connected!\n');

    // Read seed file
    const seedFilePath = path.join(__dirname, 'supabase', 'seed_example_data.sql');
    const seedSQL = fs.readFileSync(seedFilePath, 'utf-8');

    console.log('📝 Executing SQL statements...\n');
    
    try {
      await client.query(seedSQL);
      console.log('✅ Success!\n');
      console.log('🎉 DATABASE SEEDED\n');
      console.log('📊 Created:');
      console.log('  ✅ 10 example patients');
      console.log('  ✅ 50+ glucose readings\n');
      console.log('👉 Refresh http://localhost:5173/ to see the data!\n');
    } finally {
      await client.end();
    }

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.log('\n💡 Troubleshooting:');
    console.log('  • Check your credentials');
    console.log('  • Make sure schema.sql was run first');
    console.log('  • Try: docker ps (to see running containers)\n');
  }
}

main().catch(console.error);
