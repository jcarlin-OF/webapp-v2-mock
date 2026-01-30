# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
npm run dev          # Start Next.js dev server (localhost:3000)
npm run build        # Production build
npm start            # Start production server
npm run lint         # ESLint validation
npm run type-check   # TypeScript validation (no emit)
```

## Architecture Overview

This is a **Next.js 14 App Router** application for an expert consultation marketplace.

### Tech Stack
- **Framework**: Next.js 14 with App Router (file-based routing)
- **Language**: TypeScript 5.9 (strict mode)
- **Styling**: Tailwind CSS + Radix UI primitives (shadcn/ui patterns)
- **Forms**: React Hook Form + Zod validation
- **Data Fetching**: TanStack React Query (60s stale time, no refetch on focus)
- **Auth**: NextAuth.js 5 beta (JWT strategy, credentials provider)
- **Payments**: Stripe integration ready

### Directory Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/             # Login, signup pages
│   ├── (booking)/          # Booking wizard (/book/[expertId])
│   ├── (client)/           # Client dashboard (protected)
│   ├── (discovery)/        # Expert discovery (/experts)
│   ├── (expert)/           # Expert dashboard (protected, expert role)
│   ├── (marketing)/        # Homepage, landing pages
│   ├── api/                # API routes
│   └── providers.tsx       # Client providers (NextAuth, React Query)
├── components/
│   ├── ui/                 # Reusable UI primitives (button, input, dialog, etc.)
│   ├── booking/            # Booking wizard components
│   ├── layout/             # Header, footer, container
│   └── dashboard/          # Dashboard-specific components
├── lib/
│   ├── auth/               # NextAuth config (auth.ts, types.ts)
│   ├── validations/        # Zod schemas (auth.ts, booking.ts)
│   ├── utils.ts            # Helper functions (cn, formatPrice, formatDate)
│   └── constants.ts        # App constants (pricing, categories, timezones)
├── types/                  # TypeScript interfaces (Expert, Booking, User, etc.)
├── mock/data/              # Mock data for development
└── middleware.ts           # Route protection & role-based access
```

### Authentication Flow

NextAuth.js with JWT sessions (30-day max age):
- **Credentials provider**: email/password against mock users
- **Roles**: `client`, `expert`, `admin`
- **Protected routes**: `/dashboard` (clients), `/expert/*` (experts)
- **Middleware**: Redirects unauthenticated users to `/login`, enforces role-based access

Session type extensions are in `src/lib/auth/types.ts`.

### Form Validation Pattern

```typescript
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema } from '@/lib/validations/auth'

const form = useForm<LoginFormData>({
  resolver: zodResolver(loginSchema),
})
```

Schemas in `src/lib/validations/` define all form validation rules.

### Import Alias

Use `@/*` for imports from `src/`:
```typescript
import { Button } from '@/components/ui/button'
import { Expert } from '@/types'
```

## Key Patterns

### Client vs Server Components
- Server components by default (no directive needed)
- Add `'use client'` only for components using hooks, state, or event handlers
- Providers and interactive components must be client components

### State Management
- **Server state**: TanStack React Query
- **Auth state**: NextAuth SessionProvider
- **Local UI state**: Component-level useState
- No global Redux store in this version

### Brand Colors (Tailwind)
- **Primary (teal)**: `primary-500` (#28BEAF), `primary-900` (#005755)
- **Secondary (blue)**: `secondary-500` (#2389C1)
- **Semantic**: `error`, `warning`, `success`

## Mock Data

All data is mocked in `src/mock/data/`. Test users:
- `client@test.com` / `password` (client role)
- `jane@test.com` / `password` (expert role)
- `sarah@test.com` / `password` (expert role)

## Environment Variables

Required in `.env.local`:
```
AUTH_SECRET=<jwt-signing-key>
```
