import path from 'node:path';
import { fileURLToPath } from 'node:url';

import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  "stories": [
    "../src/designSystem/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@chromatic-com/storybook",
    "@storybook/addon-vitest",
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
    "@storybook/addon-onboarding"
  ],
  "framework": "@storybook/react-vite",
  viteFinal: async (viteConfig) => {
    // #region agent log
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const repoRoot = path.join(__dirname, '..');
    let matchedStoryFiles = -1;
    try {
      const { globSync } = await import('glob');
      matchedStoryFiles = globSync(
        'src/designSystem/**/*.stories.@(js|jsx|mjs|ts|tsx)',
        { cwd: repoRoot },
      ).length;
    } catch {
      matchedStoryFiles = -2;
    }
    fetch('http://127.0.0.1:7420/ingest/0e945e2b-83f4-4e0c-bf5d-e3ab6148cb8f', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': 'bab931' },
      body: JSON.stringify({
        sessionId: 'bab931',
        runId: 'pre-fix',
        hypothesisId: 'H1',
        location: '.storybook/main.ts:viteFinal',
        message: 'Storybook viteFinal — repo story glob count vs cwd',
        data: {
          nodeCwd: process.cwd(),
          repoRoot,
          matchedStoryFiles,
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
    return viteConfig;
  },
};
export default config;