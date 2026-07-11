# Bharat Oncology — Frontend

This repository holds the **Bharat Oncology** web frontend workbench:

1. **`design-system/`** — OpenAPI-aligned design system (tokens, primitives, layouts, composed screens) with its own Vite + Storybook package.
2. **Repository root** — Reusable React component library extracted from the interactive mock (`bharat-onco-frontend`), with Storybook, mock datapoints, and mobile-responsive layout patterns.

---

## Quick start — design system

```bash
cd design-system
npm install
npm run dev
```

- **App (Vite)** — dev server URL is printed in the terminal (usually `http://localhost:5173`).
- **Storybook** — `npm run storybook`, then open `http://localhost:6006`.

See **`design-system/README.md`** for layout, Storybook wiring, and story groupings.

---

## Quick start — component library (repo root)

```bash
npm install
npm run dev          # Storybook on http://localhost:6006
npm run build        # Library + CSS
```

**Stack:** React 18/19 · TypeScript · Tailwind CSS v4 · lucide-react · Radix UI primitives

### Install as npm package

Configure GitHub Packages in your consuming repo's `.npmrc`:

```
@kdkirtiman:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN
```

Install using an npm alias so imports stay as `bharat-onco-frontend` (not `@kdkirtiman/...`):

```bash
npm install bharat-onco-frontend@npm:@kdkirtiman/bharat-onco-frontend@0.1.1
```

Or add directly to `package.json`:

```json
"bharat-onco-frontend": "npm:@kdkirtiman/bharat-onco-frontend@0.1.1"
```

```tsx
import 'bharat-onco-frontend/styles.css';
import { AppLayout, Button, KPICard, mockPatients, mockUsers } from 'bharat-onco-frontend';
```

See [CONTRIBUTING.md](./CONTRIBUTING.md) for release workflow.

---

## What lives where

| Area | Location |
|------|----------|
| Design tokens (CSS variables) | `design-system/src/designSystem/tokens/` |
| Core UI (Button, Card, fields, etc.) | `design-system/src/designSystem/core/` |
| OpenAPI spec | `design-system/openapi.yaml` |
| Shared controls, layout, patient tabs | `src/components/` |
| Billing / clinical / scheduling overlays | `src/patterns/` |
| Mock datapoints | `src/datapoints/` |
| Root Storybook config | `.storybook/` |
| Design-system Storybook | `design-system/.storybook/` |

---

## License

**ISC** — see `design-system/package.json`. Root component library is private — Bharat Oncology internal use.
