# Bharat Oncology — Design System

Self-contained React + Vite package with Storybook. Components live under **`src/designSystem/`**.

This folder is designed to be **moved as-is** into its own repository when ready — it includes its own `package.json`, lockfile, configs, and `.gitignore`.

---

## Prerequisites

- **Node.js** 18 or newer
- **npm**

---

## Install & run

From **this folder** (`design-system/`):

```bash
npm install
npm run dev          # Vite app → http://localhost:5173
npm run storybook    # Storybook → http://localhost:6006
```

---

## Storybook (design system)

- **Theme toolbar** — switch `default` / `contrast` token presets
- **Docs → Try it live** — interactive `react-live` playground on each component's Docs tab
- **Playground/Composition** — multi-component sandbox
- See **[COMPONENTS.md](./COMPONENTS.md)** for the full component checklist

Static build: `npm run build-storybook`

---

## Repository layout

```
src/designSystem/
├── tokens/          # globals.css, ThemeProvider, theme presets
├── utils/           # cn, Portal, hooks, ClickAwayListener, …
├── core/            # Avatar, Button, Card, Accordion, Title, …
├── forms/           # TextField, Select, DatePicker, OtpField, …
├── feedback/        # Modal, Snackbar, Banner, Tooltip, …
├── layout/          # Shell, Header, Footer
├── navigation/      # Sidebar, Menu, Tabs, ActionBar, …
├── data/            # List, Tag, Stepper, Carousel, Workflow, …
├── playground/      # Live composition editor
├── icons/ tables/ widgets/ pages/
└── index.ts         # public barrel export
```

Storybook config: `.storybook/`

---

## Theming

Components use semantic CSS variables (`--ds-*`) only. Override tokens globally, per theme (`data-ds-theme`), or via `ThemeProvider` `overrides`. Wrap your app:

```tsx
import { ThemeProvider } from '@/designSystem';

<ThemeProvider theme="contrast">…</ThemeProvider>
```

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Vite dev server |
| `npm run build` | Typecheck + production build |
| `npm run preview` | Serve production build locally |
| `npm run storybook` | Storybook on port **6006** |
| `npm run build-storybook` | Static Storybook output |
| `npm test` | Vitest (Storybook browser tests) |
| `npm run test:coverage` | Tests with coverage report |
| `npm run chromatic` | Visual regression (needs `CHROMATIC_PROJECT_TOKEN`) |

---

## Tests & CI

CI (`.github/workflows/design-system-ci.yml`) runs tests, coverage, Storybook build, optional Chromatic, and deploys to **GitHub Pages** on `main`.

---

## License

ISC
