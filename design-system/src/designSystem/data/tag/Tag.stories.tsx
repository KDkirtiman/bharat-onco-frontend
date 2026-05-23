import type { Meta, StoryObj } from '@storybook/react';
import { action } from 'storybook/actions';

import { Tag } from './Tag';
const meta: Meta<typeof Tag> = {
  tags: ['autodocs'],
  title: 'Data/Tag',
  component: Tag,
    parameters: {
    docs: {
      description: { component: "**Tag** is part of the Data catalog. It is styled only with semantic `--ds-*` tokens so your product theme can override colors and typography without changing component code." },
      subtitle: "Tag component",
      guide: {
  "whenToUse": [
    "Use **Tag** in data flows where this UI pattern is needed.",
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
      "description": "Baseline Tag configuration.",
      "story": "Default"
    }
  ]
},
    },
    liveCode: `render(<Tag removable onRemove={() => {}}>Oncology</Tag>);`,
        usageCode: `import { Tag } from '@/designSystem';

export function Example() {
  return (
    <Tag removable onRemove={() => {}}>Oncology</Tag>
  );
}`,
  },
  argTypes: {
    className: { description: "Additional CSS classes merged onto the root element." },
  },
};
export default meta;
type Story = StoryObj<typeof Tag>;

export const Default: Story = {
  args: { children: 'Medical Oncology' },
};

export const Removable: Story = {
  args: { children: 'Radiation', removable: true, onRemove: action('onRemove') },
};

export const Tones: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <Tag tone="neutral">Neutral</Tag>
      <Tag tone="success">Success</Tag>
      <Tag tone="warning">Warning</Tag>
      <Tag tone="danger">Danger</Tag>
      <Tag tone="info">Info</Tag>
    </div>
  ),
};
