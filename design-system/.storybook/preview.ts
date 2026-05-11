import type { Preview } from '@storybook/react-vite'
import '../src/designSystem/tokens/globals.css';

// #region agent log
if (typeof window !== 'undefined') {
  fetch('http://127.0.0.1:7420/ingest/0e945e2b-83f4-4e0c-bf5d-e3ab6148cb8f', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': 'bab931' },
    body: JSON.stringify({
      sessionId: 'bab931',
      runId: 'pre-fix',
      hypothesisId: 'H4',
      location: '.storybook/preview.ts',
      message: 'Preview bundle evaluated (iframe)',
      data: { href: window.location.href },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
}
// #endregion

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo'
    }
  },
};

export default preview;