# AGENTS.md

This file contains guidelines for agentic coding agents working in this repository.

## Project Overview

This is a **badminton tournament calendar** web application built with Next.js 15 (App Router) and React 19. It generates customizable ICS calendar files for BWF (Badminton World Federation) tournaments, supporting multi-language, timezone detection, and PWA features.

- **Site key**: `badminton`
- **Current year**: 2026
- **Available years**: 2025, 2026
- **Repository**: https://github.com/Chena2003/badminton-calendar

## Build and Development Commands

```bash
# Development
npm run dev              # Start development server (http://localhost:3000)

# Production
npm run build           # Build for production
npm start               # Start production server

# Testing (Vitest)
npm test                # Run tests once
npm run test:watch      # Run tests in watch mode

# Build assets
npm run setPublicAssets # Copy public assets to public directory
node build/generate-icons.js # Generate icons from logo.png

# Linting (ESLint installed but no script defined - use npx)
npx eslint src/         # Run linter on src directory
npx eslint --fix src/   # Auto-fix linting issues

# Calendar generation (CI/CD)
node build/generate-calendars.js badminton  # Generate ICS calendar files
node build/generate-queues.mjs badminton    # Generate notification queues

# Deployment
# Deploy to EdgeOne Pages (fullstack Next.js project)
# Project name configured in .env.local as EDGEONE_PAGES_PROJECT_NAME
```

## Tech Stack

- **Framework**: Next.js 15.0.4 (App Router) + React 19.2.3
- **Language**: TypeScript 5.0.4 (strict mode)
- **Styling**: Tailwind CSS 4.1.18 + PostCSS
- **Internationalization**: next-intl 3.9.1 (3 languages: zh, zh-HK, en)
- **Date handling**: dayjs with utc/timezone plugins
- **Calendar generation**: ics 3.4.0
- **Testing**: Vitest 4.0.18 + jsdom
- **PWA**: @ducanh2912/next-pwa 10.2.5
- **Backend services**: Firebase (Firestore, Cloud Messaging), Postmark (email), Novu (notifications)
- **Analytics**: Plausible (next-plausible)
- **Deployment**: EdgeOne Pages (app), Cloudflare Workers (ICS files)

## Code Style Guidelines

### TypeScript Configuration

- **Strict mode**: Enabled (`strict: true`)
- **Relaxed checks**: `strictNullChecks: false`, `strictPropertyInitialization: false`
- **Path aliases**: `@components/*`, `@models/*`, `@_db/*` map to `src/`
- **Target**: ES5 with modern syntax support

### Import Organization

```typescript
// 1. External libraries (React, Next.js, third-party)
import React from 'react';
import { NextRequest } from 'next/server';
import dayjs from 'dayjs';

// 2. Internal imports (use path aliases when available)
import Layout from 'components/Layout/Layout';
import RaceModel from 'models/RaceModel';
import { useTranslations } from 'next-intl';
```

### Types and Interfaces

- Use **`type`** for aliases and unions
- Use **`interface`** for object shapes with props
- Component props should be typed explicitly
- NO `as any` or `@ts-ignore` allowed

```typescript
// Component props with interface
interface Props {
  children: React.ReactNode;
  showCTABar: boolean;
  year: number;
}

// Type aliases for simple types
type RaceRow = {
  isNextRace: boolean;
  item: RaceModel;
  collapsed: boolean;
};
```

### Component Conventions

```typescript
// Client components - MUST include 'use client' at top
'use client';

import React, { useState } from 'react';

interface Props {
  mobileOnly?: boolean;
}

const MyComponent: FunctionComponent<Props> = ({ mobileOnly }: Props) => {
  // State with useState
  const [state, setState] = useState(initialValue);

  // Hooks must be at top level
  const t = useTranslations('All');

  return <div>{/* JSX */}</div>;
};

export default MyComponent;
```

### Naming Conventions

- **Components**: PascalCase (`MyComponent.tsx`)
- **Files**: PascalCase for components (`MyComponent.tsx`), kebab-case for directories
- **Variables/Functions**: camelCase (`handleClick`, `raceData`)
- **Constants**: camelCase (no UPPER_CASE convention observed)
- **Component directories**: PascalCase (`components/Card/`)

### Error Handling

```typescript
// API Routes - wrap in try/catch, return JSON error
export async function GET(request: NextRequest) {
  try {
    // ... logic
    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error('Error description:', error);
    return NextResponse.json(
      { error: 'User-friendly error message' },
      { status: 500 },
    );
  }
}
```

### Styling (Tailwind CSS)

- Use utility classes directly
- Common patterns: `bg-row-gray`, `rounded-md`, `p-6`, `mb-10`
- Responsive: `md:text-left`, `lg:pr-8`
- States: `hover:`, `disabled:`, `focus:`
- Custom colors from theme: `bg-row-gray`, `text-yellow-600`

### Internationalization

3 supported languages: Simplified Chinese (`zh`, default), Traditional Chinese Hong Kong (`zh-HK`), English (`en`).

