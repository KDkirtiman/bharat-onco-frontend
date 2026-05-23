import type { Meta, StoryObj } from '@storybook/react';

import { Icon, type IconName } from './Icon';
const NAMES: IconName[] = [
  'search',
  'user',
  'logout',
  'chevronLeft',
  'chevronRight',
  'panelLeftClose',
  'layoutDashboard',
  'calendar',
  'users',
  'heart',
];

const meta: Meta<typeof Icon> = {
  tags: ['autodocs'],
  title: 'Icons/Icon',
  component: Icon,
    parameters: {
    docs: {
      description: { component: "**Icon** is part of the Icons catalog. It is styled only with semantic `--ds-*` tokens so your product theme can override colors and typography without changing component code." },
      subtitle: "Icon component",
      guide: {
  "whenToUse": [
    "Use **Icon** in icons flows where this UI pattern is needed.",
    "Prefer composing with other design-system primitives rather than custom markup."
  ],
  "capabilities": [
    "Themeable via CSS variables (`ThemeProvider` or token overrides)",
    "`className` and standard HTML/React props passthrough where applicable",
    "Multiple stories demonstrating states and variants"
  ],
  "scenarios": [
    {
      "title": "Default",
      "description": "Baseline Icon configuration.",
      "story": "Default"
    }
  ]
},
    },
    liveCode: `render(<Icon name="user" size="lg" />);`,
        usageCode: `import { Icon } from '@/designSystem';

export function Example() {
  return (
    <Icon name="user" size="lg" />
  );
}`,
  },
  args: { name: 'search', size: 'md' },
  argTypes: {
    className: { description: "Additional CSS classes merged onto the root element." },
  },
};
export default meta;
type Story = StoryObj<typeof Icon>;

export const Default: Story = {};

export const Gallery: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center' }}>
      {NAMES.map((name) => (
        <div key={name} style={{ textAlign: 'center', width: 72 }}>
          <Icon name={name} size="lg" />
          <div style={{ fontSize: 11, marginTop: 6, color: 'var(--ds-color-muted)' }}>{name}</div>
        </div>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end' }}>
      <Icon name="user" size="sm" />
      <Icon name="user" size="md" />
      <Icon name="user" size="lg" />
    </div>
  ),
};
