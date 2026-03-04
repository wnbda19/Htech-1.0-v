# Htech - Diabetes Management App

A modern React-based diabetes management application built with TypeScript, Vite, and Supabase.

**Live:** https://daibeieieieieie.vercel.app

---

## 📋 Project Overview

Htech is a comprehensive diabetes tracking and management application that helps users:
- Log blood glucose readings
- Track glucose trends with charts
- Manage caregivers
- Request doctor consultations
- Switch between languages (English/Arabic)
- Manage authentication securely

---

## 🛠️ Tech Stack

- **Frontend Framework:** React 19.2.0 with TypeScript 5.6
- **Build Tool:** Vite 7.3.1
- **Styling:** Tailwind CSS with custom `htech-*` theme
- **Backend:** Supabase (PostgreSQL + Auth)
- **Deployment:** Vercel
- **State Management:** React Hooks (useState, useContext)

---

## 📁 Project Structure

```
daibeieieieieie/
├── src/
│   ├── App.tsx                 # Main app component & routing
│   ├── main.tsx                # Entry point
│   ├── index.css               # Global styles
│   ├── components/             # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── GlucoseChart.tsx
│   │   ├── DangerAlert.tsx
│   │   ├── BottomNav.tsx
│   │   └── index.ts
│   ├── pages/                  # Page components
│   │   ├── AuthPage.tsx        # Login/Sign-up
│   │   ├── HomePage.tsx        # Main dashboard
│   │   ├── LogReadingPage.tsx  # Log glucose readings
│   │   ├── CaregiverPage.tsx   # Manage caregivers
│   │   ├── AskDoctorPage.tsx   # Doctor consultation
│   │   └── index.ts
│   ├── contexts/               # React contexts
│   │   ├── AuthContext.tsx     # Authentication state
│   │   ├── ReadingsContext.tsx # Glucose readings state
│   │   ├── LanguageContext.tsx # Language/i18n state
│   │   └── index.ts
│   ├── hooks/                  # Custom React hooks
│   │   ├── useDiabetes.ts      # Diabetes data management
│   │   ├── useLanguage.ts      # Language switching
│   │   └── index.ts
│   ├── lib/
│   │   └── supabase.ts         # Supabase client config
│   ├── types/                  # TypeScript types
│   │   ├── common.ts
│   │   ├── glucose.ts
│   │   └── index.ts
│   ├── utils/                  # Utilities
│   │   └── storage.ts
│   └── locales/                # Translations
│       ├── en.json
│       └── ar.json
├── dataconnect/                # Firebase Data Connect
│   ├── schema/
│   │   └── schema.gql
│   └── example/
│       ├── queries.gql
│       └── mutations.gql
├── supabase/                   # Supabase config
│   ├── config.toml
│   └── schema.sql
├── public/                     # Static assets
├── dist/                       # Production build output
├── .vercel/                    # Vercel deployment config
├── vite.config.ts
├── tsconfig.json
├── package.json
└── firebase.json
```

---

## 🔐 Authentication System

### Overview
- **Type:** Email + Password authentication
- **Provider:** Supabase
- **Email Confirmation:** Disabled (immediate account activation)
- **Session Management:** Automatic with Supabase

### Sign-Up Flow
1. User enters email and password
2. User confirms password (must match)
3. Password validated (minimum 6 characters)
4. Account created in Supabase
5. User can sign in immediately

### Sign-In Flow
1. User enters email and password
2. Supabase authenticates credentials
3. Session token received
4. User redirected to app

### Password Requirements
- Minimum 6 characters
- Must match confirmation on sign-up
- Case-sensitive

---

## 📄 Key Components

### AuthPage (`src/pages/AuthPage.tsx`)
Handles authentication UI with sign-up/sign-in toggle.

**Features:**
- Mode toggle: "Sign In" / "Sign Up" buttons
- Email input field
- Password input field
- Confirm Password field (sign-up only)
- Error/success messaging
- Loading state during auth

