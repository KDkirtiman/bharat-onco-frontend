import { Logo } from './designSystem/icons/Logo';

export function App() {
  return (
    <div style={{ padding: 24, fontFamily: 'system-ui, Segoe UI, Roboto, Arial' }}>
      <Logo size="lg" />
      <p style={{ marginTop: 8, color: '#666' }}>
        Dev shell. Use Storybook to browse components under `src/designSystem/`.
      </p>
    </div>
  );
}

