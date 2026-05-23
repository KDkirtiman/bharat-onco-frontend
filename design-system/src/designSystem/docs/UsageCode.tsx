import { useCallback, useState } from 'react';

import styles from './code-block.module.css';

export type UsageCodeProps = {
  code: string;
  title?: string;
  hint?: string;
};

export function UsageCode({
  code,
  title = 'Copy into your app',
  hint = 'Adjust the import path to match your project (e.g. @/designSystem or ./designSystem). Wrap with ThemeProvider if needed.',
}: UsageCodeProps) {
  const [copied, setCopied] = useState(false);

  const onCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }, [code]);

  return (
    <section className={styles.block} aria-label={title}>
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        <button type="button" className={styles.copyButton} onClick={onCopy}>
          {copied ? 'Copied' : 'Copy code'}
        </button>
      </div>
      {hint ? <p className={styles.hint}>{hint}</p> : null}
      <pre className={styles.pre}>
        <code className={styles.code}>{code}</code>
      </pre>
    </section>
  );
}
