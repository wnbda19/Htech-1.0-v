# Changelog

All notable changes to Htech are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [1.3.0] - March 4, 2026

### Added
- **Persistent storage:** All patients/readings saved in Supabase tables.
  Data is fetched on page load and after every 30 sec so the UI state survives
  refreshes and navigation.
- New Supabase schema tables (`caregiver_patients` and `caregiver_readings`) and
  associated RLS policies. Existing `profiles`/`readings` continue to be used.

### Changed
- Caregiver page now synchronizes additions/reads with the database using the
  same status/average logic previously used in memory.
- Reading updates for real users are also stored in Supabase now.
- Documentation updated with chapters on persistence.

### Technical Details
- Data fetching moved inside `useEffect` in `src/pages/CaregiverPage.tsx`.
- Added async inserts to Supabase on patient creation and reading save.

## [1.2.0] - March 4, 2026

### Added
- **Password Confirmation Field:** Sign-up form now requires password confirmation
- **Password Validation:** Minimum 6 characters required for all passwords
- **Validation Logic:** 
  - Passwords must match during sign-up
  - Clear error messages for password mismatches
- **Confirm Field Toggle:** Confirmation field only appears in sign-up mode

### Changed
- Enhanced sign-up security with required password confirmation
- Improved user messaging for password validation errors
- Updated bundle size (480.18 KB gzipped)

### Files Modified
- `src/pages/AuthPage.tsx` - Added confirmPassword state and validation
- `dist/assets/index-DpxtuAbZ.js` - Production bundle

### Bundle Details
```
dist/assets/index-DpxtuAbZ.js   480.18 kB | gzip: 144.92 kB
dist/assets/index-C53c5g4l.css    4.27 kB | gzip:   1.56 kB
```

---

## [1.1.0] - March 4, 2026

### Added
- **Sign-Up/Sign-In Mode Toggle:** Users can switch between modes with buttons
- **Separate Auth Flows:**
  - Sign-up calls `supabase.auth.signUp()`
  - Sign-in calls `supabase.auth.signInWithPassword()`
- **Dynamic Button Labels:** "Create Account" for sign-up, "Sign In" for sign-in
- **Mode Indicator:** Visual feedback showing current auth mode

### Changed
- Refactored authentication flow to support two distinct modes
- Updated UI with toggle buttons for mode switching
- Improved UX with mode-specific messaging

### Technical Details
```tsx
// Added state
const [isSigningUp, setIsSigningUp] = useState(false);

// Conditional rendering
{isSigningUp ? 'Create Account' : 'Sign In'}
```

### Files Modified
- `src/pages/AuthPage.tsx` - Added isSigningUp state and conditional flows
- `dist/assets/index-CJx6adDU.js` - Production bundle

### Bundle Details
```
dist/assets/index-CJx6adDU.js   479.61 kB | gzip: 144.83 kB
dist/assets/index-C53c5g4l.css    4.27 kB | gzip:   1.56 kB
```

---

## [1.0.0] - March 4, 2026

### Initial Release

#### Added
- **Email & Password Authentication:**
  - Sign-up with email and password
  - Sign-in with credentials
  - Session management via Supabase
  - Automatic session persistence

- **Authentication Pages:**
  - `AuthPage.tsx` - Main login/signup interface
  - `HomePage.tsx` - Authenticated dashboard
  - `LogReadingPage.tsx` - Glucose tracking
  - `CaregiverPage.tsx` - Caregiver management
  - `AskDoctorPage.tsx` - Doctor consultations

- **Global State Management:**
  - `AuthContext.tsx` - User session and auth state
  - `ReadingsContext.tsx` - Glucose readings state
  - `LanguageContext.tsx` - Multi-language support

- **Custom Hooks:**
  - `useDiabetes.ts` - Diabetes data operations
  - `useLanguage.ts` - Language switching

- **UI Components:**
  - `Button.tsx` - Reusable button component
  - `Card.tsx` - Card/container component
  - `GlucoseChart.tsx` - Chart visualization
  - `DangerAlert.tsx` - Alert component
  - `BottomNav.tsx` - Navigation bar

