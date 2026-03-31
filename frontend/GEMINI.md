# Datadex Frontend GEMINI.md

This directory contains the **Next.js frontend** for the Datadex Wireframe project. It serves as the user interface for browsing and exploring datasets managed by a CKAN backend.

## Project Overview

- **Purpose:** A modern data catalog UI providing search, discovery, and visualization for datasets.
- **Backend:** Communicates with a CKAN 2.10+ API.
- **Key Features:**
  - Dataset search and filtering.
  - Interactive map visualizations (Leaflet).
  - Dataset health and summary information.
  - Integration with machine learning prediction APIs.

## Technology Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Library:** [React](https://react.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **State Management:** React hooks and server/client component patterns.
- **Maps:** [Leaflet](https://leafletjs.com/) via `react-leaflet`.
- **Icons:** [Lucide-react](https://lucide.dev/).
- **Testing:** [Playwright](https://playwright.dev/).

## Getting Started

### Prerequisites

- Node.js (>=24)
- Yarn (preferred) or NPM

### Commands

- `yarn dev`: Starts the development server at [http://localhost:3000](http://localhost:3000).
- `yarn build`: Builds the application for production.
- `yarn start`: Starts the production server.
- `yarn lint`: Runs ESLint for code quality checks.
- `npx playwright test`: Runs end-to-end tests.

## Directory Structure

- `app/`: Next.js App Router pages and layouts.
  - `dataset/`: Dataset-specific views.
  - `tag/`: Tag discovery.
  - `predict/`: Prediction API testing and interface.
- `components/`: Reusable React components (UI elements, maps, cards).
- `lib/`: Utility functions and API clients (e.g., `ckan.ts`).
- `public/`: Static assets (images, logos).
- `types/`: TypeScript type definitions (especially for CKAN objects).
- `tests/`: Playwright end-to-end tests.

## Development Conventions

- **App Router:** Use the App Router pattern for routing and data fetching.
- **TypeScript:** Rigorous typing for all data structures, especially those coming from CKAN.
- **Styling:** Use Tailwind CSS for all styling.
- **Component Patterns:** Prefer Server Components where possible for better performance and SEO. Use Client Components only when interactivity (like Leaflet) is required.
- **Environment Variables:**
  - `CKAN_BASE_URL`: URL of the CKAN backend.
  - `NEXT_PUBLIC_CKAN_URL`: Public-facing CKAN URL for browser links.

## Testing Strategy

- Use Playwright for critical path testing (search, dataset navigation).
- Tests are located in the `tests/` directory.
- `playwright.config.ts` manages test configuration.

### Playwright Best Practices for Agents

To avoid hanging processes and interactive prompts when running tests, always use the following flags:

```bash
# Ensure yarn dev is restarted with a clean slate before running tests
# This prevents state leaks and ensures the latest changes are reflected.

# Run tests for a specific file with non-interactive reporter
npx playwright test tests/search.spec.ts --reporter=line --project=chromium --headed
```

# If the project has a commented out baseURL, provide it explicitly
# Or use full URLs in your test scripts (preferred for reliability)
npx playwright test tests/search.spec.ts --reporter=line --headed
```

**Common Pitfalls:**
- **HTML Reporter:** By default, Playwright may try to serve an HTML report on failure, which will hang the CLI. Always use `--reporter=line` or `--reporter=dot`.
- **Base URL:** If `page.goto('/')` fails with an "Invalid URL" error, it means `baseURL` is not configured in `playwright.config.ts`. Use full URLs (e.g., `http://localhost:3000/`) in your tests.
