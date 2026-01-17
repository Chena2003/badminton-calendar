# AGENTS.md

This file contains guidelines for agentic coding agents working in this repository.

## Build and Development Commands

```bash
# Development
npm run dev              # Start development server (http://localhost:3000)

# Production
npm run build           # Build for production
npm start               # Start production server

# Deployment
# Deploy to EdgeOne Pages (fullstack Next.js project)
# The deployment tool will automatically detect the project type and deploy
# Project name is configured in .env.local as EDGEONE_PAGES_PROJECT_NAME

# Build assets
npm run setPublicAssets # Copy public assets to public directory
node build/generate-icons.js # Generate icons from logo.png

# Linting (ESLint installed but no script defined - use npx)
npx eslint src/         # Run linter on src directory
npx eslint --fix src/   # Auto-fix linting issues

# Note: No test framework is currently configured
```

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

### File Organization

```
src/
├── app/                  # Next.js App Router pages
│   ├── api/             # API routes
│   ├── [locale]/        # Internationalized pages
│   ├── layout.tsx
│   └── page.tsx
├── components/          # Reusable components (one per directory)
│   ├── Card/
│   │   └── Card.tsx
│   └── Race/
│       └── Race.tsx
├── models/             # TypeScript models/types
├── i18n.ts            # i18n configuration
└── middleware.ts      # Next.js middleware
```

### Linting and Formatting

- **Prettier**: Single quotes, 2 spaces, 80 char width, semicolons
- **ESLint**: Next.js + Prettier config
- **No explicit test command**: Add tests if needed

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

- Use `process.env.NEXT_PUBLIC_*` for public variables
- `.env.local` for local development
- Required: `NEXT_PUBLIC_SITE_KEY`, `NEXT_PUBLIC_CURRENT_YEAR`

### Data Loading

- Server components: Use `async/await` directly
- Client components: Use hooks and API calls
- Static params: `generateStaticParams()` for static routes

### Important Notes

- This is a **badminton calendar** application (multi-site codebase)
- Main site key: `badminton`
- Uses next-intl for 35+ languages
- PWA support with Firebase messaging
- No test framework configured - add if testing is needed

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

## Deployment to EdgeOne Pages

### Prerequisites

- EdgeOne Pages account configured
- Project name set in `.env.local`: `EDGEONE_PAGES_PROJECT_NAME=badminton-calendar`
- Build completed successfully: `npm run build`

### Deployment Process

This is a **fullstack Next.js project** with:
- API routes (`/api/badminton-calendar`)
- Middleware for i18n routing
- Server-side rendering (SSR)
- Static site generation (SSG)

**Deployment command:**
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

### Deployment Output

After successful deployment, you will receive:

- **Preview URL**: Temporary URL with authentication tokens for testing
- **Project ID**: Unique identifier for the EdgeOne Pages project
- **Console URL**: Link to manage the project in EdgeOne console
- **Project Name**: Configured project name

**Example output:**
```json
{
  "url": "https://badminton-calendar.edgeone.cool?eo_token=xxx&eo_time=xxx",
  "projectId": "pages-xxxxx",
  "consoleUrl": "https://console.tencentcloud.com/edgeone/pages/project/...",
  "projectName": "badminton-calendar"
}
```

### Post-Deployment Steps

1. **Custom Domain Setup**
   - The preview URL includes temporary authentication tokens
   - For production use, bind a custom domain in the EdgeOne console
   - Navigate to the console URL provided in deployment output

2. **Environment Variables**
   - Configure production environment variables in EdgeOne console
   - Required variables:
     - `NEXT_PUBLIC_SITE_KEY=badminton`
     - `NEXT_PUBLIC_CURRENT_YEAR=2025`
   - Optional: Firebase, Postmark, Novu credentials for notifications

3. **Monitoring**
   - Check deployment logs in EdgeOne console
   - Monitor API route performance
   - Review middleware execution logs
