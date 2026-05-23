import type { Meta, StoryObj } from '@storybook/react';

import { Avatar } from './Avatar';
const meta: Meta<typeof Avatar> = {
  tags: ['autodocs'],
  title: 'Core/Avatar',
  component: Avatar,
    parameters: {
    docs: {
      description: { component: "**Avatar** is part of the Core catalog. It is styled only with semantic `--ds-*` tokens so your product theme can override colors and typography without changing component code." },
      subtitle: "Avatar component",
      guide: {
  "whenToUse": [
    "Use **Avatar** in core flows where this UI pattern is needed.",
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
      "description": "Baseline Avatar configuration.",
      "story": "Default"
    }
  ]
},
    },
    liveCode: `render(<Avatar alt="User" fallback="AB" size="lg" />);`,
        usageCode: `import { Avatar } from '@/designSystem';

export function Example() {
  return (
    <Avatar alt="User" fallback="AB" size="lg" />
  );
}`,
  },
  args: { size: 'md', alt: 'User' },
  argTypes: {
    className: { description: "Additional CSS classes merged onto the root element." },
  },
};
export default meta;
type Story = StoryObj<typeof Avatar>;

export const Placeholder: Story = {};

export const WithImage: Story = {
  args: {
    src: 'https://api.dicebear.com/7.x/avataaars/svg?seed=patient',
    alt: 'Patient',
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <Avatar size="sm" alt="S" />
      <Avatar size="md" alt="M" />
      <Avatar size="lg" alt="L" />
    </div>
  ),
};

export const NameCellPattern: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <Avatar size="sm" alt="" />
      <span style={{ fontWeight: 600 }}>Rajesh Kumar</span>
    </div>
  ),
};
