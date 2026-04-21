## Predika — Copilot instructions for code edits

These short instructions help AI coding agents quickly become productive in this repository.

- Project entry: `src/main.jsx` (React + React Router). App routes and high-level pages live in `src/App.jsx`.
- Build & dev commands (from `package.json`): `npm install`, `npm run dev` (vite), `npm run build`, `npm run preview`, `npm run lint`.
- Path alias: `@` maps to `./src` (see `vite.config.js`). Use `@/...` imports in suggestions.

Key architecture & conventions

- Pages live in `src/pages` and use kebab-case filenames (e.g. `text-correction-page.jsx`, `dictionary-page.jsx`).
- Reusable UI lives in `src/components` with subfolders like `ui/` and `dictionary/`. Example: button variants in `src/components/ui/button.jsx` use `class-variance-authority` + the `cn` helper in `src/lib/utils.js`.
- Global state: React Context is used for auth in `src/context/auth-context.jsx`. Use `useAuth()` to access `user`, `loading`, and auth actions.
- Routing: Private routes wrap pages with `src/router/private-route.jsx` which checks `useAuth()` and renders a loader during auth check.

API & integration notes

- Backend base URL is hard-coded in `src/utils/api.js` (`https://api.predika.app`) and `src/context/auth-context.jsx` (`API_URL`). Network calls use `fetch` with `credentials: 'include'` (cookie-based auth). When making new API helpers, follow the same pattern (JSON headers, credentials include, check `response.ok` and parse `response.json()`).
- OAuth redirect: Google auth uses `window.location.href = `${API_URL}/auth/google``in`auth-context.jsx`and callback route`'/auth/google/callback'`is handled in`App.jsx`.

Styling & components

- Tailwind CSS is used; component CSS classes are composed with `cva` (see `src/components/ui/button.jsx`) and merged with `cn` (src/lib/utils.js). Prefer using variant APIs (cva) for new UI components.
- Radix primitives and lucide icons are used across UI. Keep accessibility patterns (focus-visible ring, sr-only text) consistent with existing components.

Developer workflow tips

- Local dev requires backend or mocks due to cookie auth (CORS + cookies). If the API is not available, mock fetch responses or stub `API_URL` usage.
- Use the `@` alias when adding imports: e.g. `import { useAuth } from '@/context/auth-context'`.
- Linting: `npm run lint` (ESLint). Keep existing ESLint config at repo root.

What to change and how to test small edits

- Adding an API helper: add to `src/utils/api.js` following existing patterns (BASE_URL, credentials include, throw on !response.ok). Include JSDoc comment.
- Adding a page: create `src/pages/<kebab-name>.jsx`, register route in `src/App.jsx`. Localize route path strings where other routes use Haitian Creole.
- UI variant: extend `buttonVariants` in `src/components/ui/button.jsx` and use `cn` to combine extra classes.

Files to inspect for context (examples)

- `src/App.jsx` — routes & analytics init (ReactGA).
- `src/context/auth-context.jsx` — auth flows, register/login/reset and cookie-based calls.
- `src/utils/api.js` — API endpoints and error handling patterns.
- `src/components/ui/button.jsx` — style system (cva + cn).

If you are unsure about a behavioral change

- Prefer minimal, localized edits. Run `npm run dev` and exercise the affected page/route. If the change touches auth or API flows, mention reliance on `https://api.predika.app` and that cookies/CORS may be required.

Ask the human if:

- You need credentials, environment variables, or a local API to fully test auth flows.
- A change affects infra (Docker/traefik/nginx) — provide exact commands and desired behavior before modifying deployment files.

Keep the instructions short—refer back to this file and the listed source files for examples.
