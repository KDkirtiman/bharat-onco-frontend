import { cn } from 'bfd-core';

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
