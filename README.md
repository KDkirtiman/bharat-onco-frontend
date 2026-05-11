# Bharat Oncology — Frontend

This repository holds the **Bharat Oncology** web frontend workbench: a **React** application built with **Vite**, plus a **Storybook**-documented design system (tokens, primitives, layouts, and composed screens).

The runnable package is under **`design-system/`**. Install dependencies and run scripts from that folder.

---

## Quick start

```bash
cd design-system
npm install
npm run dev
```

- **App (Vite)** — dev server URL is printed in the terminal (usually `http://localhost:5173`). The shell is intentionally small; most UI work happens in components and stories.
- **Storybook** — `npm run storybook`, then open `http://localhost:6006` to browse the component catalog.

---

## What lives where

| Area | Location |
|------|----------|
| Design tokens (CSS variables) | `design-system/src/designSystem/tokens/` |
| Core UI (Button, Card, fields, typography, etc.) | `design-system/src/designSystem/core/` |
| Icons | `design-system/src/designSystem/icons/` |
| Navigation (e.g. sidebar) | `design-system/src/designSystem/navigation/` |
| Tables, pagination, toolbar | `design-system/src/designSystem/tables/` |
| Dashboard-style widgets | `design-system/src/designSystem/widgets/` |
| Full-page demos / layouts | `design-system/src/designSystem/pages/` |
| Storybook stories | `*.stories.tsx` next to components |
| Storybook config | `design-system/.storybook/` |

---

## Scripts (run inside `design-system/`)

| Command | Description |
|---------|-------------|
| `npm run dev` | Vite dev server with HMR |
| `npm run build` | Typecheck + production build |
| `npm run preview` | Serve the production build locally |
| `npm run storybook` | Storybook on port **6006** |
| `npm run build-storybook` | Static Storybook output → `storybook-static/` (ignored by git) |
| `npm test` | Vitest (includes Storybook test integration) |

---

## Prerequisites

- **Node.js** 18+ (see `engines` in `design-system/package.json`)
- **npm**

---

## More detail

See **`design-system/README.md`** for repository layout, Storybook wiring, and story groupings.

---

## License

**ISC** — see `design-system/package.json`.
