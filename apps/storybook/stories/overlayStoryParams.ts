import type { ArgTypes, Parameters } from '@storybook/react';

/** Full-viewport layout + tall docs iframe for fixed-position Modal overlays. */
export const overlayStoryParameters: Parameters = {
  layout: 'fullscreen',
  docs: {
    story: {
      inline: false,
      height: '640px',
    },
  },
};

type ArgCategory = 'Data' | 'Events';

/** Hide a prop from Controls (keeps it in the props table). */
export function hideArg(name: string, category: ArgCategory = 'Data') {
  return { [name]: { control: false, table: { category } } } satisfies ArgTypes;
}

/** Hide multiple props from Controls. */
export function hideArgs(names: string[], category: ArgCategory = 'Data'): ArgTypes {
  return Object.fromEntries(
    names.map((name) => [name, { control: false, table: { category } }]),
  );
}
