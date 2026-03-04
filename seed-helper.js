#!/usr/bin/env node

/**
 * Diabetes App - Database Seeding Helper
 * This guides you through seeding the example data
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('\n' + '='.repeat(70));
console.log('🌱 DATABASE SEEDING - DIABETES MONITORING APP');
console.log('='.repeat(70) + '\n');

console.log('📋 QUICK SETUP (Takes 2 minutes):\n');

console.log('Step 1️⃣  - Open Supabase Dashboard');
console.log('  └─ https://app.supabase.com/projects\n');

console.log('Step 2️⃣  - Select your project "Htech-1.0-v"\n');

console.log('Step 3️⃣  - Navigate to:');
console.log('  └─ SQL Editor (left sidebar)\n');

console.log('Step 4️⃣  - Create a new query');
console.log('  └─ Click "New Query" or "+ New"\n');

console.log('Step 5️⃣  - Open the seed file');
const seedFilePath = path.join(__dirname, 'supabase', 'seed_example_data.sql');
console.log(`  └─ File: ${seedFilePath}\n`);

try {
  const seedSQL = fs.readFileSync(seedFilePath, 'utf-8');
  const lineCount = seedSQL.split('\n').length;
  const statementCount = seedSQL.split(';').filter(s => s.trim()).length;
  
  console.log(`Step 6️⃣  - SQL Details:`);
  console.log(`  └─ ${lineCount} lines of SQL`);
  console.log(`  └─ ${statementCount} SQL statements`);
  console.log(`  └─ Creates 10 example patients\n`);

} catch (error) {
  console.error('  ❌ Could not read seed file');
}

console.log('Step 7️⃣  - Copy & Paste');
console.log('  1. Open the file in your editor');
console.log('  2. Select all (Ctrl+A)');
console.log('  3. Copy (Ctrl+C)');
console.log('  4. Paste into Supabase SQL Editor (Ctrl+V)\n');

console.log('Step 8️⃣  - Execute the SQL');
console.log('  └─ Click the RUN button (⚡ or ▶️)\n');

console.log('Step 9️⃣  - Verify Success');
console.log('  └─ You should see "success" messages');
console.log('  └─ Close the SQL editor\n');

console.log('Step 🔟 - Refresh Your App');
console.log('  └─ Go to http://localhost:5173/');
console.log('  └─ You should see 10 patients in the dashboard\n');

console.log('='.repeat(70));
console.log('🎯 EXPECTED RESULTS:');
console.log('='.repeat(70) + '\n');

console.log('After seeding, you\'ll have:');
console.log('  ✅ 10 example patients');
console.log('  ✅ 50+ glucose readings');
console.log('  ✅ Mixed health statuses (Normal, Warning, Critical)');
console.log('  ✅ Type 1 and Type 2 diabetes examples');
console.log('  ✅ Ready to test your UI!\n');

console.log('📊 PATIENT SUMMARY:');
console.log('  • Patient 1: Ahmed Hassan (Type 1 - Normal)');
console.log('  • Patient 2: Leila Ahmed (Type 2 - ⚠️ Warning)');
console.log('  • Patient 3: Omar Mohamed (Type 2 - Normal)');
console.log('  • Patient 4: Fatima Ali (Type 1 - ✅ Excellent)');
console.log('  • Patient 5: Mohammed Ibrahim (Type 2 - 🔴 Critical)');
console.log('  • Patient 6: Sarah Al-Rashid (Type 1 - Normal)');
console.log('  • Patient 7: Hassan Abdul Rahman (Type 2 - ⚠️ Warning)');
console.log('  • Patient 8: Noor Mohammed (Type 2 - Normal)');
console.log('  • Patient 9: Ali Hassan (Type 1 - ✅ Excellent)');
console.log('  • Patient 10: Mona Abdullah (Type 2 - 🔴 Critical)\n');

console.log('='.repeat(70));
console.log('❓ TROUBLESHOOTING:\n');

console.log('If you get an error "table already exists":');
console.log('  └─ Your data might already be seeded');
console.log('  └─ Run the queries individually if needed\n');

console.log('If table doesn\'t exist:');
console.log('  └─ Make sure schema.sql was executed first');
console.log('  └─ Run schema.sql before seed_example_data.sql\n');

console.log('If app still shows no patients:');
console.log('  └─ Make sure you\'re logged in as a caregiver');
console.log('  └─ The example data uses a fixed caregiver UUID (update if needed)\n');

console.log('='.repeat(70) + '\n');

console.log('🚀 Ready? Let\'s seed the database!\n');
console.log('📁 Files to use:');
console.log('  1. supabase/schema.sql (run first if not already done)');
console.log('  2. supabase/seed_example_data.sql (run this one)\n');

console.log('✨ Let me know when you\'ve seeded the database!\n');
