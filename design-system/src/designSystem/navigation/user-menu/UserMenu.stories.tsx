import type { Meta, StoryObj } from '@storybook/react';
import { action } from 'storybook/actions';

import { UserMenu } from './UserMenu';
const items = [
  { id: 'profile', label: 'Profile' },
  { id: 'settings', label: 'Settings' },
  { id: 'logout', label: 'Sign out', destructive: true },
];

const meta: Meta<typeof UserMenu> = {
  tags: ['autodocs'],
  title: 'Navigation/UserMenu',
  component: UserMenu,
    parameters: {
    docs: {
      description: { component: "**UserMenu** is part of the Navigation catalog. It is styled only with semantic `--ds-*` tokens so your product theme can override colors and typography without changing component code." },
      subtitle: "UserMenu component",
      guide: {
  "whenToUse": [
    "Use **UserMenu** in navigation flows where this UI pattern is needed.",
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
      "description": "Baseline UserMenu configuration.",
      "story": "Default"
    }
  ]
},
    },
    liveCode: `render(<UserMenu name="Dr. Smith" items={[{ label: 'Profile' }, { label: 'Sign out' }]} />);`,
        usageCode: `import { UserMenu } from '@/designSystem';

export function Example() {
  return (
    <UserMenu name="Dr. Smith" items={[{ label: 'Profile' }, { label: 'Sign out' }]} />
  );
}`,
  },
  args: { name: 'Dr. Patel', email: 'patel@clinic.in', items, onSelect: action('onSelect') },
  argTypes: {
    className: { description: "Additional CSS classes merged onto the root element." },
  },
};
export default meta;
type Story = StoryObj<typeof UserMenu>;

export const Default: Story = {};
