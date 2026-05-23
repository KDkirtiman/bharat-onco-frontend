import { Highlight, type themes } from 'prism-react-renderer';
import { useLayoutEffect, useRef, useState } from 'react';
import { useEditable } from 'use-editable';

import { refinePlaygroundTokens } from './refinePlaygroundTokens';
import styles from './playground.module.css';

type PlaygroundCodeEditorProps = {
  initialCode: string;
  theme: typeof themes.github;
  language: string;
  onChange: (code: string) => void;
};

type EditablePosition = {
  position: number;
  extent: number;
};

/**
 * Fork of react-live's CodeEditor without props.code sync.
 * Restores selection after Highlight re-render (use-editable's layout pass can
 * lose to concurrent LiveProvider updates without an explicit move).
 */
export function PlaygroundCodeEditor({
  initialCode,
  theme,
  language,
  onChange,
}: PlaygroundCodeEditorProps) {
  const editorRef = useRef<HTMLPreElement>(null);
  const pendingCaretRef = useRef<EditablePosition | null>(null);
  const [code, setCode] = useState(initialCode);

  const editor = useEditable(
    editorRef,
    (text, position) => {
      const next = text.slice(0, -1);
      pendingCaretRef.current = position ?? null;
      setCode(next);
      onChange(next);
    },
    { indentation: 2 },
  );

  useLayoutEffect(() => {
    const pending = pendingCaretRef.current;
    if (!pending) return;
    pendingCaretRef.current = null;
    editor.move(pending.position);
  }, [code, editor]);

  const focusEditor = () => {
    editorRef.current?.focus();
  };

  return (
    <div
      className={styles.liveEditor}
      data-playground-editor="stable"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          event.preventDefault();
          focusEditor();
        }
      }}
    >
      <Highlight code={code} theme={theme} language={language}>
        {({ className, tokens, getLineProps, getTokenProps, style }) => {
          const refinedTokens = refinePlaygroundTokens(tokens);

          return (
          <pre
            ref={editorRef}
            className={className}
            style={{
              margin: 0,
              outline: 'none',
              padding: 10,
              fontFamily: 'inherit',
              ...(typeof theme.plain === 'object' ? theme.plain : {}),
              ...style,
            }}
            spellCheck={false}
          >
            {refinedTokens.map((line, lineIndex) => (
              <span
                key={`line-${lineIndex}`}
                {...getLineProps({
                  line,
                  style: { display: 'block', minWidth: '100%', boxSizing: 'border-box' },
                })}
              >
                {line
                  .filter((token) => !token.empty)
                  .map((token, tokenIndex) => (
                    <span key={`token-${tokenIndex}`} {...getTokenProps({ token })} />
                  ))}
                {'\n'}
              </span>
            ))}
          </pre>
          );
        }}
      </Highlight>
    </div>
  );
}
