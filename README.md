# Bharat Oncology Frontend

A comprehensive oncology EHR frontend built with **React 19**, **TypeScript 6**, and **Vite 8**.
Includes a full design system, Storybook component library, and clinical UI screens.

---

## Repository Structure

```
bharat-onco-frontend/
├── design-system/          ← Main app + design system (React 19 + Vite + Storybook)
│   ├── src/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   ├── designSystem/   ← Component library (Avatar, Button, Card, Forms, Tables...)
│   │   └── shared/         ← API types generated from openapi.yaml
│   ├── .storybook/
│   └── package.json
├── openapi.yaml            ← API contract copy (source of truth: bharat-onco-platform)
├── .nvmrc                  ← Node 20 LTS
└── commitlint.config.js    ← Conventional commits enforcement
```

---

## Prerequisites

- Node 20 LTS (`nvm use` if you have nvm)
- npm 10+

---

## Getting Started

```bash
git clone https://github.com/KDkirtiman/bharat-onco-frontend.git
cd bharat-onco-frontend/design-system

cp .env.example .env
# Edit .env — set VITE_API_URL to backend URL

npm install
npm run dev         # → http://localhost:5173
npm run storybook   # → http://localhost:6006
```

---

## Available Scripts

```bash
npm run dev             # Start Vite dev server
npm run build           # Production build
npm run storybook       # Storybook component explorer
npm run test            # Vitest unit tests
npm run lint            # ESLint
npm run format          # Prettier
npm run generate:types  # Regenerate TypeScript types from openapi.yaml
```

---

## Using Shared Types

```typescript
import type { Patient, Appointment, Bill } from './shared';
```

Types are generated from `openapi.yaml` — run `npm run generate:types` after updating the spec.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 |
| Language | TypeScript 6 (strict) |
| Build | Vite 8 |
| Components | Custom design system |
| Docs | Storybook 10 |
| Testing | Vitest + Chromatic |
| Linting | ESLint + Prettier |
| Commits | Conventional Commits (commitlint) |

---

## Related

- **Backend:** [bharat-onco-platform](https://github.com/KDkirtiman/bharat-onco-platform)
- **API Contract:** `openapi.yaml` at repo root
