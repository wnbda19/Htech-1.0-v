# Example Data Documentation

## Overview
This document describes the example patient and glucose reading data included in the diabetes monitoring application for demonstration and testing purposes.

## Example Patients

### Patient 1: Ahmed Hassan (patient_001)
- **Type**: Type 1 Diabetes
- **Phone**: +966501234567
- **Created**: 30 days ago
- **Status**: Well-controlled glucose levels
- **Readings**: 7-14 readings per day covering fasting, pre-meal, and post-meal measurements

### Patient 2: Leila Ahmed (patient_002)
- **Type**: Type 2 Diabetes
- **Phone**: +966501234568
- **Created**: 45 days ago
- **Status**: ⚠️ **Warning** - Multiple high readings and critical glucose levels
- **Readings**: Multiple critical readings (>200 mg/dL) indicating need for intervention
- **Use Case**: Demonstrates warning and critical alert functionality

### Patient 3: Omar Mohamed (patient_003)
- **Type**: Type 2 Diabetes
- **Phone**: +966501234569
- **Created**: 20 days ago
- **Status**: ✅ Stable and well-managed
- **Readings**: Consistent readings within target ranges throughout the day
- **Use Case**: Example of well-managed patient

### Patient 4: Fatima Ali (patient_004)
- **Type**: Type 1 Diabetes
- **Phone**: +966501234570
- **Created**: 60 days ago
- **Status**: ✅ Excellent control
- **Readings**: Consistently within optimal ranges
- **Use Case**: Best practice example with good glucose management

### Patient 5: Mohammed Ibrahim (patient_005)
- **Type**: Type 2 Diabetes
- **Phone**: +966501234571
- **Created**: 15 days ago
- **Status**: ⚠️ **Critical** - Recently diagnosed, needs intervention
- **Readings**: Multiple critical readings indicating newly diagnosed patient needing medication adjustment
- **Use Case**: Demonstrates critical alert scenarios and critical patient overview

## Glucose Reading Reference Ranges

### Target Ranges (Ideal)
```
Fasting (before breakfast):    80-130 mg/dL
After meals (2 hours):         <180 mg/dL
Bedtime:                       90-150 mg/dL
```

### Alert Levels

#### ⚠️ Warning (Yellow)
```
Type 1 Diabetes:    >150 mg/dL
Type 2 Diabetes:    >155 mg/dL
Either Type:        <70 mg/dL (Hypoglycemia)
```

#### 🔴 Critical (Red)
```
>200 mg/dL    (Hyperglycemia)
<54 mg/dL     (Severe Hypoglycemia)
```

## Application Features Demonstrated

### 1. Patient Observable States
- **Patient 1 & 3 & 4**: Demonstrate normal/stable patient display
- **Patient 2 & 5**: Demonstrate warning and critical states with visual indicators

### 2. Glucose Chart Visualization
- Multiple data points throughout the day
- Line charts showing glucose trends
- Historical data from previous days (Patient 1)

### 3. Caregiver Dashboard
- Patient count: 5 patients
- Alert counts based on current readings:
  - Warning count: Shows patients with elevated readings
  - Critical count: Shows patients with critically high/low readings

### 4. Patient Details
- Real-time glucose status
- Recent readings history
- Trend analysis capability

## How to Add More Example Data

To add additional patients or readings:

1. **Add a new patient** to `seed_example_data.sql`:
```sql
INSERT INTO caregiver_patients (id, caregiver_id, name, phone, diabetes_type, created_at)
VALUES (
  'patient_NNN',
  'CAREGIVER_UUID',
  'Patient Name',
  '+966XXXXXXXXX',
  'TYPE_1' or 'TYPE_2',
  NOW()
);
```

2. **Add readings** for the patient:
```sql
INSERT INTO caregiver_readings (patient_id, value, timestamp) VALUES
('patient_NNN', 150, NOW() - INTERVAL '3 hours'),
('patient_NNN', 165, NOW());
```

3. **Run the seed script** against your Supabase database:
```bash
supabase db push  # Applies schema changes
# Then manually run seed_example_data.sql through Supabase dashboard
```

## Testing Scenarios

### Scenario 1: Normal Caregiver View
- View 5 patients with mixed health statuses
- Observe real-time alerts
- Test patient filtering/sorting

### Scenario 2: Critical Patient Response
- Identify Patient 2 (Leila) and Patient 5 (Mohammed) as critical
- Test alert notifications
- Verify critical UI elements are highlighted

### Scenario 3: Well-Managed Patient
- Use Patient 4 (Fatima) and Patient 3 (Omar) as positive examples
- Test stable reading displays
- Verify congratulations/positive feedback UI

### Scenario 4: Trend Analysis
- Use Patient 1's historical data to test trend charts
- Verify glucose trajectory visualization
- Test data filtering by date range

## Database Setup Instructions

### Prerequisites
- Supabase project set up
- Database schema applied (`schema.sql`)

### Steps to Load Example Data

1. **Via Supabase Dashboard**:
   - Navigate to SQL Editor
   - Copy contents of `seed_example_data.sql`
   - Paste and execute

2. **Via CLI** (if configured):
   ```bash
   supabase db push
   ```

3. **Via Docker** (for local development):
   ```bash
   docker exec supabase_db_1 psql -U postgres -d postgres -f seed_example_data.sql
   ```

## Notes

- Replace `'00000000-0000-0000-0000-000000000001'` with your actual caregiver user UUID
- Readings use `NOW()` for dynamic timestamps (simulating real-time data)
- All patient names and phone numbers are fictional examples
- Critical readings (>200 mg/dL) should trigger visual alerts in the UI
- Data demonstrates both Type 1 and Type 2 diabetes scenarios
