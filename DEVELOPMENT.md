# Development Guide

Complete guide for setting up and developing Htech locally.

---

## 🔧 Environment Setup

### Requirements
- **Node.js:** 18.0.0 or higher
- **npm:** 9.0.0 or higher
- **Git:** For version control
- **Supabase Account:** For backend (free tier available)

### Verify Installation
```bash
node --version    # Should be v18+
npm --version     # Should be v9+
git --version     # Any recent version
```

---

## 🚀 Initial Setup

### 1. Project Setup
```bash
# Navigate to project
cd c:\Users\Mohammed\Desktop\Vibe\daibeieieieieie

# Install dependencies
npm install

# Verify installation
npm run tsc  # TypeScript check
```

### 2. Environment Configuration

Create `.env.local` in project root:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Optional: API endpoints
VITE_API_URL=http://localhost:3000
```

Get these values from Supabase Dashboard:
1. Go to Settings → API
2. Copy "Project URL"
3. Copy "anon (public)" key

### 3. Start Development Server

```bash
npm run dev
```

Server runs at: **http://localhost:5173**

Features:
- Hot Module Replacement (HMR) - changes reload instantly
- TypeScript checking
- CSS processing

---

## 📂 Development Workflow

### Project Structure by Feature

**Authentication:**
- `src/pages/AuthPage.tsx` - UI
- `src/contexts/AuthContext.tsx` - State
- `src/lib/supabase.ts` - Client config

**Glucose Tracking:**
- `src/pages/LogReadingPage.tsx` - Log readings
- `src/contexts/ReadingsContext.tsx` - Readings state
- `src/components/GlucoseChart.tsx` - Chart display

**Localization:**
- `src/contexts/LanguageContext.tsx` - Language state
- `src/hooks/useLanguage.ts` - Translation hook
- `src/locales/en.json` - English strings
- `src/locales/ar.json` - Arabic strings

**UI Components:**
- `src/components/Button.tsx`
- `src/components/Card.tsx`
- `src/components/DangerAlert.tsx`
- `src/components/BottomNav.tsx`

---

## 🔨 Development Scripts

### Type Checking
```bash
npm run tsc

# Check specific file
npm run tsc -- src/pages/AuthPage.tsx
```

### Linting
```bash
npm run lint

# Fix automatically
npm run lint -- --fix
```

### Build (Production)
```bash
npm run build

# Output: dist/ folder
# Size: ~480 KB before gzip, ~145 KB gzipped
```

### Preview Production Build
```bash
npm run preview

# Test production bundle locally
# Access at http://localhost:4173
```

---

## 🔐 Authentication Development

### Supabase Auth Flow

**Sign Up:**
```tsx
const { error } = await supabase.auth.signUp({
  email: "user@example.com",
  password: "securepassword"
});
```

**Sign In:**
```tsx
const { error } = await supabase.auth.signInWithPassword({
  email: "user@example.com",
  password: "securepassword"
});
```

**Sign Out:**
```tsx
await supabase.auth.signOut();
```

**Get Current User:**
```tsx
const { data: { user } } = await supabase.auth.getUser();
```

### Testing Auth Locally

1. Create test user:
   - Email: `test@example.com`
   - Password: `test123456`

2. Sign in and verify session stored

3. Refresh page - session should persist

4. Open DevTools → Application → Cookies → Check `supabase-auth-token`

---

## 🗄️ Database Development

### Supabase Local Development

Start local Supabase (optional):
```bash
npx supabase start
```

Access local dashboard: http://localhost:54323

### Run SQL Migrations
```bash
# Apply schema from supabase/schema.sql
psql -h localhost -U postgres < supabase/schema.sql
```

### Common Queries

**Get user readings:**
```sql
SELECT * FROM glucose_readings 
WHERE user_id = 'user-uuid'
ORDER BY timestamp DESC;
```

**Insert reading:**
```sql
INSERT INTO glucose_readings (user_id, reading_value, timestamp)
VALUES ('user-uuid', 120, NOW());
```

---

## 🧪 Testing

### Manual Testing Checklist

**Sign Up:**
- [ ] Navigate to auth page
- [ ] Click "Sign Up"
- [ ] Enter email and password
- [ ] Click "Create Account"
- [ ] Verify success message
- [ ] Sign in with new credentials

**Sign In:**
- [ ] Enter existing user email
- [ ] Enter correct password
- [ ] Verify successful login

**Error Cases:**
- [ ] Wrong password → Error message
- [ ] Invalid email → Error message
- [ ] Passwords don't match (sign up) → Error message
- [ ] Password < 6 chars → Error message

**Data Persistence:**
- [ ] Log glucose reading
- [ ] Refresh page
- [ ] Verify reading still visible

---

## 🎨 Styling Development

### Tailwind CSS Configuration

File: `tailwind.config.js`

**Custom Colors:**
```javascript
colors: {
  'htech-bg': '#0f172a',
  'htech-surface': '#1e293b',
  'htech-border': '#334155',
  'htech-text': '#f1f5f9',
  'htech-text-muted': '#cbd5e1',
  'htech-primary': '#0ea5e9'
}
```

**Usage:**
```jsx
<div className="bg-htech-bg text-htech-text border border-htech-border">
  Content