```typescript
// Get translations in components
const t = useTranslations('All');

// Use translations
<h3>{t('form.title')}</h3>
<p>{t(`races.${race.localeKey}`)}</p>

// Server-side translations
import { getTranslations } from 'next-intl/server';
const t = await getTranslations('All');
```

### Date Handling

```typescript
import dayjs from 'dayjs';
import dayjstimezone from 'dayjs/plugin/timezone';
import dayjsutc from 'dayjs/plugin/utc';

dayjs.extend(dayjsutc);
dayjs.extend(dayjstimezone);

// Format dates with timezone
const date = dayjs(dateString).tz(timezone).format('D MMM');
```

## Project Structure

```
badminton-calendar/
├── _db/                          # Tournament data
│   ├── badminton/
│   │   ├── config.json          # Site config (event types, session types)
│   │   ├── 2025.json            # 2025 tournament data
│   │   └── 2026.json            # 2026 tournament data
│   └── sites.json               # Site registry
├── _public/                      # Site-specific public assets template
├── locales/                      # i18n translation files
│   ├── en/localization.json
│   ├── zh/localization.json
│   └── zh-HK/localization.json
├── public/                       # Static assets (copied from _public/)
├── build/                        # Build & CI scripts
│   ├── generate-calendars.js    # ICS calendar file generator
│   ├── generate-queues.mjs      # Notification queue generator
│   ├── generate-icons.js        # Icon generator from logo.png
│   └── public-assets.js         # Copy _public/ assets to public/
├── config/
│   └── firebase.ts              # Firebase client configuration
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── [locale]/            # Internationalized pages
│   │   │   ├── page.tsx         # Main schedule page
│   │   │   ├── layout.tsx       # Locale layout
│   │   │   ├── generate/        # Calendar generation page
│   │   │   ├── subscribe/       # Email subscription page
│   │   │   ├── notifications/   # Push notification settings
│   │   │   ├── timezone/        # Timezone selection
│   │   │   ├── year/            # Year selection
│   │   │   └── email/           # Email confirmation/unsubscribe
│   │   ├── api/
│   │   │   └── badminton-calendar/route.ts  # Dynamic calendar API
│   │   ├── layout.tsx           # Root layout
│   │   ├── page.tsx             # Root redirect
│   │   ├── robots.ts            # SEO robots.txt
│   │   └── sitemap.ts           # SEO sitemap
│   ├── components/              # React components (one per directory)
│   │   ├── Badges/              # CanceledBadge, NextBadge, TBCBadge, TicketsBadge
│   │   ├── Banner/
│   │   ├── Card/
│   │   ├── CTABar/
│   │   ├── Footer/
│   │   ├── Header/
│   │   ├── Icons/               # SVG icon components
│   │   ├── LanguageSelector/
│   │   ├── Layout/              # Layout, FullWidthLayout
│   │   ├── Logo/
│   │   ├── Notice/
│   │   ├── OptionsBar/
│   │   ├── Race/                # Race, RaceTR
│   │   ├── Races/
│   │   ├── RaceSchema/
│   │   ├── RaceSchemas/
│   │   ├── SiteSelector/
│   │   ├── SupportButton/
│   │   ├── ThemeToggle/
│   │   ├── Toggle/
│   │   ├── TopBar/
│   │   ├── UserContext.tsx      # Global user state (theme, timezone)
│   │   ├── YearSelector/
│   │   └── __tests__/           # Component tests
│   ├── models/
│   │   ├── RaceModel.ts         # Race data model
│   │   └── Sessions.ts          # Session data model
│   ├── __tests__/               # Test setup
│   │   └── setup.ts             # Vitest setup file
│   ├── middleware.ts             # i18n routing middleware
│   ├── i18n.ts                  # i18n configuration
│   └── i18nConfig.js            # i18n locale definitions
├── .github/
│   ├── workflows/
│   │   ├── detect-db-changes.yml  # Auto-trigger on DB changes
│   │   ├── ics.yml                # Deploy ICS to Cloudflare Workers
│   │   └── queues.yml             # Generate notification queues
│   └── dependabot.yml
├── vitest.config.ts              # Vitest test configuration
├── next.config.js                # Next.js configuration
├── tsconfig.json                 # TypeScript configuration
├── .eslintrc                     # ESLint configuration
├── .prettierrc.js                # Prettier configuration
├── package.json
└── .env.local                    # Environment variables
```

### Linting and Formatting

- **Prettier**: Single quotes, 2 spaces, 80 char width, semicolons
- **ESLint**: Next.js + Prettier config
- **Commit convention**: Conventional Commits (feat, fix, chore, docs, etc.)

### Specific Patterns

- **Dynamic requires** for config/data: `require('/_db/badminton/config.json')`
- **API routes**: Export runtime and dynamic flags
  ```typescript
  export const runtime = 'nodejs';
  export const dynamic = 'force-dynamic';
  ```
- **Server components**: Default (no 'use client')
- **Client components**: Explicit 'use client' directive
- **Type assertions**: Use specific types, never `as any`

### Environment Variables

Required:
- `NEXT_PUBLIC_SITE_KEY` - Site identifier (always `badminton`)
- `NEXT_PUBLIC_CURRENT_YEAR` - Current calendar year (2026)

