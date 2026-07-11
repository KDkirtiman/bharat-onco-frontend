import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();

function walk(dir, cb) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (['node_modules', 'dist', 'datapoints', 'lib', 'assets'].includes(ent.name)) continue;
      walk(p, cb);
    } else if (/\.tsx$/.test(ent.name)) cb(p);
  }
}

const importFixes = [
  [/from '\.\.\/controls\/([A-Z][A-Za-z]+)'/g, "from '../../controls/$1'"],
  [/from '\.\.\/patterns\/billing\/([A-Z][A-Za-z]+)'/g, "from '../../patterns/billing/$1'"],
  [/from '\.\.\/patterns\/clinical\/([A-Z][A-Za-z]+)'/g, "from '../../patterns/clinical/$1'"],
  [/from '\.\.\/patterns\/scheduling\/([A-Z][A-Za-z]+)'/g, "from '../../patterns/scheduling/$1'"],
  [/from '\.\.\/\.\.\/patterns\/clinical\/([A-Z][A-Za-z]+)'/g, "from '../../patterns/clinical/$1'"],
  [/from '\.\.\/\.\.\/patterns\/billing\/([A-Z][A-Za-z]+)'/g, "from '../../patterns/billing/$1'"],
];

walk(path.join(ROOT, 'src/packages'), (file) => {
  let s = fs.readFileSync(file, 'utf8');
  let changed = false;

  const fixed = s.replace(/Class\(\s*,\s*/g, () => {
    changed = true;
    return 'Class(';
  });

  if (fixed !== s) {
    fs.writeFileSync(file, fixed);
    changed = true;
    s = fixed;
  }

  for (const [re, rep] of importFixes) {
    if (re.test(s)) {
      s = s.replace(re, rep);
      changed = true;
    }
  }

  if (changed) fs.writeFileSync(file, s);
});

// Fix Button properly
const buttonDir = path.join(ROOT, 'src/packages/bfd-core/src/components/controls/Button');
fs.writeFileSync(
  path.join(buttonDir, 'Button.styles.ts'),
  `import { cn } from '../../../lib/cn';

export const baseStyles =
  'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

export const variants = {
  primary:
    'bg-gradient-to-r from-primary to-primary/90 text-primary-foreground hover:from-primary/90 hover:to-primary/80 focus:ring-primary shadow-md hover:shadow-lg active:scale-[0.98] transition-all',
  secondary:
    'bg-gradient-to-r from-secondary to-secondary/90 text-secondary-foreground hover:from-secondary/90 hover:to-secondary/80 focus:ring-secondary shadow-md hover:shadow-lg active:scale-[0.98] transition-all',
  ghost:
    'bg-transparent hover:bg-gradient-to-r hover:from-brand-soft-soft hover:to-accent text-foreground focus:ring-primary transition-all',
  link:
    'bg-transparent text-primary hover:text-secondary underline-offset-4 hover:underline focus:ring-primary transition-all',
  outline:
    'bg-transparent border-2 border-primary/30 hover:bg-gradient-to-r hover:from-brand-soft-soft hover:to-accent hover:border-primary text-foreground focus:ring-primary transition-all',
  destructive:
    'bg-destructive text-white hover:bg-destructive/90 focus:ring-destructive shadow-md hover:shadow-lg active:scale-[0.98] transition-all',
} as const;

export const sizes = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-3',
  lg: 'px-6 py-4 text-lg',
} as const;

export type ButtonVariant = keyof typeof variants;
export type ButtonSize = keyof typeof sizes;

export const loaderIcon = 'mr-2 h-4 w-4 animate-spin';

export function buttonClass(
  variant: ButtonVariant,
  size: ButtonSize,
  className?: string,
) {
  return cn(baseStyles, variants[variant], sizes[size], className);
}
`,
);

fs.writeFileSync(
  path.join(buttonDir, 'Button.tsx'),
  `import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Loader2 } from 'bfd-icons';
import * as styles from './Button.styles';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: styles.ButtonVariant;
  size?: styles.ButtonSize;
  loading?: boolean;
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={styles.buttonClass(variant, size, className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className={styles.loaderIcon} />}
      {children}
    </button>
  );
}
`,
);

// Fix ResultState
const rsDir = path.join(ROOT, 'src/packages/bfd-core/src/components/feedback/ResultState');
fs.writeFileSync(
  path.join(rsDir, 'ResultState.tsx'),
  `import type { ReactNode } from 'react';
import { Button } from '../../controls/Button';
import * as styles from './ResultState.styles';

interface ResultStateProps {
  icon: ReactNode;
  title: string;
  summary?: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  iconClassName?: string;
  className?: string;
}

export function ResultState({
  icon,
  title,
  summary,
  actionLabel = 'Done',
  onAction,
  iconClassName,
  className,
}: ResultStateProps) {
  return (
    <div className={styles.style1Class(className)}>
      <div className={styles.style2Class(iconClassName)}>{icon}</div>
      <h3 className={styles.style3}>{title}</h3>
      {summary && <div className={styles.style4}>{summary}</div>}
      {onAction && (
        <Button className={styles.style5} size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
`,
);

// Fix ResultState.styles - style2Class should accept iconClassName
const rsStyles = fs.readFileSync(path.join(rsDir, 'ResultState.styles.ts'), 'utf8');
if (!rsStyles.includes('style2Class')) {
  // already has it
}

// Fix StatusBadge
const sbDir = path.join(ROOT, 'src/packages/bfd-core/src/components/feedback/StatusBadge');
fs.writeFileSync(
  path.join(sbDir, 'StatusBadge.styles.ts'),
  `import { cn } from '../../../lib/cn';
import { APPOINTMENT_STATUS_CONFIG } from '../../../datapoints/scheduling';

export function statusBadgeClass(status: string) {
  const cfg = APPOINTMENT_STATUS_CONFIG[status] ?? { label: status, className: 'bg-muted text-muted-foreground' };
  return { label: cfg.label, className: cn('text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap', cfg.className) };
}
`,
);
fs.writeFileSync(
  path.join(sbDir, 'StatusBadge.tsx'),
  `import * as styles from './StatusBadge.styles';

export function StatusBadge({ status }: { status: string }) {
  const { label, className } = styles.statusBadgeClass(status);
  return <span className={className}>{label}</span>;
}
`,
);

console.log('fixes applied');