**State Management:**
```tsx
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [confirmPassword, setConfirmPassword] = useState('');
const [isSigningUp, setIsSigningUp] = useState(false);
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
const [successMsg, setSuccessMsg] = useState<string | null>(null);
```

### AuthContext (`src/contexts/AuthContext.tsx`)
Global authentication state provider.

**Exports:**
- `useAuth()` hook
- `user` - Current user object
- `session` - Auth session
- `isLoading` - Auth loading state
- `signOut()` - Sign out function

### HomePage (`src/pages/HomePage.tsx`)
Main dashboard for glucose tracking and overview.

### LogReadingPage (`src/pages/LogReadingPage.tsx`)
Interface for recording new glucose readings.

### CaregiverPage (`src/pages/CaregiverPage.tsx`)
Manage caregiver contacts and permissions.

### AskDoctorPage (`src/pages/AskDoctorPage.tsx`)
Send consultation requests to doctor.

---

## 🎨 Theme & Styling

Custom Tailwind CSS theme colors:

```json
{
  "htech-bg": "Dark background",
  "htech-surface": "Surface/card background",
  "htech-border": "Border color",
  "htech-text": "Primary text",
  "htech-text-muted": "Secondary text",
  "htech-primary": "Primary action color"
}
```

---

## 🌍 Internationalization (i18n)

Supports English and Arabic.

**Files:**
- `src/locales/en.json` - English strings
- `src/locales/ar.json` - Arabic strings

**Usage:**
```tsx
const { t, language, setLanguage } = useLanguage();
<p>{t('greeting')}</p>
```

---

## 📦 Data Persistence & Supabase Tables

All patient and reading data is stored in Supabase so that nothing is lost when
navigating between pages or refreshing the browser. The existing status
calculations, thresholds, and UI logic remain unchanged—they simply operate on
state that is hydrated from the database.

### Key Tables

- `profiles` – standard Supabase auth profiles (real users)
- `readings` – glucose readings linked to `profiles` by `user_id`
- `caregiver_patients` – mock patients created by caregivers, keyed by text ID
- `caregiver_readings` – readings for those mock patients

### How it works

1. **Fetching:** on app load (and every 30 s) the app queries all relevant
   tables and reconstructs the in‑memory patient list.
2. **Saving:** when a caregiver adds a patient or a reading, an insert is made
to the corresponding table immediately.
3. **Status logic:** unchanged from before; averages and color codes are
recomputed on the client using the fetched data.

### Development Notes

- Supabase RLS policies are configured in `supabase/schema.sql` (look for the
  `caregiver_*` tables).
- No additional UI components were added – persistence is entirely behind the
scenes in `src/pages/CaregiverPage.tsx`.
- To test locally, make sure your `.env.local` points to a valid Supabase
  project and run the provided migrations (see `supabase/schema.sql`).

Persistence ensures a seamless experience: changes remain visible after
refreshing or leaving the page.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase project

### Installation

1. **Clone/Navigate to project:**
   ```bash
   cd daibeieieieieie
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Supabase:**
   - Create `.env.local` in project root:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```
   Opens at `http://localhost:5173`

---

## 📦 Available Scripts

```bash
# Install dependencies
npm install

# Start development server (hot reload)
npm run dev

# Type-check with TypeScript
npm run tsc

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run ESLint
npm run lint
```

---

## 🗄️ Database Schema

### Users Table
- `id` (UUID primary key)
- `email` (unique)
- `password` (hashed)
- `created_at` (timestamp)

### Glucose Readings Table
- `id` (UUID primary key)
- `user_id` (foreign key)
- `reading_value` (mg/dL)
- `timestamp` (reading time)
- `created_at` (record creation time)

### Caregivers Table
- `id` (UUID primary key)
- `user_id` (foreign key)
- `caregiver_email` (contact)
- `relationship` (parent, spouse, etc.)

