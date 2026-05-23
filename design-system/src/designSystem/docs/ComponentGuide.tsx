import type { ReactNode } from 'react';

import styles from './component-guide.module.css';

export type DocScenario = {
  title: string;
  description: string;
  /** Story export name in the same file, e.g. "Required" */
  story?: string;
};

export type ComponentGuideProps = {
  whenToUse?: string[];
  capabilities?: string[];
  scenarios?: DocScenario[];
  related?: { label: string; storyId?: string }[];
};

export function ComponentGuide({ whenToUse, capabilities, scenarios, related }: ComponentGuideProps) {
  return (
    <div className={styles.root}>
      {whenToUse && whenToUse.length > 0 ? (
        <section className={styles.section}>
          <h2 className={styles.heading}>When to use</h2>
          <ul className={styles.list}>
            {whenToUse.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {capabilities && capabilities.length > 0 ? (
        <section className={styles.section}>
          <h2 className={styles.heading}>Capabilities</h2>
          <ul className={styles.list}>
            {capabilities.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {scenarios && scenarios.length > 0 ? (
        <section className={styles.section}>
          <h2 className={styles.heading}>Common scenarios</h2>
          <div className={styles.scenarios}>
            {scenarios.map((s) => (
              <article key={s.title} className={styles.scenario}>
                <h4 className={styles.scenarioTitle}>{s.title}</h4>
                <p className={styles.scenarioDesc}>{s.description}</p>
                {s.story ? (
                  <p className={styles.storyLink}>
                    See story: <strong>{s.story}</strong> (sidebar below)
                  </p>
                ) : null}
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {related && related.length > 0 ? (
        <section className={styles.section}>
          <h2 className={styles.heading}>Related components</h2>
          <ul className={styles.list}>
            {related.map((r) => (
              <li key={r.label}>{r.label}</li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}

export type PropsReferenceIntroProps = {
  children?: ReactNode;
};

export function PropsReferenceIntro({ children }: PropsReferenceIntroProps) {
  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>Props reference</h2>
      <p className={styles.intro}>
        {children ??
          'All props below can be set in code, via Storybook Controls, or in the live editor. Required props are marked in the table.'}
      </p>
    </section>
  );
}
