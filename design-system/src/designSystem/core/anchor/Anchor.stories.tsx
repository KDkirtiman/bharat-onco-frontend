import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import { Anchor } from './Anchor';
import { Title } from '../title/Title';
const meta: Meta<typeof Anchor> = {
  tags: ['autodocs'],
  title: 'Core/Anchor',
  component: Anchor,
    parameters: {
    docs: {
      description: { component: "**Anchor** is part of the Core catalog. It is styled only with semantic `--ds-*` tokens so your product theme can override colors and typography without changing component code." },
      subtitle: "Anchor component",
      guide: {
  "whenToUse": [
    "Use **Anchor** in core flows where this UI pattern is needed.",
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
      "description": "Baseline Anchor configuration.",
      "story": "Default"
    }
  ]
},
    },
    liveCode: `render(
  <Anchor items={[
    { id: 'a', label: 'Overview' },
    { id: 'b', label: 'Details' },
  ]} activeId="a" />
);`,
        usageCode: `import { Anchor } from '@/designSystem';

export function Example() {
  return (
    <Anchor items={[
        { id: 'a', label: 'Overview' },
        { id: 'b', label: 'Details' },
      ]} activeId="a" />
  );
}`,
  },
  argTypes: {
    className: { description: "Additional CSS classes merged onto the root element." },
  },
};
export default meta;
type Story = StoryObj<typeof Anchor>;

const items = [
  { id: 'summary', label: 'Summary', href: '#summary' },
  { id: 'treatment', label: 'Treatment', href: '#treatment' },
  { id: 'followup', label: 'Follow-up', href: '#followup' },
];

export const Default: Story = {
  render: function AnchorDemo() {
    const [activeId, setActiveId] = useState('summary');

    return (
      <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: 24 }}>
        <Anchor items={items} activeId={activeId} offset={16} onSelect={setActiveId} />
        <div style={{ display: 'grid', gap: 48 }}>
          <section id="summary">
            <Title level={3}>Summary</Title>
            <p style={{ color: 'var(--ds-color-muted)' }}>Patient demographics and diagnosis overview.</p>
          </section>
          <section id="treatment">
            <Title level={3}>Treatment</Title>
            <p style={{ color: 'var(--ds-color-muted)' }}>Current chemotherapy regimen and cycle schedule.</p>
          </section>
          <section id="followup">
            <Title level={3}>Follow-up</Title>
            <p style={{ color: 'var(--ds-color-muted)' }}>Next visit and monitoring plan.</p>
          </section>
        </div>
      </div>
    );
  },
};
