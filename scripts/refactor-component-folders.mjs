/**
 * Moves flat Component.tsx files into Component/ folders with Component.styles.ts.
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();

function walkComponents(dir, results = []) {
  if (!fs.existsSync(dir)) return results;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (['node_modules', 'dist', 'datapoints', 'lib', 'assets', 'stories'].includes(ent.name)) continue;
      const innerTsx = path.join(p, `${ent.name}.tsx`);
      if (fs.existsSync(innerTsx)) continue;
      walkComponents(p, results);
    } else if (/^[A-Z][A-Za-z0-9]+\.tsx$/.test(ent.name)) {
      results.push(p);
    }
  }
  return results;
}

function cnPath(fromDir) {
  const coreLib = path.join(ROOT, 'src/packages/bfd-core/src/lib/cn.ts');
  const rel = path.relative(fromDir, coreLib).replace(/\\/g, '/').replace(/\.ts$/, '');
  return rel.startsWith('.') ? rel : '../../../lib/cn';
}

function refactorCallout() {
  const dir = path.join(ROOT, 'src/packages/bfd-core/src/components/feedback');
  const target = path.join(dir, 'Callout');
  fs.mkdirSync(target, { recursive: true });

  fs.writeFileSync(
    path.join(target, 'Callout.styles.ts'),
    `import { cn } from '../../../lib/cn';
import { callout } from 'bfd-themes';

export type CalloutVariant = keyof typeof callout;

export function calloutRoot(variant: CalloutVariant, className?: string) {
  return cn('border rounded-lg px-4 py-3 flex gap-3', callout[variant].container, className);
}

export function calloutIcon(variant: CalloutVariant) {
  return cn('shrink-0 mt-0.5', callout[variant].icon);
}

export const calloutContent = 'min-w-0';

export function calloutTitle(variant: CalloutVariant) {
  return cn('text-sm font-semibold', callout[variant].title);
}

export function calloutBody(variant: CalloutVariant) {
  return cn('text-sm mt-0.5', callout[variant].body);
}

export function calloutSubtitle(variant: CalloutVariant) {
  return cn('text-xs mt-0.5', callout[variant].sub);
}
`,
  );

  fs.writeFileSync(
    path.join(target, 'Callout.tsx'),
    `import type { ReactNode } from 'react';
import type { CalloutVariant } from './Callout.styles';
import * as styles from './Callout.styles';

export type { CalloutVariant };

interface CalloutProps {
  variant?: CalloutVariant;
  icon?: ReactNode;
  title?: ReactNode;
  children?: ReactNode;
  subtitle?: ReactNode;
  className?: string;
}

export function Callout({
  variant = 'warning',
  icon,
  title,
  children,
  subtitle,
  className,
}: CalloutProps) {
  return (
    <div className={styles.calloutRoot(variant, className)}>
      {icon && <span className={styles.calloutIcon(variant)}>{icon}</span>}
      <div className={styles.calloutContent}>
        {title && <p className={styles.calloutTitle(variant)}>{title}</p>}
        {children && <div className={styles.calloutBody(variant)}>{children}</div>}
        {subtitle && <p className={styles.calloutSubtitle(variant)}>{subtitle}</p>}
      </div>
    </div>
  );
}
`,
  );

  const storiesSrc = path.join(dir, 'Callout.stories.tsx');
  if (fs.existsSync(storiesSrc)) {
    fs.writeFileSync(path.join(target, 'Callout.stories.tsx'), fs.readFileSync(storiesSrc, 'utf8'));
    fs.unlinkSync(storiesSrc);
  }

  fs.writeFileSync(
    path.join(target, 'index.ts'),
    `export { Callout } from './Callout';\nexport type { CalloutVariant } from './Callout';\n`,
  );

  const flat = path.join(dir, 'Callout.tsx');
  if (fs.existsSync(flat)) fs.unlinkSync(flat);
  console.log('refactored: Callout');
}

function extractTopStyleBlocks(source) {
  const blocks = [];
  const lines = source.split('\n');
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const m = line.match(/^(export\s+)?const\s+([A-Za-z0-9_]+)\s*=\s*(.*)$/);
    if (m && !line.includes('function') && !line.includes('=>')) {
      const name = m[2];
      let expr = m[3];
      let j = i;
      while (!expr.trim().endsWith(';') && j < lines.length - 1) {
        j++;
        expr += '\n' + lines[j];
      }
      const isStyle =
        /baseStyles|variants|sizes|styles|Style|className|Variant|Size|config/i.test(name) ||
        /'[^']*(?:bg-|text-|flex|border|rounded|px-|py-|hover:|focus:|from-|shadow|transition)[^']*'/.test(expr);
      if (isStyle && expr.includes("'")) {
        blocks.push({ name, expr: expr.trim().replace(/;$/, ''), start: i, end: j, exported: !!m[1] });
        i = j + 1;
        continue;
      }
    }
    i++;
  }
  return blocks;
}

function refactorFile(tsxPath, options = {}) {
  const dir = path.dirname(tsxPath);
  const base = path.basename(tsxPath, '.tsx');
  const targetDir = path.join(dir, base);
  if (fs.existsSync(targetDir)) {
    console.log(`skip: ${path.relative(ROOT, targetDir)}`);
    return;
  }

  let source = fs.readFileSync(tsxPath, 'utf8');
  const storiesPath = path.join(dir, `${base}.stories.tsx`);
  const blocks = extractTopStyleBlocks(source);

  const libImport = options.useBfdCoreCn
    ? "import { cn } from 'bfd-core';\n"
    : `import { cn } from '${cnPath(targetDir)}';\n`;

  let stylesContent = libImport;
  if (source.includes('bfd-themes')) stylesContent += "import { callout, badge } from 'bfd-themes';\n";
  if (source.includes('APPOINTMENT_STATUS_CONFIG')) {
    stylesContent += options.useBfdCoreCn
      ? "import { APPOINTMENT_STATUS_CONFIG } from 'bfd-core';\n"
      : "import { APPOINTMENT_STATUS_CONFIG } from '../../../datapoints/scheduling';\n";
  }
  stylesContent += '\n';

  for (const block of blocks) {
    stylesContent += `export const ${block.name} = ${block.expr};\n\n`;
    for (let l = block.end; l >= block.start; l--) {
      source = source.split('\n').filter((_, idx) => idx !== block.start).join('\n');
    }
  }

  const cnLiterals = [];
  const cnRe = /className=\{cn\(\s*'([^']+)'/g;
  let m;
  while ((m = cnRe.exec(source)) !== null) cnLiterals.push(m[1]);
  const cnRe2 = /className="([^"]+)"/g;
  while ((m = cnRe2.exec(source)) !== null) cnLiterals.push(m[1]);

  const literalNames = {};
  [...new Set(cnLiterals)].forEach((lit, idx) => {
    const key = `style${idx + 1}`;
    literalNames[lit] = key;
    stylesContent += `export const ${key} = '${lit}';\n`;
    stylesContent += `export function ${key}Class(...extra: (string | undefined | false)[]) {\n  return cn(${key}, ...extra);\n}\n\n`;
  });

  source = source.replace(/import \{ cn \} from '[^']+';\n?/g, '');
  source = source.replace(/import \{ cn \} from "\.\.\/lib\/cn";\n?/g, '');
  if (!source.includes(`./${base}.styles`)) {
    source = `import * as styles from './${base}.styles';\n` + source.trimStart();
  }

  for (const block of blocks) {
    source = source.replace(new RegExp(`\\b${block.name}\\b`, 'g'), `styles.${block.name}`);
  }

  for (const [lit, key] of Object.entries(literalNames)) {
    source = source.replaceAll(`cn('${lit}'`, `styles.${key}Class(`);
    source = source.replaceAll(`className="${lit}"`, `className={styles.${key}}`);
  }

  // Fix double styles.styles
  source = source.replace(/styles\.styles\./g, 'styles.');

  fs.mkdirSync(targetDir, { recursive: true });
  fs.writeFileSync(path.join(targetDir, `${base}.styles.ts`), stylesContent);
  fs.writeFileSync(path.join(targetDir, `${base}.tsx`), source.trim() + '\n');

  if (fs.existsSync(storiesPath)) {
    let stories = fs.readFileSync(storiesPath, 'utf8');
    fs.writeFileSync(path.join(targetDir, `${base}.stories.tsx`), stories);
    fs.unlinkSync(storiesPath);
  }

  fs.writeFileSync(path.join(targetDir, 'index.ts'), `export { ${base} } from './${base}';\n`);
  fs.unlinkSync(tsxPath);
  console.log(`refactored: ${path.relative(ROOT, targetDir)}`);
}

function refactorTable() {
  const target = path.join(ROOT, 'src/packages/bfd-tables/src/Table');
  const tableFile = path.join(ROOT, 'src/packages/bfd-tables/src/Table.tsx');
  if (!fs.existsSync(tableFile)) return;

  fs.mkdirSync(target, { recursive: true });
  fs.writeFileSync(
    path.join(target, 'Table.styles.ts'),
    `import { cn } from 'bfd-core';

export function tableClass(className?: string) {
  return cn('w-full text-sm border-collapse', className);
}

export function tableHeadClass(className?: string) {
  return cn('bg-neutral-soft', className);
}

export function tableRowClass(className?: string) {
  return cn('border-b border-border hover:bg-muted/30', className);
}

export function thClass(className?: string) {
  return cn('text-left text-caption font-semibold text-muted-foreground uppercase tracking-wide px-4 py-2', className);
}

export function tdClass(className?: string) {
  return cn('px-4 py-2.5 text-foreground', className);
}
`,
  );
  fs.writeFileSync(
    path.join(target, 'Table.tsx'),
    `import type { HTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from 'react';
import * as styles from './Table.styles';

export function Table({ className, ...rest }: HTMLAttributes<HTMLTableElement>) {
  return <table {...rest} className={styles.tableClass(className)} />;
}

export function TableHead({ className, ...rest }: HTMLAttributes<HTMLTableSectionElement>) {
  return <thead {...rest} className={styles.tableHeadClass(className)} />;
}

export function TableBody(props: HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody {...props} />;
}

export function TableRow({ className, ...rest }: HTMLAttributes<HTMLTableRowElement>) {
  return <tr {...rest} className={styles.tableRowClass(className)} />;
}

export function Th({ className, ...rest }: ThHTMLAttributes<HTMLTableCellElement>) {
  return <th {...rest} className={styles.thClass(className)} />;
}

export function Td({ className, ...rest }: TdHTMLAttributes<HTMLTableCellElement>) {
  return <td {...rest} className={styles.tdClass(className)} />;
}
`,
  );
  fs.writeFileSync(path.join(target, 'index.ts'), `export { Table, TableHead, TableBody, TableRow, Th, Td } from './Table';\n`);
  fs.unlinkSync(tableFile);
  fs.writeFileSync(path.join(ROOT, 'src/packages/bfd-tables/src/index.ts'), `export * from './Table';\n`);
  console.log('refactored: bfd-tables/Table');
}

function updateBarrels() {
  const coreRoot = path.join(ROOT, 'src/packages/bfd-core/src/components');
  fs.writeFileSync(
    path.join(coreRoot, 'feedback/index.ts'),
    `export { StatusBadge } from './StatusBadge';
export { Callout } from './Callout';
export type { CalloutVariant } from './Callout';
export { EmptyState } from './EmptyState';
export { ResultState } from './ResultState';
`,
  );
  fs.writeFileSync(
    path.join(coreRoot, 'controls/index.ts'),
    `export { Button } from './Button';
export { IconButton } from './IconButton';
export { Input } from './Input';
export { TextField } from './TextField';
export { Textarea } from './Textarea';
export { Select } from './Select';
export type { SelectOption } from './Select';
export { Checkbox } from './Checkbox';
export { DatePicker } from './DatePicker';
export { FormField } from './FormField';
export { SearchCombobox } from './SearchCombobox';
export type { SearchComboboxItem } from './SearchCombobox';
export { FilterToggle } from './FilterToggle';
export type { FilterToggleOption } from './FilterToggle';
`,
  );
  fs.writeFileSync(
    path.join(coreRoot, 'layout/index.ts'),
    `export { AppLayout } from './AppLayout';
export { Header } from './Header';
export { Modal } from './Modal';
export { Sidebar, defaultNavByRole } from './Sidebar';
export type { SidebarNavItem } from './Sidebar';
export type { ModalSize } from './Modal';
`,
  );
  fs.writeFileSync(
    path.join(coreRoot, 'data-display/index.ts'),
    `export { Avatar } from './Avatar';
export { KPICard } from './KPICard';
`,
  );
}

refactorCallout();

const coreRoot = path.join(ROOT, 'src/packages/bfd-core/src/components');
for (const file of walkComponents(coreRoot)) {
  if (path.basename(file, '.tsx') === 'Callout') continue;
  refactorFile(file);
}

refactorTable();

const patternsRoot = path.join(ROOT, 'src/packages/bfd-patterns/src');
for (const file of walkComponents(patternsRoot)) {
  refactorFile(file, { useBfdCoreCn: true });
}

updateBarrels();
console.log('done');
