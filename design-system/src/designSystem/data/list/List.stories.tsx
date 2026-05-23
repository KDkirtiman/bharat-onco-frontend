import type { Meta, StoryObj } from '@storybook/react';

import { List } from './List';
const meta: Meta<typeof List> = {
  tags: ['autodocs'],
  title: 'Data/List',
  component: List,
    parameters: {
    docs: {
      description: { component: "**List** is part of the Data catalog. It is styled only with semantic `--ds-*` tokens so your product theme can override colors and typography without changing component code." },
      subtitle: "List component",
      guide: {
  "whenToUse": [
    "Use **List** in data flows where this UI pattern is needed.",
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
      "description": "Baseline List configuration.",
      "story": "Default"
    }
  ]
},
    },
    liveCode: `render(
  <List items={[
    { id: '1', primary: 'Item one', secondary: 'Details' },
    { id: '2', primary: 'Item two' },
  ]} />
);`,
        usageCode: `import { List } from '@/designSystem';

export function Example() {
  return (
    <List items={[
        { id: '1', primary: 'Item one', secondary: 'Details' },
        { id: '2', primary: 'Item two' },
      ]} />
  );
}`,
  },
  argTypes: {
    className: { description: "Additional CSS classes merged onto the root element." },
  },
};
export default meta;
type Story = StoryObj<typeof List>;

export const Default: Story = {
  render: () => (
    <List variant="divided">
      <List.Item description="Dr. Sharma">Consultation scheduled</List.Item>
      <List.Item description="Lab results ready">Blood work complete</List.Item>
      <List.Item trailing="→">View treatment plan</List.Item>
    </List>
  ),
};

export const Bordered: Story = {
  render: () => (
    <List variant="bordered">
      <List.Item leading="1">Initial assessment</List.Item>
      <List.Item leading="2">Biopsy review</List.Item>
      <List.Item leading="3">Treatment planning</List.Item>
    </List>
  ),
};
