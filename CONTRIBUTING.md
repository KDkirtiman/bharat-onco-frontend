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

## Adding a component

1. Add the component under `src/components/`
2. Export it from `src/index.ts`
3. Add a `*.stories.tsx` file alongside the component
4. Use fixtures from `src/stories/fixtures.ts` or extend mock datapoints

## Design system changes

- Tokens live in `src/styles/theme.css`
- After token changes, run `npm run build` to regenerate `dist/styles.css`
