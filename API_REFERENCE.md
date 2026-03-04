# API Reference

Complete API documentation for Htech hooks, contexts, and utilities.

---

## 📋 Table of Contents

1. [Contexts](#contexts)
2. [Hooks](#hooks)
3. [Components](#components)
4. [Types](#types)
5. [Utilities](#utilities)

---

## Contexts

Contexts provide global state management for the app.

### AuthContext

Handles authentication state and user session management.

**Location:** `src/contexts/AuthContext.tsx`

**Export:** `useAuth()` hook

**Usage:**
```tsx
import { useAuth } from '../contexts/AuthContext';

export function MyComponent() {
  const { user, session, isLoading, signOut } = useAuth();
  
  if (isLoading) return <div>Loading...</div>;
  if (!user) return <div>Not authenticated</div>;
  
  return (
    <div>
      <p>Welcome, {user.email}</p>
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
}
```

**API:**

```tsx
interface AuthContext {
  user: User | null;           // Current authenticated user
  session: Session | null;      // Auth session object
  isLoading: boolean;           // Auth loading state
  signOut: () => Promise<void>; // Sign out function
}

// User object from Supabase
interface User {
  id: string;
  email: string;
  created_at: string;
  // ... other Supabase user properties
}

// Session object
interface Session {
  access_token: string;
  token_type: string;
  expires_in: number;
  expires_at?: number;
  refresh_token?: string;
  user: User;
}
```

**Initialization:**
- Automatically initializes on app load
- Restores session from storage if available
- Sets isLoading=true until session is checked

**Requirements:**
- Must be inside `<AuthProvider>` component (in App.tsx)

---

### ReadingsContext

Manages glucose readings data.

**Location:** `src/contexts/ReadingsContext.tsx`

**Export:** `useReadings()` hook

**Usage:**
```tsx
import { useReadings } from '../contexts/ReadingsContext';

export function MyComponent() {
  const { readings, addReading, getReadings, isLoading } = useReadings();
  
  React.useEffect(() => {
    getReadings();
  }, []);
  
  return (
    <div>
      {readings.map(reading => (
        <div key={reading.id}>
          {reading.reading_value} mg/dL at {reading.timestamp}
        </div>
      ))}
    </div>
  );
}
```

**API:**

```tsx
interface ReadingsContext {
  readings: Reading[];                    // All glucose readings
  isLoading: boolean;                     // Data loading state
  error: string | null;                   // Error message if any
  addReading: (value: number) => Promise<void>;  // Log new reading
  getReadings: () => Promise<void>;       // Fetch all readings
  getReadingsByDate: (startDate: Date, endDate: Date) => Promise<Reading[]>;
  deleteReading: (id: string) => Promise<void>;  // Remove reading
}

interface Reading {
  id: string;
  user_id: string;
  reading_value: number;          // mg/dL
  timestamp: string;              // When reading was taken
  created_at: string;             // When record created
}
```

**Requirements:**
- Must be inside `<ReadingsProvider>` component
- User must be authenticated (uses AuthContext)
- Queries Supabase glucose_readings table

---

### LanguageContext

Manages app language and translations.

**Location:** `src/contexts/LanguageContext.tsx`

**Export:** `useLanguage()` hook

**Usage:**
```tsx
import { useLanguage } from '../contexts/LanguageContext';

export function MyComponent() {
  const { t, language, setLanguage } = useLanguage();
  
  return (
    <div>
      <p>{t('welcome')}</p>
      <button onClick={() => setLanguage('ar')}>
        {language === 'en' ? 'العربية' : 'English'}
      </button>
    </div>
  );
}
```

**API:**

```tsx
interface LanguageContext {
  language: 'en' | 'ar';                      // Current language
  t: (key: string, fallback?: string) => string;   // Translation function
  setLanguage: (lang: 'en' | 'ar') => void;  // Switch language
}

// Translation function params
t(key: string)           // returns translated string or key
t('welcome')             // looks up in locales/[lang].json
t('key.nested.deep')     // supports nested keys
```

**Supported Languages:**
- `en` - English
- `ar` - Arabic (RTL)

**Translation Files:**
- `src/locales/en.json` - English strings
- `src/locales/ar.json` - Arabic strings

**Storage:**
- Language preference saved to localStorage
- Persists across sessions

---

## Hooks

Custom React hooks for common functionality.

### useAuth()

Get current authentication state.

**Location:** `src/contexts/AuthContext.tsx`

```tsx
const { user, session, isLoading, signOut } = useAuth();
```

**Returns:** AuthContext object

**Throws:** Error if used outside AuthProvider

---

### useReadings()

Manage glucose readings data.

**Location:** `src/contexts/ReadingsContext.tsx`

```tsx
const { readings, addReading, getReadings, isLoading } = useReadings();
```

**Returns:** ReadingsContext object

**Throws:** Error if used outside ReadingsProvider

---

### useLanguage()

Access translation and language switching.

**Location:** `src/contexts/LanguageContext.tsx`

```tsx
const { t, language, setLanguage } = useLanguage();
```

**Returns:** LanguageContext object

**Throws:** Error if used outside LanguageProvider

---

### useDiabetes()

Manage diabetes-related data and calculations.

**Location:** `src/hooks/useDiabetes.ts`

```tsx
export function useDiabetes() {
  // Returns diabetes-related utilities
}
```

**API:**

```tsx
interface DiabetesHook {
  // Get readings in range
  getReadingsInRange: (
    readings: Reading[],
    minValue: number,
    maxValue: number
  ) => Reading[];
  
  // Calculate average
  calculateAverage: (readings: Reading[]) => number;
  
  // Get trend
  calculateTrend: (readings: Reading[]) => 'increasing' | 'stable' | 'decreasing';
  
  // Format reading
  formatReading: (value: number) => string;
}
```

**Usage Example:**
```tsx
const diabetes = useDiabetes();
const avg = diabetes.calculateAverage(readings);
const inRange = diabetes.getReadingsInRange(readings, 70, 180);
```

---

## Components

Reusable UI components.

### Button

Styled button component with variants.

**Location:** `src/components/Button.tsx`

```tsx
import { Button } from '../components';

<Button variant="primary" onClick={handleClick}>
  Click Me
</Button>
```

**Props:**

```tsx
interface ButtonProps {
  children: React.ReactNode;           // Button text/content
  variant?: 'primary' | 'secondary';   // Style variant
  size?: 'sm' | 'md' | 'lg';           // Button size
  disabled?: boolean;                   // Disabled state
  loading?: boolean;                    // Show loading state
  onClick?: (e: React.MouseEvent) => void;
  className?: string;                   // Additional CSS
  type?: 'button' | 'submit' | 'reset'; // HTML type
}
```

**Variants:**
- `primary` - Blue/action button
- `secondary` - Gray/secondary button

---

### Card

Container/card component for content.

**Location:** `src/components/Card.tsx`

```tsx
import { Card } from '../components';

<Card>
  <h2>Title</h2>
  <p>Content goes here</p>
</Card>
```

**Props:**

```tsx
interface CardProps {
  children: React.ReactNode;   // Card content
  className?: string;          // Additional CSS
  onClick?: () => void;        // Click handler
}
```

**CSS Classes:**
- Base: `border border-htech-border rounded-lg bg-htech-surface`
- Padding: `p-6`
- Mobile friendly

---

### GlucoseChart

Chart visualization for glucose readings.

**Location:** `src/components/GlucoseChart.tsx`

```tsx
import { GlucoseChart } from '../components';

<GlucoseChart readings={readings} />
```

**Props:**

```tsx
interface GlucoseChartProps {
  readings: Reading[];         // Glucose readings to display
  height?: number;             // Chart height in pixels (default: 300)
  width?: number;              // Chart width in pixels
  showLegend?: boolean;        // Show/hide legend
}
```

**Integration:**
- Uses Chart.js library
- Responsive to container size
- Displays readings as line chart over time

---

### DangerAlert

Alert component for warnings/errors.

**Location:** `src/components/DangerAlert.tsx`

```tsx
import { DangerAlert } from '../components';

<DangerAlert>
  Something went wrong!
</DangerAlert>
```

**Props:**

```tsx
interface DangerAlertProps {
  children: React.ReactNode;   // Alert message
  onClose?: () => void;        // Close handler
}
```

**Styling:**
- Red background: `bg-red-900/50`
- Red border: `border-red-500`
- Red text: `text-red-200`

---

### BottomNav

Mobile navigation at bottom of screen.

**Location:** `src/components/BottomNav.tsx`

```tsx
import { BottomNav } from '../components';

<BottomNav>
  <NavItem icon="home" label="Home" />
  <NavItem icon="plus" label="Log" />
</BottomNav>
```

**Props:**

```tsx
interface BottomNavProps {
  children: React.ReactNode;   // Navigation items
}

interface NavItemProps {
  icon: string;                // Icon name
  label: string;               // Link label
  href?: string;               // Link URL
  onClick?: () => void;        // Click handler
  active?: boolean;            // Active state
}
```

---

## Types

TypeScript interfaces and types.

### User Type

```tsx
interface User {
  id: string;                  // UUID
  email: string;               // Email address
  created_at: string;          // ISO timestamp
  // ... other Supabase fields
}
```

### Reading Type

```tsx
interface Reading {
  id: string;                  // UUID primary key
  user_id: string;             // User UUID
  reading_value: number;       // mg/dL
  timestamp: string;           // When reading was taken (ISO)
  created_at: string;          // When record was created (ISO)
}
```

### Caregiver Type

```tsx
interface Caregiver {
  id: string;                  // UUID
  user_id: string;             // User UUID
  caregiver_email: string;     // Email address
  relationship: string;        // e.g., 'parent', 'spouse'
  created_at: string;          // ISO timestamp
}
```

### Common Types

**Location:** `src/types/`

```tsx
// src/types/common.ts
export type AuthMode = 'signin' | 'signup';
export type Theme = 'light' | 'dark';
export type Language = 'en' | 'ar';

// src/types/glucose.ts
export interface GlucoseReading extends Reading {
  // Extended glucose-specific fields
}

export interface GlucoseTrend {
  direction: 'up' | 'down' | 'stable';
  percentage: number;
  timeframe: '1h' | '3h' | '1d' | '7d';
}
```

---

## Utilities

Utility functions for common tasks.

### storage.ts

Local storage wrapper.

**Location:** `src/utils/storage.ts`

```tsx
import { storage } from '../utils/storage';

// Set value
storage.setItem('key', { data: 'value' });

// Get value
const data = storage.getItem('key');

// Remove value
storage.removeItem('key');

// Clear all
storage.clear();
```

**API:**

```tsx
const storage = {
  setItem: (key: string, value: any) => void;
  getItem: (key: string) => any;
  removeItem: (key: string) => void;
  clear: () => void;
};
```

### Supabase Client

Supabase integration.

**Location:** `src/lib/supabase.ts`

```tsx
import { supabase } from '../lib/supabase';

// Sign up
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123'
});

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123'
});

// Sign out
await supabase.auth.signOut();

// Get user
const { data: { user } } = await supabase.auth.getUser();

// Database queries
const { data, error } = await supabase
  .from('glucose_readings')
  .select('*')
  .eq('user_id', userId);
```

**Supabase Documentation:**
https://supabase.com/docs

---

## Data Flow

```
User Input
    ↓
Component (AuthPage, LogReadingPage, etc.)
    ↓
Event Handler (handleAuth, handleAddReading, etc.)
    ↓
Hook/Context (useAuth, useReadings, useLanguage)
    ↓
Supabase Client (Database/Auth)
    ↓
State Update
    ↓
Component Re-render
```

---

## Error Handling

### Try-Catch Pattern

```tsx
try {
  const { error } = await supabase.auth.signUp({...});
  if (error) throw error;
  // Success
} catch (err: any) {
  setError(err.message || 'An error occurred');
}
```

### Common Errors

```tsx
interface AuthError {
  message: string;
  status?: number;
  code?: string;
}

// Examples:
'Invalid login credentials'            // Wrong password
'User already registered'              // Email exists
'Password should be at least 6 characters'
'Email address invalid'
```

---

## Performance Tips

1. **Use useCallback for event handlers:**
   ```tsx
   const handleClick = useCallback(() => {}, []);
   ```

2. **Memoize expensive components:**
   ```tsx
   export const MyComponent = React.memo(function MyComponent(props) {});
   ```

3. **Lazy load components:**
   ```tsx
   const LogReadingPage = React.lazy(() => import('./LogReadingPage'));
   ```

4. **Minimize re-renders:**
   ```tsx
   // Good: Pass primitive props
   <Component value={status} />
   
   // Bad: Pass object literals
   <Component style={{ color: 'red' }} />
   ```

---

## Testing Examples

### Testing Auth

```tsx
// Test sign-up
fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
fireEvent.change(passwordInput, { target: { value: 'test123456' } });
fireEvent.change(confirmInput, { target: { value: 'test123456' } });
fireEvent.click(signUpButton);

await waitFor(() => {
  expect(successMessage).toBeInTheDocument();
});
```

### Testing Hooks

```tsx
const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });
expect(result.current.user).toBeNull();
expect(result.current.isLoading).toBe(false);
```

---

**Last Updated:** March 4, 2026

For more information, see [README.md](README.md) and [DEVELOPMENT.md](DEVELOPMENT.md)
