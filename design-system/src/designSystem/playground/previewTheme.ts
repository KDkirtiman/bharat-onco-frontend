import type { ThemeName } from '../tokens/ThemeProvider';

type Listener = (theme: ThemeName) => void;

let currentTheme: ThemeName = 'default';
const listeners = new Set<Listener>();

/** Updated from the Storybook preview decorator (`context.globals.dsTheme`). */
export function setPreviewTheme(theme: ThemeName): void {
  if (currentTheme === theme) return;
  currentTheme = theme;
  listeners.forEach((listener) => listener(theme));
}

export function getPreviewTheme(): ThemeName {
  return currentTheme;
}

/** Subscribe to toolbar theme changes without Storybook preview hooks. */
export function subscribePreviewTheme(listener: Listener): () => void {
  listeners.add(listener);
  listener(currentTheme);
  return () => listeners.delete(listener);
}
