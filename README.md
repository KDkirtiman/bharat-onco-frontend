# Bharat Oncology — Frontend

Reusable React UI component library for the **Bharat Oncology** EHR, published as `@kdkirtiman/bharat-onco-frontend`. Built as an npm workspaces monorepo with a single unified Storybook.

---

## Quick start

```bash
npm install
npm run dev          # Storybook on http://localhost:6006
npm run build         # Builds all packages + the library bundle
```

**Stack:** React 18/19 · TypeScript · Tailwind CSS v4 · lucide-react · Radix UI primitives · Vite · Storybook 8

---

## Monorepo layout

```
packages/
├── bfd-themes/      # CSS variables, design tokens, tailwind preset
├── bfd-icons/       # icon exports
├── bfd-core/        # primitives, controls, layout, data display
├── bfd-tables/      # table components
└── bfd-patterns/    # overlays, invoice templates, patient tabs
.storybook/           # unified Storybook config (root-level)
scripts/               # build & version-sync tooling
index.ts               # re-exports bfd-* packages
shim.ts                # compat entry for @kdkirtiman/bharat-onco-frontend
```

Each component lives in its own folder with styles kept in a sibling `<Name>.styles.ts` file. See [CONTRIBUTING.md](./CONTRIBUTING.md) for the full component/PR workflow.

---

## Install as npm package

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

See [CONTRIBUTING.md](./CONTRIBUTING.md) for the release workflow.

---

## What lives where

| Area | Location |
|------|----------|
| Design tokens (CSS variables) | `packages/bfd-themes/styles/theme.css` |
| TypeScript token/class maps | `packages/bfd-themes/tokens/` |
| Tailwind consumer preset | `packages/bfd-themes/styles/tailwind.css` |
| Icons | `packages/bfd-icons/` |
| Core UI (Button, Select, FormField, KPICard, layout, etc.) | `packages/bfd-core/components/` |
| Tables | `packages/bfd-tables/` |
| Billing / clinical / scheduling overlays, invoice templates | `packages/bfd-patterns/` |
| Unified Storybook config | `.storybook/` |

---

## License

Private — Bharat Oncology internal use.
