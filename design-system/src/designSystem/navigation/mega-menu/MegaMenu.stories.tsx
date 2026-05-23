import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '../../core/button/Button';
import { MegaMenu } from './MegaMenu';
const columns = [
  {
    id: 'services',
    title: 'Services',
    links: [
      { id: '1', label: 'Medical Oncology' },
      { id: '2', label: 'Radiation Therapy' },
      { id: '3', label: 'Surgical Oncology' },
    ],
  },
  {
    id: 'resources',
    title: 'Resources',
    links: [
      { id: '4', label: 'Patient guides' },
      { id: '5', label: 'Support groups' },
    ],
  },
];

const meta: Meta<typeof MegaMenu> = {
  tags: ['autodocs'],
  title: 'Navigation/MegaMenu',
  component: MegaMenu,
    parameters: {
    docs: {
      description: { component: "**MegaMenu** is part of the Services catalog. It is styled only with semantic `--ds-*` tokens so your product theme can override colors and typography without changing component code." },
      subtitle: "MegaMenu component",
      guide: {
  "whenToUse": [
    "Use **MegaMenu** in services flows where this UI pattern is needed.",
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
      "description": "Baseline MegaMenu configuration.",
      "story": "Default"
    }
  ]
},
    },
    liveCode: `render(<MegaMenu trigger={<Button variant="ghost">Products</Button>} columns={[]} />);`,
        usageCode: `import { Button, MegaMenu } from '@/designSystem';

export function Example() {
  return (
    <MegaMenu trigger={<Button variant="ghost">Products</Button>} columns={[]} />
  );
}`,
  },
  argTypes: {
    className: { description: "Additional CSS classes merged onto the root element." },
  },
};
export default meta;
type Story = StoryObj<typeof MegaMenu>;

export const Default: Story = {
  args: {
    columns,
    trigger: <Button variant="secondary">Browse</Button>,
  },
};