Optional:
- `EDGEONE_PAGES_PROJECT_NAME` - EdgeOne deployment project name
- `NEXT_PUBLIC_GOOGLE_VERIFICATION` - Google site verification
- `NEXT_PUBLIC_PLAUSIBLE_KEY` - Plausible analytics key
- `NEXT_PUBLIC_FIREBASE_*` - Firebase configuration (API key, auth domain, project ID, etc.)
- `NEXT_PUBLIC_NOVU_API` - Novu notification API key

### Data Loading

- Server components: Use `async/await` directly
- Client components: Use hooks and API calls
- Static params: `generateStaticParams()` for static routes

### Data Structure

Tournament data is stored in `_db/badminton/{year}.json`. Each tournament has:
- `name`, `englishName`, `location`, `englishLocation` - Basic info with coordinates
- `latitude`, `longitude` - Geographic coordinates for the tournament location
- `type` - Event type: `open`, `championship`, `finals`, `olympics`, `asiangames`
- `category` - For open events: `1000`, `750`, `500`, `300`, `100`, `series`
- `isMajor` - Boolean flag indicating if this is a major tournament (see rules below)
- `startDate`, `endDate` - Tournament date range (ISO 8601 format)
- `sessions` - Session timestamps mapped to dates (e.g., `day1`, `day2`, etc.)
- `sessionTypes` - Maps session keys to types (`group`, `semifinal`, `final`)
- `slug`, `localeKey` - URL slug and i18n translation key

#### isMajor Field Rules

The `isMajor` field determines which tournaments are highlighted as major events in the UI. A tournament should have `isMajor: true` ONLY if it meets one of these criteria:

1. **Super 1000 tournaments** - `type: "open"` AND `category: "1000"`
   - Examples: Malaysia Open, All England Open, China Open, Indonesia Open, Japan Open

2. **Championships** - `type: "championship"`
   - Examples: World Championships, Asian Championships, European Championships, Thomas & Uber Cup

3. **Olympics** - `type: "olympics"`

4. **Finals** - `type: "finals"`
   - Example: World Tour Finals

All other tournaments (categories 750, 500, 300, 100) should have `isMajor: false`, regardless of their prestige or prize money.

**Important**: When adding or modifying tournament data, ensure the `isMajor` field follows these rules exactly. The config file at `_db/badminton/config.json` defines `majorCategories: ["1000"]` for open events and `majorEvent: true` for championship/finals/olympics types.

### Logo and Icon Management

**Asset locations:**

- Source logo: `logo.png` (root directory)
- Site assets: `_public/badminton/` (favicon.ico, logo.png, icons)
- Public output: `public/` (copied by setPublicAssets)
- App favicon: `src/app/favicon.ico` (copied by setPublicAssets)

**Generating icons from logo:**

```bash
# 1. Place new logo.png in root directory
# 2. Generate all icon sizes (192x192, 512x512, 180x180)
node build/generate-icons.js

# 3. Generate favicon.ico
node -e "const { default: pngToIco } = require('png-to-ico'); const fs = require('fs'); pngToIco('logo.png').then(buf => { fs.writeFileSync('_public/badminton/favicon.ico', buf); console.log('favicon.ico generated'); });"

# 4. Copy assets to public and src/app directories
npm run setPublicAssets
```

**Icon sizes generated:**

- `android-chrome-192x192.png` (192x192)
- `android-chrome-512x512.png` (512x512)
- `apple-touch-icon.png` (180x180)
- `maskable_icon_x512.png` (512x512)
- `favicon.ico` (multi-size ICO file)

## CI/CD Workflows

### detect-db-changes.yml
Triggers on push to `main` when `_db/**/2025.json` or `_db/**/2026.json` changes. Detects the changed site (badminton) and triggers `ics.yml` and `queues.yml` workflows.

### ics.yml
Generates ICS calendar files and deploys to Cloudflare Workers. Requires secrets: `CF_API_TOKEN`, `CF_ZONE_ID`, `CF_ACCOUNT_ID`.

### queues.yml
Generates email/push notification queues and stores in Firebase Firestore. Requires secret: `FIREBASE_CREDENTIALS`.

## Deployment

### EdgeOne Pages (Application)

```bash
# Build the project first
npm run build

# Deploy using EdgeOne Pages MCP tool
# The tool will automatically:
# 1. Detect project type (fullstack)
# 2. Deploy .next directory
# 3. Configure server functions
# 4. Return deployment URL
```

### Cloudflare Workers (ICS Files)

ICS calendar files are deployed via the `ics.yml` GitHub workflow to Cloudflare Workers for efficient static file serving.

### Post-Deployment

1. **Custom Domain** - Bind domain in EdgeOne console
2. **Environment Variables** - Configure in EdgeOne console:
   - `NEXT_PUBLIC_SITE_KEY=badminton`
   - `NEXT_PUBLIC_CURRENT_YEAR=2026`
   - Optional: Firebase, Postmark, Novu credentials
3. **Monitoring** - Check deployment logs in EdgeOne console
