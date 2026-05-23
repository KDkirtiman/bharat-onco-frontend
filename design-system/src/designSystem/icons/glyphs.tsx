import type { SVGProps } from 'react';

export type GlyphProps = SVGProps<SVGSVGElement> & { title?: string };

const base = (p: GlyphProps) => {
  const { title, children, ...rest } = p;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
      {...rest}
    >
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  );
};

export function SearchIcon(p: GlyphProps) {
  return base({
    ...p,
    children: (
      <>
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </>
    ),
  });
}

export function UserIcon(p: GlyphProps) {
  return base({
    ...p,
    children: (
      <>
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </>
    ),
  });
}

export function LogoutIcon(p: GlyphProps) {
  return base({
    ...p,
    children: (
      <>
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" x2="9" y1="12" y2="12" />
      </>
    ),
  });
}

export function ChevronLeftIcon(p: GlyphProps) {
  return base({ ...p, children: <path d="m15 18-6-6 6-6" /> });
}

export function ChevronRightIcon(p: GlyphProps) {
  return base({ ...p, children: <path d="m9 18 6-6-6-6" /> });
}

export function PanelLeftCloseIcon(p: GlyphProps) {
  return base({
    ...p,
    children: (
      <>
        <rect width="18" height="18" x="3" y="3" rx="2" />
        <path d="M9 3v18" />
        <path d="m16 12-4-4" />
        <path d="m16 12-4 4" />
      </>
    ),
  });
}

export function LayoutDashboardIcon(p: GlyphProps) {
  return base({
    ...p,
    children: (
      <>
        <rect width="7" height="9" x="3" y="3" rx="1" />
        <rect width="7" height="5" x="14" y="3" rx="1" />
        <rect width="7" height="9" x="14" y="12" rx="1" />
        <rect width="7" height="5" x="3" y="16" rx="1" />
      </>
    ),
  });
}

export function CalendarIcon(p: GlyphProps) {
  return base({
    ...p,
    children: (
      <>
        <path d="M8 2v4" />
        <path d="M16 2v4" />
        <rect width="18" height="18" x="3" y="4" rx="2" />
        <path d="M3 10h18" />
      </>
    ),
  });
}

export function UsersIcon(p: GlyphProps) {
  return base({
    ...p,
    children: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),
  });
}

export function HeartIcon(p: GlyphProps) {
  return base({
    ...p,
    children: (
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    ),
  });
}

export function ChevronDownIcon(p: GlyphProps) {
  return base({ ...p, children: <path d="m6 9 6 6 6-6" /> });
}

export function MoreVerticalIcon(p: GlyphProps) {
  return base({
    ...p,
    children: (
      <>
        <circle cx="12" cy="5" r="1" fill="currentColor" stroke="none" />
        <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
        <circle cx="12" cy="19" r="1" fill="currentColor" stroke="none" />
      </>
    ),
  });
}
