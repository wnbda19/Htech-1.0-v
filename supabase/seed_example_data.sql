-- Example Data for Diabetes Monitoring App
-- This script seeds the database with example patients and glucose readings
-- for demonstration and testing purposes

-- First, let's create example caregiver patients
-- Patient 1: Ahmed Hassan
INSERT INTO caregiver_patients (id, caregiver_id, name, phone, diabetes_type, created_at)
VALUES (
  'patient_001',
  '00000000-0000-0000-0000-000000000001', -- Caregiver ID (replace with actual caregiver UUID)
  'Ahmed Hassan',
  '+966501234567',
  'TYPE_1',
  NOW() - INTERVAL '30 days'
);

-- Patient 2: Leila Ahmed
INSERT INTO caregiver_patients (id, caregiver_id, name, phone, diabetes_type, created_at)
VALUES (
  'patient_002',
  '00000000-0000-0000-0000-000000000001',
  'Leila Ahmed',
  '+966501234568',
  'TYPE_2',
  NOW() - INTERVAL '45 days'
);

-- Patient 3: Omar Mohamed
INSERT INTO caregiver_patients (id, caregiver_id, name, phone, diabetes_type, created_at)
VALUES (
  'patient_003',
  '00000000-0000-0000-0000-000000000001',
  'Omar Mohamed',
  '+966501234569',
  'TYPE_2',
  NOW() - INTERVAL '20 days'
);

-- Patient 4: Fatima Ali
INSERT INTO caregiver_patients (id, caregiver_id, name, phone, diabetes_type, created_at)
VALUES (
  'patient_004',
  '00000000-0000-0000-0000-000000000001',
  'Fatima Ali',
  '+966501234570',
  'TYPE_1',
  NOW() - INTERVAL '60 days'
);

-- Patient 5: Mohammed Ibrahim
INSERT INTO caregiver_patients (id, caregiver_id, name, phone, diabetes_type, created_at)
VALUES (
  'patient_005',
  '00000000-0000-0000-0000-000000000001',
  'Mohammed Ibrahim',
  '+966501234571',
  'TYPE_2',
  NOW() - INTERVAL '15 days'
);

-- Glucose readings for Patient 1 (Ahmed Hassan) - Type 1
-- Normal range: 80-130 mg/dL (fasting), Target during day: 80-180 mg/dL
INSERT INTO caregiver_readings (patient_id, value, timestamp) VALUES
('patient_001', 95, NOW() - INTERVAL '6 hours'),    -- Normal fasting
('patient_001', 145, NOW() - INTERVAL '5 hours'),   -- After breakfast
('patient_001', 120, NOW() - INTERVAL '4 hours'),   -- Before lunch
('patient_001', 165, NOW() - INTERVAL '3 hours'),   -- After lunch (slightly high)
('patient_001', 150, NOW() - INTERVAL '2 hours'),   -- Before dinner
('patient_001', 180, NOW() - INTERVAL '1 hour'),    -- After dinner
('patient_001', 140, NOW());                        -- Evening check

-- Glucose readings for Patient 2 (Leila Ahmed) - Type 2
-- Normal range: <100 mg/dL fasting, <140 mg/dL after meals
INSERT INTO caregiver_readings (patient_id, value, timestamp) VALUES
('patient_002', 110, NOW() - INTERVAL '8 hours'),   -- Fasting (slightly high)
('patient_002', 155, NOW() - INTERVAL '7 hours'),   -- After breakfast (warning)
('patient_002', 125, NOW() - INTERVAL '6 hours'),   -- Before lunch
('patient_002', 170, NOW() - INTERVAL '5 hours'),   -- After lunch (high warning)
('patient_002', 200, NOW() - INTERVAL '4 hours'),   -- Before dinner (critical)
('patient_002', 185, NOW() - INTERVAL '3 hours'),   -- After dinner (critical)
('patient_002', 145, NOW() - INTERVAL '2 hours'),   -- Evening check
('patient_002', 115, NOW());                        -- Night check

