# Badminton Calendar

[中文文档](README.zh-CN.md)

A badminton tournament calendar built with Next.js 15, featuring multi-language support, timezone conversion, calendar export, dark mode, and PWA capabilities.

![Badminton Calendar](public/logo.png)

## Features

- **Tournament Schedule** — Browse BWF official tournament schedules with real-time updates
- **Calendar Export** — Generate custom ICS calendar files, subscribe via WebCal, or add to Google Calendar
- **Multi-language** — Supports Simplified Chinese, Traditional Chinese (HK), and English
- **Flexible Filtering** — Filter by event type (Open / Championships / Finals / Olympics / Asian Games), category (1000 / 750 / 500 / 300 / 100), and stage (Group / Semifinal / Final)
- **Timezone Support** — Auto-detect user timezone with manual override; 12h / 24h format toggle
- **Pre-match Reminders** — Set reminders 30 / 60 / 90 / 120 minutes before a match
- **Dark Mode** — Light and dark theme toggle
- **PWA** — Installable on desktop and mobile with offline support
- **Responsive** — Optimized for all screen sizes

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js 15](https://nextjs.org/) (App Router) with React 19 |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS 4.x + PostCSS |
| i18n | [next-intl](https://next-intl-docs.vercel.app/) |
| Date/Time | [dayjs](https://day.js.org/) with UTC & timezone plugins |
| State | React Context API |
| Calendar | [ics](https://github.com/adamgibbons/ics) (iCalendar format) |
| PWA | [@ducanh2912/next-pwa](https://github.com/AceMiracle/next-pwa) |
| Analytics | [Plausible](https://plausible.io/) via next-plausible |
| Testing | [Vitest](https://vitest.dev/) + [Testing Library](https://testing-library.com/) |
| Linting | ESLint + Prettier |

## Getting Started

### Prerequisites

- Node.js 22.x
- npm

### Installation

```bash
git clone https://github.com/Chena2003/badminton-calendar.git
cd badminton-calendar
npm install
npm run setPublicAssets
```

### Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SITE_KEY=badminton
NEXT_PUBLIC_CURRENT_YEAR=2025
```

### Development

```bash
npm run dev        # Start dev server
npm run build      # Production build
npm start          # Start production server
npm test           # Run tests
npm run test:watch # Run tests in watch mode
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Project Structure

```
badminton-calendar/
├── _db/                        # Data files
│   ├── badminton/
│   │   ├── config.json         # Site config (event types, categories, sessions)
│   │   ├── 2025.json           # 2025 tournament data
│   │   └── 2026.json           # 2026 tournament data
│   └── sites.json              # Multi-site config
├── locales/                    # i18n translation files
│   ├── zh/                     # Simplified Chinese
│   ├── zh-HK/                  # Traditional Chinese (HK)
│   └── en/                     # English
├── src/
│   ├── app/
│   │   ├── [locale]/           # Locale-based routing
│   │   │   ├── page.tsx        # Home (schedule list)
│   │   │   ├── generate/       # Calendar generation page
│   │   │   ├── subscribe/      # Subscription page
│   │   │   ├── notifications/  # Notification settings
│   │   │   ├── timezone/       # Timezone picker
│   │   │   ├── year/           # Year selector
│   │   │   ├── globals.css     # Global styles & theme variables
│   │   │   └── layout.tsx      # Locale layout
│   │   ├── api/
│   │   │   └── badminton-calendar/route.ts  # Calendar generation API
│   │   ├── layout.tsx          # Root layout
│   │   ├── sitemap.ts          # SEO sitemap
│   │   └── robots.ts           # SEO robots.txt
│   ├── components/             # React components
│   │   ├── Badges/             # Event status badges
│   │   ├── Race/               # Tournament row components
│   │   ├── OptionsBar/         # Settings bar (timezone, format, theme)
│   │   ├── Layout/             # Page layout
│   │   ├── Footer/             # Footer
│   │   ├── Header/             # Header
│   │   ├── ThemeToggle/        # Dark/light mode toggle
│   │   └── UserContext.tsx      # User preferences context
│   ├── models/                 # Data models
│   │   ├── RaceModel.ts
│   │   └── Sessions.ts
│   ├── __tests__/              # Test setup & helpers
│   │   ├── setup.ts
│   │   ├── helpers/
│   │   └── scroll-behavior.test.tsx
│   ├── middleware.ts           # i18n routing middleware
│   └── i18n.ts                 # i18n config
├── vitest.config.ts            # Vitest configuration
├── next.config.js              # Next.js configuration
├── tsconfig.json               # TypeScript configuration
└── package.json
```

## Calendar API

Generate a custom calendar file:

```
GET /api/badminton-calendar?o=1&lc=1000&c=1&f=1&a=60&lang=en
```

### Query Parameters

| Param | Description | Values |
|-------|-------------|--------|
| `o` | Include open events | `1` / `0` |
| `lc` | Minimum category | `1000` / `750` / `500` / `300` / `100` / `all` |
| `c` | Include championships | `1` / `0` |
| `f` | Include finals | `1` / `0` |
| `y` | Include Olympics | `1` / `0` |
| `g` | Include Asian Games | `1` / `0` |
| `m` | Major events only | `1` / `0` |
| `sg` | Include group stage | `1` / `0` |
| `ss` | Include semifinals | `1` / `0` |
| `sf` | Include finals stage | `1` / `0` |
| `a` | Reminder (minutes before) | `0` / `30` / `60` / `90` / `120` |
| `lang` | Language | `en` / `zh` / `zh-HK` |

## Adding Tournament Data

1. Edit `_db/badminton/YYYY.json` to add a tournament entry:

```json
{
  "name": "Malaysia Open",
  "englishName": "Malaysia Open",
  "location": "Kuala Lumpur",
  "type": "open",
  "category": "1000",
  "startDate": "2025-01-07",
  "endDate": "2025-01-12",
  "sessions": {
    "day1": "2025-01-07T09:00:00+08:00",
    "semifinal": "2025-01-11T13:00:00+08:00",
    "final": "2025-01-12T13:00:00+08:00"
  },
  "sessionTypes": {
    "day1": "group",
    "semifinal": "semifinal",
    "final": "final"
  },
  "slug": "malaysia-open",
  "localeKey": "malaysia-open"
}
```

2. Add translations in `locales/en/localization.json` (and other locale files).

## Theme Customization

Themes are defined via CSS variables in `src/app/[locale]/globals.css`:

```css
:root {
  --bg-color: #f5f5f5;
  --text-color: #1a1a1a;
  --card-bg: #ffffff;
  /* ... */
}

.dark {
  --bg-color: #000000;
  --text-color: #ffffff;
  --card-bg: #151515;
  /* ... */
}
```

## Testing

The project uses Vitest with Testing Library for component testing:

```bash
npm test           # Run all tests once
npm run test:watch # Run in watch mode
```

Test files are co-located with components in `__tests__/` directories. Coverage includes:

- **UserContext** — State management, localStorage persistence, timezone normalization
- **Badges** — NextBadge, TBCBadge, CanceledBadge rendering
- **Race / RaceTR** — Tournament display, expand/collapse, past race styling
- **OptionsBar** — Settings panel toggle, timezone/format pickers
- **Footer / Layout** — Content rendering, component composition
- **Scroll behavior** — CSS regression tests for scroll fix

## Contributing

Contributions are welcome! Please open a Pull Request.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License — see [LICENSE](LICENSE) for details.

## Acknowledgments

- Tournament data sourced from [BWF](https://bwfbadminton.com/) (Badminton World Federation)
- Built by [Chena](https://github.com/Chena2003)
