import { memo, useEffect, useRef, type RefObject } from 'react';
import { themes } from 'prism-react-renderer';

import { PlaygroundCodeEditor } from './PlaygroundCodeEditor';

const editorTheme = themes.github;
const TRANSPILE_DEBOUNCE_MS = 80;

export type PlaygroundLiveEditorProps = {
  initialCode: string;
  transpileRef: RefObject<(code: string) => void>;
  onCodeEdit?: (code: string) => void;
};

export const PlaygroundLiveEditor = memo(function PlaygroundLiveEditor({
  initialCode,
  transpileRef,
  onCodeEdit,
}: PlaygroundLiveEditorProps) {
  const onCodeEditRef = useRef(onCodeEdit);
  const transpileTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const latestCodeRef = useRef(initialCode);

  useEffect(() => {
    onCodeEditRef.current = onCodeEdit;
  }, [onCodeEdit]);

  useEffect(
    () => () => {
      if (transpileTimerRef.current !== undefined) {
        clearTimeout(transpileTimerRef.current);
      }
    },
    [],
  );

  return (
    <PlaygroundCodeEditor
      initialCode={initialCode}
      theme={editorTheme}
      language="tsx"
      onChange={(newCode) => {
        latestCodeRef.current = newCode;
        onCodeEditRef.current?.(newCode);

        if (transpileTimerRef.current !== undefined) {
          clearTimeout(transpileTimerRef.current);
        }
        transpileTimerRef.current = setTimeout(() => {
          transpileRef.current?.(latestCodeRef.current);
        }, TRANSPILE_DEBOUNCE_MS);
      }}
    />
  );
});
