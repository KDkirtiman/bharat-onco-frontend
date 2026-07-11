import { cn } from '../../../lib/cn';
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
