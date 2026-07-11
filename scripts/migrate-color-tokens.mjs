import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve('src');

const REPLACEMENTS = [
  ['bg-green-100 text-green-700', 'bg-success-soft text-success-emphasis'],
  ['bg-green-50', 'bg-success-soft'],
  ['text-green-600', 'text-success-emphasis-mid'],
  ['text-green-700', 'text-success-emphasis'],
  ['bg-green-500 text-white', 'bg-success-solid text-white'],
  ['border-green-300', 'border-success-border'],
  ['bg-amber-100 text-amber-700', 'bg-warning-soft text-warning-emphasis'],
  ['bg-amber-50 text-amber-700', 'bg-warning-surface-soft text-warning-emphasis'],
  ['bg-amber-50', 'bg-warning-surface-soft'],
  ['text-amber-800', 'text-warning-emphasis'],
  ['text-amber-700', 'text-warning-emphasis'],
  ['text-amber-600', 'text-warning-emphasis-mid'],
  ['text-amber-500', 'text-warning-emphasis-mid'],
  ['border-amber-200', 'border-warning-surface-border'],
  ['border-amber-100', 'border-warning-border'],
  ['border-amber-300', 'border-warning-border'],
  ['hover:bg-amber-100', 'hover:bg-warning-soft'],
  ['hover:bg-amber-300', 'hover:bg-warning-border'],
  ['bg-amber-500', 'bg-warning-solid'],
  ['hover:bg-amber-600', 'hover:bg-warning-emphasis-mid'],
  ['bg-blue-100 text-blue-700', 'bg-info-soft text-info-emphasis'],
  ['bg-blue-50 border border-blue-200', 'bg-info-soft border border-info-border'],
  ['bg-blue-50', 'bg-info-soft'],
  ['text-blue-600', 'text-info-emphasis-mid'],
  ['border-blue-200', 'border-info-border'],
  ['border-blue-300', 'border-info-border'],
  ['bg-red-100 text-red-700', 'bg-error-soft text-error-emphasis'],
  ['bg-red-900 text-white border-red-900', 'bg-error-solid text-white border-error-solid'],
  ['bg-red-900 text-white', 'bg-error-solid text-white'],
  ['bg-teal-100 text-teal-700', 'bg-teal-soft text-teal-emphasis'],
  ['bg-teal-50 text-teal-700', 'bg-teal-surface-soft text-teal-emphasis'],
  ['bg-teal-50', 'bg-teal-surface-soft'],
  ['text-teal-600', 'text-teal-emphasis-mid'],
  ['border-teal-200', 'border-teal-surface-border'],
  ['bg-purple-100 text-purple-700', 'bg-purple-soft text-purple-emphasis'],
  ['bg-purple-50 border border-purple-200', 'bg-brand-soft-soft border border-brand-soft-border'],
  ['bg-purple-50', 'bg-brand-soft-soft'],
  ['text-purple-600', 'text-purple-emphasis-mid'],
  ['text-purple-700', 'text-purple-emphasis'],
  ['border-purple-700', 'border-purple-emphasis'],
  ['border-purple-200', 'border-brand-soft-border'],
  ['bg-violet-100 text-violet-700', 'bg-violet-soft text-violet-emphasis'],
  ['bg-indigo-100 text-indigo-700', 'bg-indigo-soft text-indigo-emphasis'],
  ['border-indigo-500 bg-indigo-50 text-indigo-700', 'border-indigo-emphasis-mid bg-indigo-soft text-indigo-emphasis'],
  ['border-indigo-500', 'border-indigo-emphasis-mid'],
  ['bg-indigo-50', 'bg-indigo-soft'],
  ['hover:border-indigo-300 hover:bg-indigo-50/50', 'hover:border-indigo-border hover:bg-indigo-soft/50'],
  ['bg-indigo-600 text-white rounded-lg hover:bg-indigo-700', 'bg-indigo-solid text-white rounded-lg hover:bg-indigo-solid-hover'],
  ['bg-indigo-600', 'bg-indigo-solid'],
  ['hover:bg-indigo-700', 'hover:bg-indigo-solid-hover'],
  ['text-indigo-600', 'text-indigo-emphasis-mid'],
  ['bg-sky-100 text-sky-700', 'bg-sky-soft text-sky-emphasis'],
  ['bg-orange-100 text-orange-700', 'bg-orange-soft text-orange-emphasis'],
  ['bg-orange-50 text-orange-700 border-orange-200', 'bg-orange-surface-soft text-orange-emphasis border-orange-surface-border'],
  ['bg-orange-100 text-orange-700 border-orange-300', 'bg-orange-soft text-orange-emphasis border-orange-border'],
  ['bg-orange-50', 'bg-orange-surface-soft'],
  ['border-orange-200', 'border-orange-surface-border'],
  ['bg-gray-100 text-gray-500', 'bg-neutral-soft text-neutral-emphasis'],
  ['bg-gray-100 text-gray-700', 'bg-neutral-soft text-neutral-text'],
  ['bg-gray-50', 'bg-neutral-soft'],
  ['text-gray-900', 'text-print-text'],
  ['text-gray-500', 'text-print-muted'],
  ['text-gray-400', 'text-print-label'],
  ['text-gray-700', 'text-neutral-text'],
  ['border-gray-200', 'border-print-border'],
  ['border-gray-100', 'border-print-border-light'],
  ['border-gray-700', 'border-print-text'],
  ['bg-slate-100 text-slate-700', 'bg-slate-soft text-slate-emphasis'],
  ['bg-cyan-100 text-cyan-700', 'bg-cyan-soft text-cyan-emphasis'],
  ['bg-rose-100 text-rose-700', 'bg-rose-soft text-rose-emphasis'],
  ['text-[9px]', 'text-micro'],
  ['text-[10px]', 'text-caption'],
  ['text-[11px]', 'text-caption-sm'],
  ['hover:from-purple-50 hover:to-pink-50', 'hover:from-brand-soft-soft hover:to-accent'],
  ['border-l-purple-500', 'border-l-purple-accent'],
  ['border-green-200', 'border-success-border'],
  ['border-red-200', 'border-error-border'],
  ['bg-red-50 text-red-700', 'bg-error-soft text-error-emphasis'],
  ['bg-red-500 text-white', 'bg-error-solid-mid text-white'],
  ['border-orange-300', 'border-orange-border'],
  ['bg-warning-surface-soft0', 'bg-warning-solid'],
  ['bg-amber-200', 'bg-warning-border'],
  ['text-amber-900', 'text-warning-emphasis'],
  ['border-amber-400', 'border-warning-solid'],
  ['focus:ring-amber-300 focus:border-amber-400', 'focus:ring-warning-border focus:border-warning-solid'],
  ['hover:bg-amber-200', 'hover:bg-warning-border'],
  ['hover:bg-teal-200', 'hover:bg-teal-border'],
  ['border-amber-500', 'border-warning-solid'],
  ['bg-sky-50 border border-sky-200', 'bg-sky-soft border border-sky-border'],
  ['text-sky-700', 'text-sky-emphasis'],
  ['text-sky-600', 'text-sky-emphasis-mid'],
  ['border-sky-200', 'border-sky-border'],
  ['bg-violet-50 border border-violet-200', 'bg-violet-soft border border-violet-border'],
  ['text-violet-700', 'text-violet-emphasis'],
  ['border-green-400', 'border-success-emphasis-mid'],
  ['border-blue-400', 'border-info-emphasis-mid'],
  ['text-blue-700', 'text-info-emphasis'],
  ['hover:border-indigo-300', 'hover:border-indigo-border'],
  ['bg-pink-100 text-pink-700', 'bg-accent text-secondary'],
  ['bg-lime-100 text-lime-700', 'bg-lime-soft text-lime-emphasis'],
  ['text-red-600', 'text-error-emphasis-mid'],
];

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'tokens') continue;
      walk(full, files);
    } else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) {
      if (entry.name.endsWith('.stories.tsx')) continue;
      files.push(full);
    }
  }
  return files;
}

let changed = 0;
for (const file of walk(ROOT)) {
  let content = fs.readFileSync(file, 'utf8');
  const original = content;
  for (const [from, to] of REPLACEMENTS) {
    content = content.split(from).join(to);
  }
  if (content !== original) {
    fs.writeFileSync(file, content);
    changed++;
    console.log('updated:', path.relative(process.cwd(), file));
  }
}
console.log(`\n${changed} files updated`);
