# Contributing

## Branch strategy

- `master` — stable; Storybook deploys on push
- `release/*` — feature integration branches

## Releasing a new version

1. Update `version` in `package.json` (semver)
2. Run `npm run build` locally and verify it passes
3. Run `npm run build-storybook` and spot-check key stories
4. Commit: `chore: release vX.Y.Z`
5. Tag and push:
   ```bash
   git tag vX.Y.Z
   git push origin master --tags
   ```
6. The **Release Package** workflow publishes `@kdkirtiman/bharat-onco-frontend` to GitHub Packages

## Monorepo layout

```
packages/
├── bfd-themes/     # CSS, tokens, tailwind preset
├── bfd-icons/      # icon exports
├── bfd-core/       # primitives + layout
├── bfd-tables/     # table components
└── bfd-patterns/   # overlays, patient tabs
apps/
└── storybook/      # unified Storybook
shim.ts             # compat entry for @kdkirtiman/bharat-onco-frontend
index.ts            # re-exports bfd-* packages
```

## Adding a component

Each component lives in its **own folder** with styles separated:

```
packages/bfd-core/components/feedback/Callout/
├── Callout.tsx
├── Callout.styles.ts    ← all Tailwind class strings here
├── Callout.stories.tsx
└── index.ts
```

1. Create the folder under the appropriate `bfd-*` package
2. Put all `className` / Tailwind strings in `<Name>.styles.ts` — none in the `.tsx`
3. Export from the category barrel (`feedback/index.ts`) and package `index.ts`
4. Add a Storybook story in the component folder
5. Use fixtures from `apps/storybook/stories/fixtures.ts`

## Design system changes

### Token locations

| Layer | Path |
|-------|------|
| CSS variables (source of truth) | `packages/bfd-themes/styles/theme.css` |
| TypeScript class maps | `packages/bfd-themes/tokens/` |
| Storybook catalog | `apps/storybook/foundations/` |
| Tailwind consumer preset | `bfd-themes/tailwind` |

### Consumer imports

```tsx
import 'bfd-themes/register';
import { Button, Callout } from 'bfd-core';
import { Calendar } from 'bfd-icons';
```

### Token usage rules

1. **Use semantic tokens** — prefer `bg-success-soft text-success-emphasis` or imports from `bfd-themes` over raw Tailwind palette classes.
2. **Badge maps** — status color registries in `packages/bfd-core/datapoints/` must import from `badge` in `bfd-themes`.
3. **Typography** — use `text-micro`, `text-caption`, `text-caption-sm` instead of arbitrary pixel sizes.
4. **Adding a new semantic color** — add CSS variables in `bfd-themes`, update `semantic-colors.ts`, document in Foundations/Colors Storybook.
5. After token changes, run `npm run build`.