- **Styling:**
  - Tailwind CSS with custom `htech-*` theme colors
  - Dark mode by default
  - Mobile responsive design
  - Custom color palette:
    - `htech-bg` - Dark background
    - `htech-surface` - Card background
    - `htech-text` - Primary text
    - `htech-primary` - Action color

- **Internationalization:**
  - English (`en.json`)
  - Arabic (`ar.json`)
  - Language switching UI

- **Database:**
  - Supabase PostgreSQL backend
  - User authentication
  - Glucose readings table
  - Caregiver management table

- **Configuration:**
  - Email confirmation disabled (`email_confirm = false`)
  - Removed mock session logic
  - Clean Supabase schema

### Removed
- ❌ Email confirmation requirement
- ❌ Mock session fallback logic
- ❌ Rate-limit Wi-Fi/cellular alerts
- ❌ Username-based authentication
- ❌ Malformed TOML/SQL syntax

### Technical Details

**Stack:**
- React 19.2.0
- TypeScript 5.6
- Vite 7.3.1
- Tailwind CSS
- Supabase for backend
- Vercel for hosting

**Browser Support:**
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

**File Structure:**
```
src/
├── pages/           # Page components (5 pages)
├── contexts/        # State management (3 contexts)
├── components/      # Reusable UI (5 components)
├── hooks/           # Custom hooks (2 hooks)
├── locales/         # Translations (2 languages)
├── types/           # TypeScript types
├── utils/           # Utilities
└── lib/             # Library configs
```

**Bundle Size:**
```
dist/assets/index-[hash].js   479.61 kB | gzip: 144.83 kB
dist/assets/index-[hash].css    4.27 kB | gzip:   1.56 kB
Total                          485.88 kB | gzip: 146.39 kB
```

### Known Issues
- None at release

### Testing Done
- ✅ Sign-up flow
- ✅ Sign-in flow
- ✅ Session persistence
- ✅ Multi-language switching
- ✅ Mobile responsiveness
- ✅ Production build

### Deployment
- **Platform:** Vercel
- **URL:** https://daibeieieieieie.vercel.app
- **Status:** ✅ Live and functional

---

## Types of Changes

- **Added:** New features or functionality
- **Changed:** Changes to existing functionality
- **Deprecated:** Features marked for removal
- **Removed:** Removed features or code
- **Fixed:** Bug fixes
- **Security:** Security-related changes

---

## Version Naming

Follows [Semantic Versioning](https://semver.org/):
- **MAJOR** (X.0.0) - Breaking changes
- **MINOR** (0.X.0) - New features (backward compatible)
- **PATCH** (0.0.X) - Bug fixes

Example: 1.2.0
- 1 = Major version
- 2 = Minor version (new features)
- 0 = Patch (no bug fixes this release)

---

## Future Planned Features

- [ ] Doctor consultation messaging system
- [ ] Advanced glucose analytics
- [ ] Export data to PDF
- [ ] Mobile app (React Native)
- [ ] Dark/light theme toggle
- [ ] Two-factor authentication
- [ ] User profile customization
- [ ] Integration with glucose meters
- [ ] Meal tracking
- [ ] Medication reminders

---

## Breaking Changes

### v1.0.0
- Complete authentication system overhaul from username to email/password
- Removed all mock session data
- No compatibility with previous data format

---

## Migration Guides

### Upgrading from v1.1 to v1.2

**Changes Required:**
- None - fully backward compatible
- Password confirmation is optional validation

**User Impact:**
- Sign-up now requires matching passwords
- Better password security

---

## Contributors

- **Mohammed** - Developer

---

## Release Schedule

**Next Release:** TBD
- Monitor for new features and updates

---

**Last Updated:** March 4, 2026

For more details, see:
- [README.md](README.md) - Project overview
- [DEVELOPMENT.md](DEVELOPMENT.md) - Development guide
- [DEPLOYMENT.md](DEPLOYMENT.md) - Deployment instructions
