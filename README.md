# 🩺 Htech — Glucose Monitoring App

> A modern, bilingual (English/Arabic) diabetes glucose monitoring web application for both patients and caregivers, powered by React, TypeScript, Vite, and Supabase.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-black?style=for-the-badge&logo=vercel)](https://daibeieieieieie.vercel.app)
[![License](https://img.shields.io/badge/License-Private-red?style=for-the-badge)]()
[![Version](https://img.shields.io/badge/Version-1.0.0-blue?style=for-the-badge)]()
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Pages & Components](#pages--components)
- [State Management](#state-management)
- [Database Schema](#database-schema)
- [Internationalization (i18n)](#internationalization-i18n)
- [Glucose Thresholds](#glucose-thresholds)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Changelog](#changelog)

---

## 🌟 Overview

**Htech** is a full-stack glucose monitoring progressive web app designed for:

- **Patients** — log, track, and visualize their blood glucose readings over time.
- **Caregivers** — manage multiple patients, log readings on their behalf, and monitor health trends.
- **Doctors (AI Assistant)** — an in-app AI chat that answers diabetes-related medical questions.

The app supports **English and Arabic** (RTL) with automatic layout flipping, and stores all data securely in **Supabase** with Row-Level Security (RLS) so each user only ever sees their own data.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 **Authentication** | Email + password sign-up / sign-in via Supabase Auth |
| 📊 **Glucose Dashboard** | Real-time chart of the last 20 readings with trend line |
| ➕ **Log Readings** | Add glucose readings with meal context (fasting, after meal, etc.) |
| 👨‍⚕️ **Caregiver Dashboard** | Manage multiple patients, track their readings and status |
| 🤖 **Ask a Doctor (AI)** | Conversational AI for diabetes-related medical queries |
| 🌍 **Bilingual UI** | Full English & Arabic support with RTL layout |
| 💾 **Persistent Storage** | All data stored in Supabase; survives page refresh |
| 🔒 **Security (RLS)** | Row-Level Security ensures data isolation per user |
| 📱 **Mobile-First** | Responsive bottom navigation, optimized for phones |
| ⚡ **Status Indicators** | Color-coded glucose status (low / normal / high / critical) |

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| [React](https://react.dev) | 19 | UI framework |
| [TypeScript](https://www.typescriptlang.org) | 5.9 | Type safety |
| [Vite](https://vitejs.dev) | 7 | Build tool & dev server |
| [React Router](https://reactrouter.com) | 7 | Client-side routing |
| [Tailwind CSS](https://tailwindcss.com) | 3 | Utility-first styling |

### Backend / BaaS
| Technology | Purpose |
|---|---|
| [Supabase](https://supabase.com) | PostgreSQL database, Auth, RLS |
| [Firebase Data Connect](https://firebase.google.com) | Optional GraphQL data layer |

### Notable Libraries
| Library | Purpose |
|---|---|
| `canvas-confetti` | Celebration animation on reading log |
| `lottie-react` | Animated illustrations |
| `mdi-react` | Material Design Icons |
| `sweetalert2` | Elegant alert dialogs |
| `uuid` | Unique ID generation |

---

## 📁 Project Structure

```
Htech-1.0-v/
├── public/                  # Static assets
│   └── vite.svg
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── BottomNav.tsx    # Mobile bottom navigation bar
│   │   ├── Button.tsx       # Styled button component
│   │   ├── Card.tsx         # Surface/card container
│   │   ├── DangerAlert.tsx  # Critical glucose alert banner
│   │   ├── GlucoseChart.tsx # Canvas-based trend chart
│   │   └── index.ts         # Component barrel export
│   ├── contexts/            # React Context providers
│   │   ├── AuthContext.tsx  # Auth state (user, session, signOut)
│   │   ├── ReadingsContext.tsx # Glucose readings state & thresholds
│   │   ├── LanguageContext.tsx # i18n language state
│   │   └── index.ts
│   ├── hooks/               # Custom React hooks
│   │   ├── useDiabetes.ts   # Glucose classification logic
│   │   ├── useLanguage.ts   # Language switcher hook
│   │   └── index.ts
│   ├── lib/
│   │   └── supabase.ts      # Supabase client initialization
│   ├── locales/             # Translation files
│   │   ├── en.json          # English strings
│   │   └── ar.json          # Arabic strings
│   ├── pages/               # Route-level page components
│   │   ├── AuthPage.tsx     # Sign-in / Sign-up page
│   │   ├── HomePage.tsx     # Patient dashboard (chart + readings)
│   │   ├── LogReadingPage.tsx # Add new glucose reading form
│   │   ├── AskDoctorPage.tsx  # AI doctor chat interface
│   │   ├── CaregiverPage.tsx  # Caregiver patient management
│   │   └── index.ts
│   ├── types/               # TypeScript type definitions
│   │   ├── glucose.ts       # GlucoseReading, MealContext types
│   │   ├── common.ts        # Shared utility types
│   │   └── index.ts
│   ├── utils/
│   │   └── storage.ts       # Local storage helpers
│   ├── dataconnect-generated/ # Auto-generated Firebase Data Connect SDK
│   ├── App.tsx              # Root layout with routing guard
│   ├── main.tsx             # App entry point
│   ├── index.css            # Global styles & Tailwind directives
│   └── vite-env.d.ts        # Vite environment type declarations
├── supabase/
│   ├── schema.sql           # Full DB schema + RLS policies
│   ├── seed_example_data.sql # Example seed data for development
│   └── config.toml          # Local Supabase CLI config
├── dataconnect/             # Firebase Data Connect config
│   ├── dataconnect.yaml
│   ├── schema/schema.gql
│   └── example/
├── .gitignore
├── eslint.config.js
├── firebase.json
├── index.html               # HTML shell
├── package.json
├── tsconfig.json
├── tsconfig.app.json
└── vite.config.ts           # Vite configuration
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18 or higher
- **npm** (included with Node.js)
- A **Supabase** project (free tier works)

### 1. Clone the repository

```bash
git clone https://github.com/wnbda19/Htech-1.0-v.git
cd Htech-1.0-v
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

> Find these values in your Supabase project → **Settings → API**.

### 4. Set up the database

Run the SQL schema in your Supabase SQL editor:

```bash
# Copy contents of supabase/schema.sql and run in Supabase dashboard
# Or use the Supabase CLI:
supabase db push
```

### 5. Start the development server

```bash
npm run dev
```

The app will be available at **http://localhost:5173**

---

## 🔐 Environment Variables

| Variable | Required | Description |
|---|---|---|
| `VITE_SUPABASE_URL` | ✅ Yes | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | ✅ Yes | Your Supabase anonymous public key |

> ⚠️ **Never commit `.env.local`** to version control. It is already listed in `.gitignore`.

---

## 📜 Available Scripts

```bash
# Start development server with hot reload
npm run dev

# Type-check with TypeScript (no emit)
npm run tsc

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run ESLint
npm run lint
```

---

## 📱 Pages & Components

### Pages

#### `AuthPage` — `/`
- Sign-in and Sign-up toggle with email + password.
- Password confirmation field shown only in sign-up mode.
- Validates password length (≥ 6 characters) and match before submission.
- Connects to Supabase Auth (`signUp`, `signInWithPassword`).

#### `HomePage` — `/`
- Patient's main dashboard shown after authentication.
- Displays the **GlucoseChart** (last 20 readings as a smooth canvas curve).
- Period filter buttons: Today / 7 Days / 30 Days.
- **Stats Cards**: Min, Max, Average glucose values.
- **Recent Readings** list with color-coded status indicators.
- Quick-action button → navigates to LogReadingPage.

#### `LogReadingPage` — `/log`
- Form to add a new glucose reading (mg/dL value + meal context).
- Meal context options: Fasting, Before Meal, After Meal, Bedtime, Night, Other.
- Saves to Supabase `readings` table.
- Confetti animation on successful submit.

#### `AskDoctorPage` — `/ask`
- AI-powered chat interface for diabetes-related questions.
- Maintains conversation history in local state.
- RTL-aware input layout for Arabic users.

#### `CaregiverPage` — `/caregiver`
- Lists all patients managed by the authenticated caregiver.
- Add new patients with: Name, Patient ID, Phone, Diabetes Type.
- Duplicate patient ID check before insert.
- Log glucose readings for individual patients.
- Color-coded glucose status badges per patient.
- Data persisted to `caregiver_patients` and `caregiver_readings` tables in Supabase.
- Auto-refreshes every 30 seconds.

### Key Components

#### `GlucoseChart`
Custom HTML5 Canvas renderer (no chart library dependency):
- Smooth bezier curve between data points.
- Gradient fill under the line.
- Safe range band (70–180 mg/dL) highlighted in teal.
- Dashed threshold lines at 70 and 180.
- RTL-aware (mirrors the X axis for Arabic users).
- Color-coded dots: teal = in range, red = out of range.

#### `BottomNav`
- Mobile-style bottom navigation with 4 tabs: Home, Log, Ask Doctor, Caregiver.
- Active tab highlighted in teal.
- Language toggle (EN/AR) button to switch locale.

#### `DangerAlert`
- Full-width critical alert banner shown when glucose is dangerously low or high.

#### `Button` / `Card`
- Reusable design-system primitives with `variant` props (`primary`, `secondary`, `ghost`).

---

## 🗂️ State Management

The app uses **React Context** for global state with three providers:

### `AuthContext`

```tsx
interface AuthContextValue {
  user: User | null;          // Current Supabase user
  session: Session | null;    // Current auth session
  isLoading: boolean;         // Auth initialization state
  signOut: () => Promise<void>;
}
```

**Key behavior:** On every page load, any existing browser session is deliberately cleared, forcing the user to re-authenticate each visit. This is intentional behavior requested by design.

### `ReadingsContext`

```tsx
interface ReadingsContextValue {
  readings: GlucoseReading[];
  addReading: (value: number, mealContext: MealContext) => Promise<void>;
  getReadings: () => Promise<void>;
}

// Thresholds used across the app:
export const GLUCOSE_THRESHOLDS = {
  dangerouslyLow: 54,   // mg/dL
  normalMin: 70,        // mg/dL
  normalMax: 180,       // mg/dL
  dangerouslyHigh: 250, // mg/dL
};
```

### `LanguageContext`

```tsx
interface LanguageContextValue {
  language: 'en' | 'ar';
  t: (key: string) => string;   // Translate a key
  isRTL: boolean;               // True when language is Arabic
  setLanguage: (lang: 'en' | 'ar') => void;
}
```

Usage example:
```tsx
const { t, language, setLanguage, isRTL } = useLanguage();
<p dir={isRTL ? 'rtl' : 'ltr'}>{t('add_reading')}</p>
```

---

## 🗄️ Database Schema

All tables are in PostgreSQL (Supabase) with Row-Level Security enabled.

### `profiles`
| Column | Type | Notes |
|---|---|---|
| `id` | `UUID` | Primary key, references `auth.users` |
| `email` | `TEXT` | Unique |
| `diabetes_type` | `TEXT` | `'T1'` or `'T2'` |
| `created_at` | `TIMESTAMPTZ` | Auto-set |
| `updated_at` | `TIMESTAMPTZ` | Auto-set |

### `readings`
| Column | Type | Notes |
|---|---|---|
| `id` | `UUID` | Primary key |
| `user_id` | `UUID` | FK → `profiles.id` |
| `value` | `NUMERIC` | Glucose value in mg/dL |
| `timestamp` | `TIMESTAMPTZ` | When reading was taken |
| `meal_context` | `TEXT` | `fasting`, `before_meal`, `after_meal`, `bedtime`, `night`, `other` |
| `note` | `TEXT` | Optional note |

### `caregiver_patients`
| Column | Type | Notes |
|---|---|---|
| `id` | `TEXT` | Primary key (custom patient ID string) |
| `caregiver_id` | `UUID` | FK → `profiles.id` |
| `name` | `TEXT` | Patient display name |
| `phone` | `TEXT` | Contact phone |
| `diabetes_type` | `TEXT` | `TYPE_1` or `TYPE_2` |
| `created_at` | `TIMESTAMPTZ` | Auto-set |

### `caregiver_readings`
| Column | Type | Notes |
|---|---|---|
| `id` | `UUID` | Primary key |
| `patient_id` | `TEXT` | FK → `caregiver_patients.id` |
| `value` | `NUMERIC` | Glucose value in mg/dL |
| `timestamp` | `TIMESTAMPTZ` | Auto-set |

---

## 🌍 Internationalization (i18n)

Supported languages: **English (`en`)** and **Arabic (`ar`)**.

Translation files:
- `src/locales/en.json`
- `src/locales/ar.json`

Switch language at runtime via the **globe icon** in the bottom navigation.  
Arabic mode enables full **RTL layout** (`dir="rtl"`) automatically.

---

## 🩸 Glucose Thresholds

| Status | Range (mg/dL) | Color |
|---|---|---|
| 🔴 Dangerously Low | < 54 | Red |
| 🟡 Low | 54 – 69 | Yellow |
| 🟢 Normal | 70 – 180 | Teal/Green |
| 🟠 High | 181 – 249 | Orange |
| 🔴 Dangerously High | ≥ 250 | Red |

---

## 🚢 Deployment

The app is deployed on **Vercel**.

**Live URL:** [https://daibeieieieieie.vercel.app](https://daibeieieieieie.vercel.app)

### Deploy to Vercel

```bash
# Build first
npm run build

# Deploy via Vercel CLI
vercel --prod
```

### Required Vercel Environment Variables

Set these in your Vercel project → **Settings → Environment Variables**:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

---

## 🔧 Troubleshooting

### Build fails

```bash
# Clear node_modules and reinstall
Remove-Item -Recurse -Force node_modules
npm install

# Clear Vite dist cache
Remove-Item -Recurse -Force dist
npm run build
```

### TypeScript errors

```bash
npm run tsc
# Review tsconfig.json for compiler options
```

### Auth issues

- Verify `.env.local` has correct Supabase URL and anon key.
- In Supabase Dashboard → **Auth → Settings**, disable **Email Confirmation**.
- Check `supabase/config.toml`: ensure `email_confirm = false`.
- Confirm user exists in **Supabase Auth → Users**.

### Supabase RLS issues

- Run all SQL from `supabase/schema.sql` in the SQL editor.
- Ensure RLS is enabled on all tables.
- Verify policies allow `SELECT`, `INSERT`, `UPDATE`, `DELETE` for the authenticated user.

### Styling issues

```bash
# Rebuild with no cache
npm run build -- --no-cache
```

---

## 📅 Changelog

### v1.2.0 — March 2026
- Added **password confirmation** field on sign-up form.
- Password validation: minimum 6 characters.
- Confirm password must match before account creation.

### v1.1.0 — March 2026
- Added **Sign In / Sign Up mode toggle** on the Auth page.
- Separate auth flows with clear UI switching.

### v1.0.0 — March 2026 (Initial Release)
- Email + Password authentication via Supabase Auth.
- Patient dashboard with glucose chart and readings history.
- Caregiver dashboard with patient management.
- Ask Doctor AI chat interface.
- Bilingual support: English & Arabic (RTL).
- Full Supabase data persistence with RLS.
- Deployed to Vercel.

---

## 🧩 Adding New Features — Checklist

When implementing new features:

- [ ] Define types in `src/types/`
- [ ] Add component to `src/components/` or page to `src/pages/`
- [ ] Wire state management via context or custom hook
- [ ] Add translation keys to `src/locales/en.json` **and** `src/locales/ar.json`
- [ ] Update database schema in `supabase/schema.sql` if needed
- [ ] Test locally: `npm run dev`
- [ ] Type-check: `npm run tsc`
- [ ] Build: `npm run build`
- [ ] Deploy: `vercel --prod`
- [ ] Verify on production URL

---

## 📞 Contact & Support

- **Developer:** Mohammed
- **Live App:** [https://daibeieieieieie.vercel.app](https://daibeieieieieie.vercel.app)
- **Repository:** [https://github.com/wnbda19/Htech-1.0-v](https://github.com/wnbda19/Htech-1.0-v)

---

## 📄 License

Private project. All rights reserved.

---

*Last Updated: March 2026*
