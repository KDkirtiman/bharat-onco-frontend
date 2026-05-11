# Bharat Oncology — Frontend

React + Vite workspace for the Bharat Oncology UI. The runnable **app shell** is minimal; components and stories live under **`src/designSystem/`** and are documented in **Storybook**.

---

## Prerequisites

- **Node.js** 18 or newer ([`engines.node`](package.json))
- **npm** (ships with Node)

---

## Install

From the repository root:

```bash
npm install
```

---

## Run the Vite application

Starts the dev server with hot reload (URL in the terminal, typically **http://localhost:5173**):

```bash
npm run dev
```

- **`src/main.tsx`** — entry; imports **`src/designSystem/tokens/globals.css`**
- **`src/App.tsx`** — minimal placeholder pointing you to Storybook

Production build:

```bash
npm run build
npm run preview
```

---

## Storybook (design system)

### Start Storybook

```bash
npm run storybook
```

Open **http://localhost:6006**.

### Static build (optional)

```bash
npm run build-storybook
```

Output: **`storybook-static/`** (gitignored). Deploy that folder for a hosted component catalog.

### Wiring

| Item | Location |
|------|----------|
| Stories glob | [`src/designSystem/**/*.stories.*`](.storybook/main.ts) |
| Global CSS tokens | [`src/designSystem/tokens/globals.css`](src/designSystem/tokens/globals.css) (also imported in [`.storybook/preview.ts`](.storybook/preview.ts)) |

---

## Repository layout

```
├── .storybook/          # Storybook config
├── src/
│   ├── designSystem/    # Tokens, components, Storybook stories
│   ├── App.tsx
│   ├── main.tsx
│   └── vite-env.d.ts
├── index.html
├── package.json         # dependencies & scripts (single source of truth)
├── package-lock.json    # lockfile (npm)
├── tsconfig.json
├── vite.config.ts
└── vitest.config.ts
```

| Path | Purpose |
|------|--------|
| **`src/designSystem/tokens/`** | CSS variables — `globals.css` |
| **`src/designSystem/core/`** | Button, Card, TextField, Badge, Avatar, Typography, PageHeader |
| **`src/designSystem/icons/`** | `Icon` + glyphs |
| **`src/designSystem/navigation/`** | Sidebar |
| **`src/designSystem/widgets/`** | Metric cards, activity rows, etc. |
| **`src/designSystem/tables/`** | Data table, toolbar, pagination |
| **`src/designSystem/pages/`** | Full-page compositions (e.g. app shell + patient list) |

### Storybook groups (by story `title`)

- **Core/** — primitives  
- **Icons/** — icon set  
- **Navigation/** — sidebar  
- **Widgets/** — dashboard widgets  
- **Tables/** — data table  
- **Pages/** — full layouts  

---

## Tests

```bash
npm test
```

Vitest + Storybook addon (see `vitest.config.ts`).

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Vite dev server |
| `npm run build` | Typecheck + production build |
| `npm run preview` | Serve production build |
| `npm run storybook` | Storybook on port **6006** |
| `npm run build-storybook` | Static Storybook → `storybook-static/` |
| `npm test` | Vitest |

---

## Dependencies

Resolved versions are pinned in **`package-lock.json`**. Declared ranges are in **`package.json`**:

- **dependencies** — `react`, `react-dom`
- **devDependencies** — TypeScript, Vite, Storybook add-ons, ESLint, Vitest, Playwright, typings, etc.

---

## License

ISC — see `package.json`.