-- Glucose readings for Patient 3 (Omar Mohamed) - Type 2
-- Stable readings
INSERT INTO caregiver_readings (patient_id, value, timestamp) VALUES
('patient_003', 105, NOW() - INTERVAL '7 hours'),   -- Morning fasting
('patient_003', 135, NOW() - INTERVAL '6 hours'),   -- After breakfast
('patient_003', 110, NOW() - INTERVAL '5 hours'),   -- Before lunch
('patient_003', 145, NOW() - INTERVAL '4 hours'),   -- After lunch
('patient_003', 120, NOW() - INTERVAL '3 hours'),   -- Before dinner
('patient_003', 140, NOW() - INTERVAL '2 hours'),   -- After dinner
('patient_003', 118, NOW());                        -- Evening check

-- Glucose readings for Patient 4 (Fatima Ali) - Type 1
-- Well controlled readings
INSERT INTO caregiver_readings (patient_id, value, timestamp) VALUES
('patient_004', 92, NOW() - INTERVAL '8 hours'),    -- Fasting
('patient_004', 138, NOW() - INTERVAL '7 hours'),   -- After breakfast
('patient_004', 110, NOW() - INTERVAL '6 hours'),   -- Before lunch
('patient_004', 155, NOW() - INTERVAL '5 hours'),   -- After lunch
('patient_004', 115, NOW() - INTERVAL '4 hours'),   -- Before dinner
('patient_004', 148, NOW() - INTERVAL '3 hours'),   -- After dinner
('patient_004', 125, NOW() - INTERVAL '2 hours'),   -- Evening check
('patient_004', 98, NOW());                         -- Night check

-- Glucose readings for Patient 5 (Mohammed Ibrahim) - Type 2
-- Recently diagnosed, readings need improvement
INSERT INTO caregiver_readings (patient_id, value, timestamp) VALUES
('patient_005', 130, NOW() - INTERVAL '6 hours'),   -- Morning fasting (high warning)
('patient_005', 180, NOW() - INTERVAL '5 hours'),   -- After breakfast (warning)
('patient_005', 165, NOW() - INTERVAL '4 hours'),   -- Before lunch (warning)
('patient_005', 210, NOW() - INTERVAL '3 hours'),   -- After lunch (critical)
('patient_005', 190, NOW() - INTERVAL '2 hours'),   -- Before dinner (high warning)
('patient_005', 205, NOW() - INTERVAL '1 hour'),    -- After dinner (critical)
('patient_005', 175, NOW());                        -- Evening check

-- Optional: Add readings from previous days for Patient 1 for historical data
INSERT INTO caregiver_readings (patient_id, value, timestamp) VALUES
('patient_001', 98, NOW() - INTERVAL '1 day - 8 hours'),
('patient_001', 142, NOW() - INTERVAL '1 day - 7 hours'),
('patient_001', 115, NOW() - INTERVAL '1 day - 6 hours'),
('patient_001', 160, NOW() - INTERVAL '1 day - 5 hours'),
('patient_001', 135, NOW() - INTERVAL '1 day - 4 hours'),
('patient_001', 175, NOW() - INTERVAL '1 day - 3 hours'),
('patient_001', 145, NOW() - INTERVAL '1 day - 2 hours');

-- Glucose reading reference ranges:
-- Type 1 & Type 2 Diabetes:
--   Fasting (before breakfast): 80-130 mg/dL (ideal)
--   After meals (2 hours): <180 mg/dL (ideal)
--   Bedtime: 90-150 mg/dL (ideal)
-- 
-- Warning levels (Yellow): 
--   >150 mg/dL (for Type 1)
--   >155 mg/dL (for Type 2)
--   <70 mg/dL (hypoglycemia)
--
-- Critical levels (Red):
--   >200 mg/dL 
--   <54 mg/dL (severe hypoglycemia)
