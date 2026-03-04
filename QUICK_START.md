# Quick Start Guide

Get Htech running in 5 minutes.

---

## ⚡ 5-Minute Setup

### 1. Install Dependencies (1 min)

```bash
cd c:\Users\Mohammed\Desktop\Vibe\daibeieieieieie
npm install
```

### 2. Configure Supabase (2 min)

Create `.env.local`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

Get values from: https://supabase.co → Your Project → Settings → API

### 3. Start Dev Server (1 min)

```bash
npm run dev
```

Opens at: **http://localhost:5173**

### 4. Test Sign-Up (1 min)

1. Click "Sign Up"
2. Enter email: `test@example.com`
3. Password: `test123456` (minimum 6 characters)
4. Confirm: `test123456` (must match)
5. Click "Create Account"
6. See success message

### 5. Test Sign-In (bonus)

1. Click "Sign In"
2. Enter same credentials
3. Should log in successfully

---

## 🚀 Common Commands

```bash
# Start dev server
npm run dev

# Check TypeScript
npm run tsc

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

---

## 📁 Key Files to Understand

```
src/
├── pages/AuthPage.tsx          ← Login/signup form
├── contexts/AuthContext.tsx    ← Auth state
├── lib/supabase.ts            ← Backend config
└── locales/en.json            ← English text
```

---

## 🔑 Environment Variables

Format: `VITE_*` prefix for client-side (visible in browser)

```env
VITE_SUPABASE_URL=https://xxx.supabase.co     # Your Supabase URL
VITE_SUPABASE_ANON_KEY=eyJxx...               # Public API key
```

❌ **Don't commit** `.env.local` (add to `.gitignore`)

---

## 🧪 Test Accounts

**Create your own during development:**
- Email: any email address
- Password: minimum 6 characters
- Confirm: must match password

**Supabase Auth Dashboard:**
- https://app.supabase.co → Your Project → Authentication → Users

---

## 🐛 Common Issues

### "Cannot find module"
```bash
rm -r node_modules
npm install
```

### TypeScript errors
```bash
npm run tsc
# See detailed errors
```

### Supabase won't connect
- Check `.env.local` has correct keys
- Verify Supabase project is active
- Check browser console for errors (F12)

### Port 5173 already in use
```bash
npm run dev -- --port 3000
# Runs on port 3000 instead
```

---

## 📚 Documentation

- **[README.md](README.md)** - Full project overview
- **[DEVELOPMENT.md](DEVELOPMENT.md)** - Dev environment guide
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Deployment instructions
- **[API_REFERENCE.md](API_REFERENCE.md)** - Hooks, contexts, components
- **[CHANGELOG.md](CHANGELOG.md)** - Version history

---

## 📝 Project Structure

```
htech/
├── src/               ← Your code
│   ├── pages/        ← Page components
│   ├── components/   ← Reusable UI
│   ├── contexts/     ← Global state
│   ├── hooks/        ← Custom hooks
│   └── locales/      ← Translations
├── dist/             ← Production build (after npm run build)
├── README.md         ← Project overview
├── DEVELOPMENT.md    ← Dev guide
└── package.json      ← Dependencies
```

---

## 🔐 Making Changes

### 1. Edit a file
```bash
# E.g., change button text in src/pages/AuthPage.tsx
```

### 2. Browser auto-reloads (HMR)
```bash
# Just save - no need to refresh!
```

### 3. Check for errors
```bash
# TypeScript
npm run tsc

# Linting
npm run lint
```

### 4. Ready to deploy?
```bash
npm run build          # Create production bundle
npm run preview        # Test it locally
vercel --prod         # Deploy to production
```

---

## 🎯 Next Steps

### Learning
1. Read [DEVELOPMENT.md](DEVELOPMENT.md) for detailed setup
2. Review [API_REFERENCE.md](API_REFERENCE.md) for available APIs
3. Check source code in `src/` folder

### Customization
1. Update colors in component files
2. Edit text in `src/locales/` for multi-language
3. Modify pages in `src/pages/` folder
4. Create new components in `src/components/`

### Deployment
```bash
npm run build        # Create production build
vercel --prod       # Deploy to Vercel (must be installed)
```

---

## 💡 Pro Tips

**Hot Reload (Development):**
- Changes save instantly to browser
- No manual refresh needed
- Very fast workflow

**TypeScript Checking:**
- Run `npm run tsc` often
- Catches errors before runtime
- Better refactoring support

**Component Testing:**
- Create test user: `test@example.com`
- Password: `test123456`
- Sign out and sign in to test auth flow

**Production Testing:**
- Run `npm run preview` before deploying
- Tests exact production code
- Catches build-only issues

---

## 📞 Need Help?

**Check these files:**
1. [DEVELOPMENT.md](DEVELOPMENT.md) - Setup issues
2. [DEPLOYMENT.md](DEPLOYMENT.md) - Deployment issues
3. [API_REFERENCE.md](API_REFERENCE.md) - API questions

**Browser Console (F12):**
- Shows errors and warnings
- Network tab shows API calls
- Application tab shows stored data

**Supabase Dashboard:**
- Check user was created: Auth section
- View database: SQL Editor
- Monitor logs: Logs section

---

## ✅ Checklist

- [ ] Node.js 18+ installed
- [ ] npm install completed
- [ ] .env.local created with Supabase keys
- [ ] npm run dev starts successfully
- [ ] Can sign up and sign in
- [ ] Styles load correctly
- [ ] Ready to start developing!

---

**Need more details?** Check the full [README.md](README.md)

**Happy coding!** 🚀
