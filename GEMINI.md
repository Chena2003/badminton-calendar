# Project Context: Badminton Calendar Generator

This project is a Next.js application designed to generate ICS calendar files for badminton tournaments.

## 🏗️ Project Overview

*   **Type:** Web Application (Next.js 15 + React 19)
*   **Purpose:** Generate subscribe-able calendars (ICS/WebCal) for badminton events with customizable filters.
*   **Core Logic:**
    *   **Static Generation:** Pre-builds calendar files for high-traffic consumption.
    *   **Dynamic API:** Generates calendars on-the-fly based on complex user queries.
*   **Data Source:** JSON-based local database located in `_db/badminton/`.

## 🚀 Getting Started

### Prerequisites
*   Node.js 22.x
*   npm

### Installation
```bash
npm install
```

### Environment Variables
Create `.env.local` in the root:
```ini
NEXT_PUBLIC_SITE_KEY=badminton
NEXT_PUBLIC_CURRENT_YEAR=2025
```

### Development Commands
*   **Start Dev Server:** `npm run dev` (Runs on http://localhost:3000)
*   **Build Production:** `npm run build`
*   **Start Production:** `npm start`
*   **Refresh Assets:** `npm run setPublicAssets` (Copies site-specific assets from `_public/badminton` to `public/`)

## 📂 Architecture & Key Paths

### Multi-Site Structure
The codebase supports multiple sports. The active sport is defined by `NEXT_PUBLIC_SITE_KEY` (currently `badminton`).
*   **`_db/badminton/`**: Database for the current site.
    *   `config.json`: Site settings (event types, session types).
    *   `2025.json`: Tournament data for the specific year.
*   **`_public/badminton/`**: Static assets (icons, manifest) for the site.
*   **`locales/`**: Internationalization files (`zh` is default).

### Calendar Generation
1.  **Static Generator** (`build/generate-calendars.js`):
    *   Run manually or during build to create static ICS files.
    *   Command: `node build/generate-calendars.js badminton`
2.  **Dynamic API** (`src/app/api/badminton-calendar/route.ts`):
    *   Handles requests with query parameters (e.g., `?lc=1000&a=30`) to serve custom calendars.

### Source Code (`src/`)
*   **`app/[locale]/`**: App Router pages.
    *   `generate/`: The "Customize Calendar" page.
    *   `api/badminton-calendar/`: The dynamic generation endpoint.
*   **`components/`**: React components.
    *   `badminton-form.tsx`: The form UI for selecting calendar options.

## 🛠️ Common Tasks

### Adding a New Tournament
1.  Open `_db/badminton/{year}.json`.
2.  Add a new race object (copy an existing one like `malaysia-open` as a template).
    *   Ensure `slug` is unique.
    *   Set `type` (e.g., `open`, `championship`).
    *   Set `category` if applicable (e.g., `1000`, `750`).
3.  Add the Chinese translation for the event name in `locales/zh/localization.json` under `races.{localeKey}`.

### Modifying Calendar Logic
*   **Filtering Logic:** Check `src/app/api/badminton-calendar/route.ts` to adjust how query parameters filter the JSON data.
*   **ICS Generation:** Logic typically uses the `ics` library and `dayjs`.

## 📦 Deployment
*   **Application:** Standard Next.js deployment (Vercel, Docker, etc.).
*   **Static Files:** The `wrangler.toml` suggests a component is deployed to Cloudflare Workers for serving static calendar files efficiently.
