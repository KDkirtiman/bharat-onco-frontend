import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';

import { cn } from '../utils/cn';

export type ThemeName = 'default' | 'contrast';

export type ThemeOverrides = Record<string, string>;

type ThemeContextValue = {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  overrides: ThemeOverrides;
  setOverrides: (overrides: ThemeOverrides) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export type ThemeProviderProps = {
  children: ReactNode;
  theme?: ThemeName;
  defaultTheme?: ThemeName;
  onThemeChange?: (theme: ThemeName) => void;
  overrides?: ThemeOverrides;
  className?: string;
};

export function ThemeProvider({
  children,
  theme: controlledTheme,
  defaultTheme = 'default',
  onThemeChange,
  overrides: controlledOverrides,
  className,
}: ThemeProviderProps) {
  const [uncontrolledTheme, setUncontrolledTheme] = useState<ThemeName>(defaultTheme);
  const [uncontrolledOverrides, setUncontrolledOverrides] = useState<ThemeOverrides>({});

  const theme = controlledTheme ?? uncontrolledTheme;
  const overrides = controlledOverrides ?? uncontrolledOverrides;

  const setTheme = useCallback(
    (next: ThemeName) => {
      if (controlledTheme === undefined) setUncontrolledTheme(next);
      onThemeChange?.(next);
    },
    [controlledTheme, onThemeChange],
  );

  const setOverrides = useCallback(
    (next: ThemeOverrides) => {
      if (controlledOverrides === undefined) setUncontrolledOverrides(next);
    },
    [controlledOverrides],
  );

  const value = useMemo(
    () => ({ theme, setTheme, overrides, setOverrides }),
    [theme, setTheme, overrides, setOverrides],
  );

  const style = useMemo(() => {
    const vars = Object.entries(overrides).reduce<CSSProperties>((acc, [key, val]) => {
      (acc as Record<string, string>)[key.startsWith('--') ? key : `--${key}`] = val;
      return acc;
    }, {});
    return vars;
  }, [overrides]);

  return (
    <ThemeContext.Provider value={value}>
      <div
        data-ds-theme={theme}
        className={cn(className)}
        style={style}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}

/** Returns theme context when inside ThemeProvider, otherwise null (for optional theme-aware UI). */
export function useThemeOptional() {
  return useContext(ThemeContext);
}

