# Bharat Oncology — Frontend

Monorepo-style workspace. Each top-level folder is a **self-contained package** that can be moved to its own repository later.

---

## Packages

| Folder | Description |
|--------|-------------|
| **[`design-system/`](./design-system/)** | React design system + Storybook (components under `src/designSystem/`) |

Future app code (e.g. patient portal, admin) will live in sibling folders at this level.

---

## Quick start (design system)

```bash
cd design-system
npm install
npm run storybook    # http://localhost:6006
npm run dev          # Vite shell → http://localhost:5173
```

See **[design-system/README.md](./design-system/README.md)** for full docs, scripts, and component layout.

---

## Extracting `design-system` to its own repo

When the dedicated design-system repository is ready:

1. Copy or move the entire `design-system/` folder into the new repo root.
2. That folder already contains its own `package.json`, lockfile, `.gitignore`, Storybook config, and CI-relevant scripts — no parent repo required.

---

## CI

GitHub Actions (`.github/workflows/design-system-ci.yml`) runs tests and Storybook build from `design-system/`.
