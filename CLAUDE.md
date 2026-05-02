# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm install` — install dependencies; Node.js 22.x is expected.
- `npm run setPublicAssets` — copy site-specific files from `_public/$NEXT_PUBLIC_SITE_KEY` into `public/` and `src/app/`; `next.config.js` also runs this during Next startup/build.
- `npm run dev` — start the Next.js development server.
- `npm run build` — build the production Next.js app.
- `npm start` — run the production server after building.
- `npm test` — run the Vitest test suite once.
- `npm run test:watch` — run Vitest in watch mode.
- `npm test -- path/to/file.test.tsx` — run a single test file.
- `npm test -- -t "test name"` — run tests matching a name pattern.
- `npx eslint src/` — lint source files; there is no npm lint script.
- `npx eslint --fix src/` — auto-fix lint issues.
- `npx tsc --noEmit` — type-check without emitting files.
- `node build/generate-calendars.js badminton` — generate static ICS files for the badminton site.
- `node build/generate-queues.mjs badminton` — generate notification queue data in Firebase; requires Firebase credentials in the environment.
- `node build/generate-icons.js` — generate app icons from the root `logo.png`.

Common local environment values:

```env
NEXT_PUBLIC_SITE_KEY=badminton
NEXT_PUBLIC_CURRENT_YEAR=2026
```

Optional environment variables used by the app include `NEXT_PUBLIC_PLAUSIBLE_KEY`, `NEXT_PUBLIC_GOOGLE_VERIFICATION`, Firebase public config, Postmark, Novu, and `EDGEONE_PAGES_PROJECT_NAME`.

## Architecture overview

This is a Next.js 15 App Router application with React 19. It renders a multilingual badminton tournament calendar, stores tournament data as JSON, and can generate ICS calendar downloads both dynamically through an API route and statically through build scripts.

The app is site-key driven. `NEXT_PUBLIC_SITE_KEY` selects the data and asset folder, currently `badminton`; `NEXT_PUBLIC_CURRENT_YEAR` selects the year rendered on the main schedule page. Tournament and site configuration live under `_db/badminton/`, while `_db/sites.json` is used by scripts that can operate across sites.

Internationalized routes are under `src/app/[locale]/`. `src/middleware.ts` handles browser-language redirects and `next-intl` routing for `en`, `zh`, and `zh-HK`; `src/i18n.ts` loads messages from `locales/{locale}/localization.json`. Note that `src/i18nConfig.js` and `src/middleware.ts` currently disagree on the default locale (`zh` vs `en`), so verify intended behavior before changing locale routing.

`src/app/[locale]/layout.tsx` wraps pages with `UserContextProvider` and `NextIntlClientProvider`, sets metadata from translations plus `_db/badminton/config.json`, and includes Plausible/PWA metadata. The main schedule page `src/app/[locale]/page.tsx` reads `_db/$NEXT_PUBLIC_SITE_KEY/$NEXT_PUBLIC_CURRENT_YEAR.json` and `config.json` from disk, then passes data into `Layout`, `OptionsBar`, and `Races`.

Client-side user preferences are centralized in `src/components/UserContext.tsx`: timezone, 12/24-hour format, collapsed past races, theme, and UUID are persisted in `localStorage`. Components such as `OptionsBar`, `Races`, `Race`, and `RaceTR` consume this context to format schedules and control display behavior. Day/time rendering uses `dayjs` with `utc` and `timezone` plugins.

Calendar generation has two paths:

- `src/app/api/badminton-calendar/route.ts` dynamically returns an ICS file from query parameters (`o`, `lc`, `c`, `f`, `y`, `g`, `m`, `sg`, `ss`, `sf`, `a`, `lang`). It reads `_db/badminton/config.json`, the configured output year, and the selected locale file.
- `build/generate-calendars.js` generates static ICS permutations into `public/download/` when `NEXT_PUBLIC_SITE_KEY` is set, otherwise into `static/`. This script expects older config fields such as `sessionMap`, `sessions`, and optional `sessionLengths`; check compatibility with `_db/badminton/config.json` before relying on it.

Build utilities are in `build/`: `public-assets.js` copies files from `_public/$NEXT_PUBLIC_SITE_KEY`; `generate-icons.js` derives icon files from `logo.png`; `generate-queues.mjs` writes upcoming email/push notifications to a Firestore collection named `${siteKey}-queue`.

## Data and translation rules

Tournament data is stored in `_db/badminton/YYYY.json` as a `races` array. Each race should include names, locations, coordinates, `type`, `category` when applicable, `isMajor`, date range, `sessions`, `sessionTypes`, `slug`, and `localeKey`; optional flags include `tbc` and `canceled`.

When adding or changing tournament data:

- Add or update translations for `localeKey` in all locale files under `locales/*/localization.json`.
- Keep `sessions` ordered chronologically because UI logic uses the first and last object keys to determine date ranges and whether a race has occurred.
- Keep `sessionTypes` aligned with session keys and with `_db/badminton/config.json` `sessionTypes` (`group`, `semifinal`, `final`).
- Set `isMajor: true` only for Super 1000 open tournaments (`type: "open"`, `category: "1000"`), championships, Olympics, and finals. Categories 750, 500, 300, 100, and series should be `isMajor: false` unless the event type itself is one of those major types.

## Styling, tests, and conventions

Tailwind CSS 4 and CSS variables in `src/app/[locale]/globals.css` drive styling and themes. Prettier is configured for 2 spaces, single quotes, semicolons, and 80-character width. TypeScript path aliases include `@components/*`, `@models/*`, `@_db/*`, plus Vitest aliases for `components` and `models`.

Tests use Vitest with jsdom, globals, Testing Library setup from `src/__tests__/setup.ts`, and component tests under `src/components/**/__tests__/` plus root tests under `src/__tests__/`. Because UI behavior depends on browser APIs and `localStorage`, prefer Testing Library interactions over testing implementation details.

## Guidelines

Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

### 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

### 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

### 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

### 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.


## Contraints

1. Don't add claude to commit message
