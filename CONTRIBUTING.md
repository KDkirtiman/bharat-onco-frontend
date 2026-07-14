# Contributing

## Branch strategy

- `master` — stable; Storybook deploys on push
- `release/*` — feature integration branches
- `feature/*` — all development happens here

**Direct pushes to `master` and `release/*` are not allowed.** All changes must land via a pull request from a `feature/*` branch and be merged after review/CI passes. This is enforced with GitHub branch protection rules (see below), not just convention.

### Enforcing this in GitHub (branch protection)

Repo admin needs to configure this once under **Settings → Branches → Branch protection rules** (or **Rulesets**, GitHub's newer equivalent):

1. Go to the repo → **Settings** → **Branches**.
2. Under **Branch protection rules**, click **Add rule**.
3. Set **Branch name pattern** to `master` (add a separate rule for `release/*`).
4. Enable:
   - **Require a pull request before merging** (this alone blocks direct pushes)
   - **Require approvals** (e.g. 1+ reviewer)
   - **Require status checks to pass before merging** — select the CI/build workflows
   - **Do not allow bypassing the above settings** — otherwise admins can still push directly
   - Optionally: **Require branches to be up to date before merging**, **Require linear history**
5. Repeat for the `release/*` pattern (or use `release/**` to cover all release branches).
6. Save. Once enabled, `git push origin master` / `git push origin release/x` will be rejected for everyone except through a merged, approved PR.

Equivalent via `gh` CLI:

```bash
gh api repos/KDkirtiman/bharat-onco-frontend/branches/master/protection \
  -X PUT \
  -F required_pull_request_reviews.required_approving_review_count=1 \
  -F enforce_admins=true \
  -F required_status_checks=null \
  -F restrictions=null
```

(Run the same for each `release/*` branch, or use **Rulesets** with a `release/*` fnmatch pattern to cover them all at once without repeating per-branch.)

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
.storybook/          # unified Storybook config (root-level)
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
5. Use fixtures from the relevant package-level stories or test helpers.

## Design system changes

### Token locations

| Layer | Path |
|-------|------|
| CSS variables (source of truth) | `packages/bfd-themes/styles/theme.css` |
| TypeScript class maps | `packages/bfd-themes/tokens/` |
| Storybook catalog | package-level stories under the relevant package folders |
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
