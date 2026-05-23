import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from 'storybook/test';
import { useState } from 'react';

import { Accordion } from './Accordion';
const meta: Meta<typeof Accordion> = {
  tags: ['autodocs'],
  title: 'Core/Accordion',
  component: Accordion,
    parameters: {
    docs: {
      description: { component: "**Accordion** is part of the Core catalog. It is styled only with semantic `--ds-*` tokens so your product theme can override colors and typography without changing component code." },
      subtitle: "Accordion component",
      guide: {
  "whenToUse": [
    "Use **Accordion** in core flows where this UI pattern is needed.",
    "Prefer composing with other design-system primitives rather than custom markup."
  ],
  "capabilities": [
    "Themeable via CSS variables (`ThemeProvider` or token overrides)",
    "`className` and standard HTML/React props passthrough where applicable",
    "Multiple stories demonstrating states and variants"
  ],
  "scenarios": [
    {
      "title": "Single (one open)",
      "description": "Only one section expanded at a time.",
      "story": "Single"
    },
    {
      "title": "Multiple",
      "description": "Several sections can stay open.",
      "story": "Multiple"
    }
  ]
},
    },
    liveCode: `render(
  <Accordion type="single" defaultValue="overview">
    <Accordion.Item value="overview">
      <Accordion.Trigger>Overview</Accordion.Trigger>
      <Accordion.Panel>High-level summary of the case.</Accordion.Panel>
    </Accordion.Item>
    <Accordion.Item value="labs">
      <Accordion.Trigger>Lab results</Accordion.Trigger>
      <Accordion.Panel>Recent CBC and metabolic panel.</Accordion.Panel>
    </Accordion.Item>
  </Accordion>
);`,
        usageCode: `import { Accordion } from '@/designSystem';

export function Example() {
  return (
    <Accordion type="single" defaultValue="overview">
        <Accordion.Item value="overview">
          <Accordion.Trigger>Overview</Accordion.Trigger>
          <Accordion.Panel>High-level summary of the case.</Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="labs">
          <Accordion.Trigger>Lab results</Accordion.Trigger>
          <Accordion.Panel>Recent CBC and metabolic panel.</Accordion.Panel>
        </Accordion.Item>
      </Accordion>
  );
}`,
  },
  argTypes: {
    className: { description: "Additional CSS classes merged onto the root element." },
  },
};
export default meta;
type Story = StoryObj<typeof Accordion>;

const items = [
  { value: 'overview', title: 'Overview', body: 'High-level summary of the patient case and current treatment plan.' },
  { value: 'labs', title: 'Lab results', body: 'Recent CBC, metabolic panel, and tumor markers with trend notes.' },
  { value: 'notes', title: 'Clinical notes', body: 'Documentation from the last visit and follow-up recommendations.' },
];

function AccordionDemo(props: { type?: 'single' | 'multiple'; controlled?: boolean }) {
  const [value, setValue] = useState<string | string[]>(props.type === 'multiple' ? ['overview'] : 'overview');

  const accordion = (
    <Accordion
      type={props.type}
      {...(props.controlled
        ? { value, onValueChange: setValue }
        : { defaultValue: props.type === 'multiple' ? ['overview'] : 'overview' })}
    >
      {items.map((item) => (
        <Accordion.Item key={item.value} value={item.value}>
          <Accordion.Trigger>{item.title}</Accordion.Trigger>
          <Accordion.Panel>{item.body}</Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion>
  );

  return (
    <div style={{ maxWidth: 520 }}>
      {accordion}
      {props.controlled ? (
        <p style={{ marginTop: 12, fontSize: 12, color: 'var(--ds-color-muted)' }}>
          Open: {Array.isArray(value) ? value.join(', ') || 'none' : value || 'none'}
        </p>
      ) : null}
    </div>
  );
}

/** Primary docs canvas — same as Single */
export const Default: Story = {
  render: () => <AccordionDemo type="single" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: /lab results/i }));
    await expect(canvas.getByRole('region', { name: /lab results/i })).toBeVisible();
  },
};

export const Single: Story = {
  render: () => <AccordionDemo type="single" />,
};

export const Multiple: Story = {
  render: () => <AccordionDemo type="multiple" />,
};

export const Controlled: Story = {
  render: () => <AccordionDemo type="single" controlled />,
};