</div>
```

### Dark Mode
Theme is dark-mode only. To add light mode:

1. Update `tailwind.config.js`
2. Add light color variants
3. Add theme toggle to `LanguageContext.tsx`

---

## 🌍 Internationalization

### Adding Translations

**1. Add to both locale files:**

`src/locales/en.json`:
```json
{
  "hello": "Hello",
  "goodbye": "Goodbye"
}
```

`src/locales/ar.json`:
```json
{
  "hello": "مرحبا",
  "goodbye": "وداعا"
}
```

**2. Use in component:**
```tsx
import { useLanguage } from '../hooks/useLanguage';

export function MyComponent() {
  const { t } = useLanguage();
  
  return <p>{t('hello')}</p>;
}
```

---

## 🐛 Debugging

### Browser DevTools

**React Components Tab:**
- Install: React Developer Tools browser extension
- Inspect component hierarchy
- View props and state

**Console Errors:**
- Check browser console (F12)
- Network tab for API calls
- Application tab for storage/cookies

### VS Code Debugging

**Launch Configuration** `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "Launch Chrome",
      "url": "http://localhost:5173",
      "webRoot": "${workspaceFolder}/src"
    }
  ]
}
```

### Common Issues

**Issue: Supabase connection fails**
- [ ] Check `.env.local` has correct URL and key
- [ ] Verify Supabase project is active
- [ ] Check browser console for 401/403 errors

**Issue: TypeScript errors**
```bash
npm run tsc  # See detailed errors
```

**Issue: Build fails**
```bash
# Clear cache
rm -r dist/ node_modules/.vite

npm install
npm run build
```

**Issue: Module not found**
- [ ] Check import path case (case-sensitive on Linux/Mac)
- [ ] Verify file exists
- [ ] Check `vite.config.ts` resolve aliases

---

## 📝 Code Style

### TypeScript Conventions

```tsx
// 1. Type all function params
const handleClick = (e: React.MouseEvent): void => {};

// 2. Define interfaces for data
interface User {
  id: string;
  email: string;
  created_at: Date;
}

// 3. Use proper return types
const fetchUser = async (): Promise<User> => {};

// 4. Avoid `any` type
// ❌ const data: any = ...
// ✅ const data: User = ...
```

### Component Structure

```tsx
import React, { useState } from 'react';

// 1. Imports
import { useAuth } from '../contexts/AuthContext';

// 2. Types
interface Props {
  title: string;
}

// 3. Component definition
export function MyComponent({ title }: Props) {
  // 4. Hooks
  const { user } = useAuth();
  const [state, setState] = useState('');

  // 5. Handlers
  const handleAction = () => {};

  // 6. Effects
  React.useEffect(() => {}, []);

  // 7. Render
  return (
    <div className="...">
      {title}
    </div>
  );
}
```

### Naming Conventions

```tsx
// Components: PascalCase
export function MyComponent() {}

// Functions: camelCase
const handleClick = () => {};

// Constants: UPPER_SNAKE_CASE
const MAX_READINGS = 100;

// Types/Interfaces: PascalCase
interface UserData {}

// Files: Component files are PascalCase, utilities are camelCase
// ✅ src/components/GlucoseChart.tsx
// ✅ src/utils/storage.ts
```

---

## 🔄 Git Workflow

### Basic Workflow

```bash
# Create feature branch
git checkout -b feature/password-confirmation

# Make changes
# ... edit files ...

# Stage and commit
git add .
git commit -m "Add password confirmation to sign-up"

# Push to remote
git push origin feature/password-confirmation

# Create pull request on GitHub
```

### Commit Message Format

```
feat: Add password confirmation to sign-up form
fix: Correct glucose chart date range
docs: Update README with new features
style: Format code with prettier
refactor: Extract auth logic to hook
test: Add auth tests
```

---

## 📦 Dependency Management

### Installing New Packages

```bash
# Add dependency
npm install package-name

# Add dev dependency
npm install --save-dev package-name

# Remove dependency
npm uninstall package-name
```

### Current Dependencies

**Production:**
- react, react-dom
- react-router-dom
- @supabase/supabase-js
- tailwindcss
- chart.js

**Development:**
- typescript
- vite
- @vitejs/plugin-react
- eslint

---

## ✅ Pre-Deployment Checklist

Before deploying to production:

- [ ] TypeScript compiles: `npm run tsc`
- [ ] No linting errors: `npm run lint`
- [ ] Build succeeds: `npm run build`
- [ ] Bundle size acceptable (~480 KB)
- [ ] Test features locally: `npm run dev`
- [ ] No console errors
- [ ] Error messages are user-friendly
- [ ] Performance acceptable
- [ ] Mobile responsive (test on device)

---

**Last Updated:** March 4, 2026
