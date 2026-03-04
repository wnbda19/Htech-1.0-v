# 🌱 Database Seeding - Complete Setup Guide

## Quick Summary

You need to run the example data SQL file in your Supabase database. Here are your options:

---

## ⚡ OPTION 1: Fastest Way (Recommended)

### Through Supabase Dashboard - 3 Steps

**Step 1:** Open your Supabase Dashboard
- 👉 https://app.supabase.com/projects
- Select **"Htech-1.0-v"** project

**Step 2:** Open SQL Editor
- Click **"SQL Editor"** in the left sidebar
- Click **"New Query"** or **"+ New"**

**Step 3:** Copy & Execute
```bash
# In your project folder, open this file:
supabase/seed_example_data.sql

# Copy ALL contents (Ctrl+A, Ctrl+C)
# Paste into Supabase SQL Editor (Ctrl+V)
# Click the RUN button (⚡)
```

✅ **Done!** Your database now has 10 example patients.

---

## 🤖 OPTION 2: Automated Way (For Node.js)

### Using the Setup Script

```bash
# Run this command:
node setup-password.mjs

# You'll be prompted to:
# 1. Enter "yes" for Supabase Cloud
# 2. Paste your PostgreSQL password
# 3. The script will seed automatically
```

**Where to get your password:**
1. Go to https://app.supabase.com/projects
2. Select your project
3. Click **Settings** → **Database**
4. You'll see the password in the "Connection string" section
5. Or click **"Reset Password"** to create a new one

⚠️ **Note:** This requires Node.js with `pg` module installed

---

## 🐍 OPTION 3: Using Python

### One-time Setup

```bash
# Install required package:
pip install psycopg2-binary

# Create a file called `seed.py` with this content:
```

```python
import psycopg2
import os

# Get password from environment
password = input("Enter Supabase PostgreSQL password: ")

# Read seed SQL
with open('supabase/seed_example_data.sql', 'r') as f:
    sql = f.read()

# Connect and execute
conn = psycopg2.connect(
    host="db.ghozcxjhmtwfbtlufoiy.supabase.co",
    user="postgres",
    password=password,
    database="postgres",
    port=5432,
    sslmode='require'
)

cursor = conn.cursor()

try:
    cursor.execute(sql)
    conn.commit()
    print("✅ Database seeded successfully!")
except Exception as e:
    print(f"❌ Error: {e}")
finally:
    cursor.close()
    conn.close()
```

Then run:
```bash
python seed.py
```

---

## 📚 OPTION 4: Using psql Command Line

### Install PostgreSQL Client

**Windows:**
```bash
# Using Chocolatey:
choco install postgresql

# Or download from: https://www.postgresql.org/download/windows/
```

**Mac:**
```bash
brew install postgresql
```

**Linux:**
```bash
sudo apt-get install postgresql-client
```

### Run Seeder

```bash
psql -h db.ghozcxjhmtwfbtlufoiy.supabase.co \
     -U postgres \
     -d postgres \
     -f supabase/seed_example_data.sql

# When prompted, enter your Supabase PostgreSQL password
```

---

## 🔑 Getting Your Database Password

### Step-by-Step

1. **Open Supabase Dashboard**: https://app.supabase.com
2. **Select Project**: Click "Htech-1.0-v"
3. **Go to Settings**: Bottom left corner → "Settings"
4. **Find Database**: Click "Database" in the left menu
5. **Copy Password**: Look for the password field or connection string
6. **Alternative**: Click "Reset Password" button to create a new one

### Security Note
- ✅ Your `.env.local` is in `.gitignore` (safe to store here)
- ✅ Never commit passwords to GitHub
- ✅ You can safely add to `.env.local`:
  ```
  SUPABASE_DB_PASSWORD=your_password_here
  ```

---

## ✅ Verification

After seeding, check that your data is there:

### Method 1: Check in Supabase Dashboard
1. Go to SQL Editor
2. Run this query:
```sql
SELECT COUNT(*) as patient_count FROM caregiver_patients;
```
Should return: **10**

### Method 2: Check in Your App
1. Open http://localhost:5173/
2. Log in as a **caregiver** user
3. Go to **"Caregiver Page"**
4. You should see **10 patients** listed

---

## 📊 What Gets Created

### 10 Example Patients:
1. **Ahmed Hassan** (Type 1) - ✅ Normal readings
2. **Leila Ahmed** (Type 2) - ⚠️ Warning state
3. **Omar Mohamed** (Type 2) - ✅ Stable
4. **Fatima Ali** (Type 1) - ✅ Excellent control
5. **Mohammed Ibrahim** (Type 2) - 🔴 Critical state
6. **Sarah Al-Rashid** (Type 1) - ✅ Normal
7. **Hassan Abdul Rahman** (Type 2) - ⚠️ Warning
8. **Noor Mohammed** (Type 2) - ✅ Normal
9. **Ali Hassan** (Type 1) - ✅ Excellent
10. **Mona Abdullah** (Type 2) - 🔴 Critical

### For Each Patient:
- Name and phone number
- Diabetes type (Type 1 or Type 2)
- 5-7 glucose readings throughout the day
- Mix of normal, warning, and critical readings
- Historical data for chart visualization

---

## 🆘 Troubleshooting

### Error: "password authentication failed"
**Solution:**
- Double-check your password
- Try resetting it: Supabase → Settings → Database → Reset Password
- Make sure there are no extra spaces

### Error: "table already exists"
**Issue:** Your data might already be seeded!
**Solution:**
- Check the app at http://localhost:5173/
- If patients are there, you're good to go
- If you want to re-seed, delete the tables first

### Error: "relation does not exist"
**Issue:** The schema hasn't been created yet
**Solution:**
- Run `supabase/schema.sql` first
- Then run `supabase/seed_example_data.sql`

### No patients showing in app
**Check:**
1. Are you logged in as a **caregiver**?
2. Is your user ID matching the one in the seed data?
3. Check browser console for errors (F12)

### Run SQL Directly
If all else fails, manually run the SQL:

1. Open the file: `supabase/seed_example_data.sql`
2. Copy ALL contents
3. Go to https://app.supabase.com/projects
4. Open SQL Editor
5. Create New Query
6. Paste & Run

---

## 📞 Need More Help?

Files involved:
- **Schema:** `supabase/schema.sql` (create tables)
- **Example Data:** `supabase/seed_example_data.sql` (add 10 patients)
- **Documentation:** `EXAMPLE_DATA.md` (what each patient's data looks like)

Commands to try:
```bash
# Check seed file
cat supabase/seed_example_data.sql

# Check Node modules are installed
npm list pg dotenv

# Check Python setup
pip list | grep psycopg2
```

---

## 🎯 Success Checklist

- [ ] Database password obtained
- [ ] Seed SQL executed (no errors)
- [ ] App refreshed in browser
- [ ] Logged in as caregiver
- [ ] See 10 patients on dashboard
- [ ] Some patients show warning/critical alerts
- [ ] Glucose charts display data

✨ **Once all checked, you're ready to test your app!**
