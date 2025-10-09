# Setup Guide

## Prerequisites
- Node.js 20.x or higher
- npm or yarn
- Backend API running on `http://localhost:3000`

## Quick Start

### 1. Install Dependencies
```bash
cd /Users/sarangtandel/Documents/Code/Care\ Connects/Code/FrontEndFinal/careconnects-fe
npm install
```

### 2. Configure Environment
The `.env.local` file is already created. Verify it has:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
NEXT_PUBLIC_APP_NAME=Care Connects
```

### 3. Run Development Server
```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## Project Structure Overview

```
✅ Package configuration updated
✅ TypeScript with path aliases configured
✅ Tailwind CSS v4 configured
✅ Axios instance with interceptors created
✅ React Query configured
✅ Reusable form handler hook created
✅ UI component library created (Button, Input, Field, Card, LoadingSpinner)
✅ Authentication module structure created
✅ Login page created
✅ Dashboard page created
✅ Protected route layout created
✅ Root layout with providers configured
```

## What's Included

### Core Setup
- ✅ Next.js 15 with App Router
- ✅ TypeScript with strict mode
- ✅ Tailwind CSS v4
- ✅ ESLint & Prettier

### State Management
- ✅ React Query for server state
- ✅ React Hook Form + Zod for forms
- ✅ React Hot Toast for notifications

### Architecture
- ✅ Module-based structure
- ✅ Path aliases configured
- ✅ Axios interceptors for auth
- ✅ Protected route system

### UI Components
- ✅ Button (with variants & loading states)
- ✅ Input (with error handling)
- ✅ Field (form field wrapper)
- ✅ Card (container component)
- ✅ LoadingSpinner (with sizes)

### Authentication
- ✅ Login schema & validation
- ✅ Auth service functions
- ✅ React Query hooks (useLogin, useLogout, useCurrentUser)
- ✅ Login page
- ✅ Protected route guard

## Available Scripts

```bash
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
```

## Next Steps

### Ready to Migrate
You can now start migrating features from the old frontend one by one:

1. **Patients Module**
   ```bash
   mkdir -p src/modules/patient/{schemas,services,hooks,components}
   ```

2. **Appointments Module**
   ```bash
   mkdir -p src/modules/appointment/{schemas,services,hooks,components}
   ```

3. **Consultations Module**
   ```bash
   mkdir -p src/modules/consultation/{schemas,services,hooks,components}
   ```

4. **Clinic Module**
   ```bash
   mkdir -p src/modules/clinic/{schemas,services,hooks,components}
   ```

### Migration Pattern

For each module, follow this pattern:

1. **Create Schema** (e.g., `patient.schema.ts`)
2. **Create Service** (e.g., `patient.service.ts`)
3. **Create Hooks** (e.g., `usePatients.ts`)
4. **Create Components** (e.g., `PatientList.tsx`, `PatientForm.tsx`)
5. **Create Page** in `app/(protected)/patients/page.tsx`

## Testing the Setup

### Test Login Flow
1. Start backend: `cd CareConnectsBE/care-connects && npm run start:dev`
2. Start frontend: `npm run dev`
3. Navigate to `http://localhost:3000`
4. You should be redirected to `/login`
5. Enter credentials and test login

### Test Protected Routes
1. After login, you should be redirected to `/dashboard`
2. Refresh the page - you should stay logged in
3. Clear local storage and refresh - you should be redirected to login

## Troubleshooting

### Port Already in Use
If port 3000 is already in use by the backend:
```bash
npm run dev -- -p 3001  # Run on port 3001
```

### API Connection Issues
- Verify backend is running on port 3000
- Check `.env.local` has correct API URL
- Check browser console for CORS errors

### Module Not Found Errors
- Run `npm install` again
- Delete `node_modules` and `.next`, then reinstall
- Verify path aliases in `tsconfig.json`

## Documentation

- **STRUCTURE.md** - Detailed project structure explanation
- **cursor_dev_guidelines.md** - Comprehensive development guidelines
- **CLAUDE.md** - Project overview for AI assistance

## Support

For issues or questions, refer to the development guidelines or check the backend API documentation at `http://localhost:3000/api-docs` (when backend is running).
