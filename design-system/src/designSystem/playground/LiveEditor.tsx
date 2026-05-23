import { useCallback, useEffect, useMemo, useRef, useState, type ReactElement } from 'react';
import { LiveError, LivePreview, LiveProvider } from 'react-live';
import { themes } from 'prism-react-renderer';

import { PlaygroundLiveEditor } from './PlaygroundLiveEditor';
import { TranspileBridge } from './TranspileBridge';
import { subscribePreviewTheme } from './previewTheme';
import { ThemeProvider, type ThemeName } from '../tokens/ThemeProvider';
import { playgroundScope } from './scope';

import styles from './playground.module.css';

const editorTheme = themes.github;

function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');
}

export type LiveEditorProps = {
  code: string;
  title?: string;
  theme?: ThemeName;
};

export function LiveEditor({
  code: initialCode,
  title = 'Try it',
  theme: themeProp,
}: LiveEditorProps) {
  const [toolbarTheme, setToolbarTheme] = useState<ThemeName>('default');
  const theme = themeProp ?? toolbarTheme;
  const [previewKey, setPreviewKey] = useState(0);
  const previewTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const transpileRef = useRef<(code: string) => void>(() => {});
  const headingId = slugifyHeading(title);

  useEffect(() => {
    setPreviewKey((k) => k + 1);
  }, [initialCode]);

  useEffect(() => {
    if (themeProp !== undefined) return undefined;
    return subscribePreviewTheme(setToolbarTheme);
  }, [themeProp]);

  const handleCodeEdit = useCallback(() => {
    if (previewTimerRef.current !== undefined) {
      clearTimeout(previewTimerRef.current);
    }
    previewTimerRef.current = setTimeout(() => {
      setPreviewKey((k) => k + 1);
    }, 300);
  }, []);

  useEffect(
    () => () => {
      if (previewTimerRef.current !== undefined) {
        clearTimeout(previewTimerRef.current);
      }
    },
    [],
  );

  const scope = useMemo(
    () => ({
      ...playgroundScope,
      render: (element: ReactElement) => element,
    }),
    [],
  );

  return (
    <section
      className={`${styles.root} ds-live-playground sb-unstyled`}
      aria-labelledby={headingId}
    >
      <div className={styles.header}>
        <h2 id={headingId} className={styles.title}>
          {title}
        </h2>
      </div>

      <div className={styles.split}>
        <div className={styles.editorPane}>
          <span className={styles.label}>Playground</span>
          <div className={styles.editorShell}>
            <PlaygroundLiveEditor
              key={initialCode}
              initialCode={initialCode}
              transpileRef={transpileRef}
              onCodeEdit={handleCodeEdit}
            />
          </div>
        </div>
        <div className={styles.previewPane}>
          <LiveProvider
            key={initialCode}
            code={initialCode}
            scope={scope}
            noInline
            language="tsx"
            theme={editorTheme}
          >
            <TranspileBridge transpileRef={transpileRef} />
            <span className={styles.label}>Preview</span>
            <div className={styles.previewSurface}>
              <ThemeProvider key={previewKey} theme={theme}>
                <LivePreview />
              </ThemeProvider>
            </div>
            <LiveError className={styles.error} />
          </LiveProvider>
        </div>
      </div>
    </section>
  );
}