---

## 🔄 State Management Flow

### Auth State
```
AuthContext
├── user (current user)
├── session (auth token)
├── isLoading (auth status)
└── signOut() (logout)
```

### Readings State
```
ReadingsContext
├── readings[] (glucose history)
├── addReading() (log new reading)
└── getReadings() (fetch from DB)
```

### Language State
```
LanguageContext
├── language (en|ar)
├── t() (translate function)
└── setLanguage() (switch language)
```

---

## 📊 Glucose Chart

The GlucoseChart component displays glucose readings over time using chart.js.

**Features:**
- Time series visualization
- Trend analysis
- Customizable date range
- Mobile responsive

---

## 🚢 Deployment

### Vercel

**Current Status:** Live at https://daibeieieieieie.vercel.app

**Deploy Process:**
1. Build project: `npm run build`
2. Generates `dist/` folder
3. Upload to Vercel: `vercel --prod`
4. Automatic preview on every push

**Environment Variables (Vercel):**
```env
VITE_SUPABASE_URL=production_url
VITE_SUPABASE_ANON_KEY=production_key
```

---

## 🐛 Troubleshooting

### Build Errors
- Clear `node_modules`: `rm -r node_modules && npm install`
- Clear Vite cache: `rm -r dist/ && npm run build`

### Type Errors
- Run: `npm run tsc` to check all TypeScript errors
- Check `tsconfig.json` for config

### Auth Issues
- Verify Supabase credentials in `.env.local`
- Check Supabase Auth settings (email confirmation should be disabled)
- Confirm user exists in Supabase Auth dashboard

### Styling Issues
- Tailwind CSS cache: `npm run build -- --no-cache`
- Check `tailwind.config.js` for custom theme

---

## 📝 Recent Changes (March 2026)

### Version 1.2.0 - Password Confirmation
- Added password confirmation field to sign-up form
- Password validation (minimum 6 characters)
- Confirm password must match
- Only shows confirmation field in sign-up mode

### Version 1.1.0 - Sign-Up/Sign-In Toggle
- Added mode toggle buttons (Sign In / Sign Up)
- Separate auth flows for sign-up and sign-in
- Clear UI for switching between modes

### Version 1.0.0 - Initial Release
- Email + Password authentication
- Removed email confirmation requirement
- Removed mock session logic
- Removed rate-limit Wi-Fi/cellular alerts

---

## 🔧 Configuration Files

### `vite.config.ts`
Vite build configuration.

### `tsconfig.json`
TypeScript compiler options.

### `supabase/config.toml`
Local Supabase development configuration.
- `email_confirm = false` - No email verification required

### `supabase/schema.sql`
Database schema with tables and policies.

---

## 📚 Dependencies

### Main
- `react` - UI framework
- `react-dom` - DOM rendering
- `react-router-dom` - Routing
- `@supabase/supabase-js` - Backend
- `tailwindcss` - Styling
- `chart.js` - Charting

### Dev
- `typescript` - Type safety
- `vite` - Build tool
- `eslint` - Code linting

---

## 🤝 Contributing

This is a personal project. For modifications:

1. Create feature branch: `git checkout -b feature/name`
2. Make changes and test locally
3. Build for production: `npm run build`
4. Deploy via Vercel CLI: `vercel --prod`

---

## 📄 License

Private project.

---

## 📧 Contact & Support

- **App:** https://daibeieieieieie.vercel.app
- **Developer:** Mohammed

---

## ✅ Checklist for New Features

When adding features:
- [ ] Update types in `src/types/`
- [ ] Add component to `src/components/` or `src/pages/`
- [ ] Add state management (context or hook)
- [ ] Update translations in `src/locales/`
- [ ] Test on localhost: `npm run dev`
- [ ] Build: `npm run build`
- [ ] Deploy: `vercel --prod`
- [ ] Test on production

---

**Last Updated:** March 4, 2026
