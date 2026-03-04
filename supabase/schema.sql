-- Create a table for profiles (users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  diabetes_type TEXT CHECK (diabetes_type IN ('T1', 'T2')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Users can insert their own profile."
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile."
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can read own profile."
  ON profiles FOR SELECT
  USING (auth.uid() = id);


-- Create a table for glucose readings
CREATE TABLE readings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  value NUMERIC NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  meal_context TEXT NOT NULL CHECK (meal_context IN ('fasting', 'before_meal', 'after_meal', 'bedtime', 'night', 'other')),
  note TEXT
);

-- Enable RLS for readings
ALTER TABLE readings ENABLE ROW LEVEL SECURITY;

-- Policies for readings
CREATE POLICY "Users can insert their own readings."
  ON readings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read their own readings."
  ON readings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own readings."
  ON readings FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own readings."
  ON readings FOR UPDATE
  USING (auth.uid() = user_id);
-- Clean up and ensure users are confirmed so email-confirmation steps are not required
-- Mark any existing users as confirmed
UPDATE auth.users SET email_confirmed_at = NOW() WHERE email_confirmed_at IS NULL;
UPDATE auth.users SET confirmed_at = NOW() WHERE confirmed_at IS NULL;

-- Note: remove any policies/triggers that force email re-send or confirmation from the auth schema
