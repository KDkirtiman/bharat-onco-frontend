import type { Meta, StoryObj } from '@storybook/react';
import { action } from 'storybook/actions';

import { Icon } from '../../icons/Icon';

import { Button2 } from './Button2';
const meta: Meta<typeof Button2> = {
  tags: ['autodocs'],
  title: 'Core/Button2',
  component: Button2,
    parameters: {
    docs: {
      description: { component: "**Button2** is part of the Core catalog. It is styled only with semantic `--ds-*` tokens so your product theme can override colors and typography without changing component code." },
      subtitle: "Button2 component",
      guide: {
  "whenToUse": [
    "Use **Button2** in core flows where this UI pattern is needed.",
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
      "description": "Baseline Button2 configuration.",
      "story": "Default"
    }
  ]
},
    },
    liveCode: `render(<Button2 aria-label="Settings" icon={<span>⚙</span>} />);`,
        usageCode: `import { Button2 } from '@/designSystem';

export function Example() {
  return (
    <Button2 aria-label="Settings" icon={<span>⚙</span>} />
  );
}`,
  },
  args: {
    label: 'Search',
    icon: <Icon name="search" size="md" />,
  },
  argTypes: {
    className: { description: "Additional CSS classes merged onto the root element." },
  },
};
export default meta;
type Story = StoryObj<typeof Button2>;

export const Default: Story = {
  args: {
    density: "comfortable"
  }
};

export const Primary: Story = {
  args: { variant: 'primary' },
};

export const Densities: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Button2 {...args} density="compact" label="Compact" />
      <Button2 {...args} density="default" label="Default" />
      <Button2 {...args} density="comfortable" label="Comfortable" />
    </div>
  ),
};

export const Split: Story = {
  args: {
    variant: 'primary',
    label: 'Add patient',
    icon: <Icon name="user" size="md" />,
    menuItems: [
      { id: 'import', label: 'Import CSV' },
      { id: 'manual', label: 'Manual entry' },
    ],
    onMenuSelect: action('menu-select'),
    onClick: action('primary-click'),
  },
};
