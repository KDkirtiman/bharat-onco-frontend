import type { Meta, StoryObj } from '@storybook/react';

import { Card } from './Card';
const meta: Meta<typeof Card> = {
  tags: ['autodocs'],
  title: 'Core/Card',
  component: Card,
    parameters: {
    docs: {
      description: { component: "Elevated surface for grouping content. Optional `header`/`footer` props or `Card.Header` compound slots." },
      subtitle: "Grouped content surface",
      guide: {
  "whenToUse": [
    "Dashboard widgets.",
    "Form sections.",
    "Selectable tiles (see CardButton)."
  ],
  "capabilities": [
    "padding variants",
    "elevated/outlined/flat",
    "Header/Body/Footer"
  ],
  "scenarios": []
},
    },
    liveCode: `render(
  <Card header="Summary" footer={<Button size="sm">View</Button>}>
  <Text>Card body content</Text>
  </Card>
);`,
        usageCode: `import { Button, Card, Text } from '@/designSystem';

export function Example() {
  return (
    <Card header="Summary" footer={<Button size="sm">View</Button>}>
      <Text>Card body content</Text>
      </Card>
  );
}`,
  },
  args: {
    padding: 'md',
    children: (
      <div>
        <div style={{ fontWeight: 800, marginBottom: 6 }}>Card title</div>
        <div style={{ color: 'var(--ds-color-muted)' }}>
          Cards are the main surface used in dashboards, forms, and tables.
        </div>
      </div>
    ),
  },
  argTypes: {
    padding: { description: "`none` | `sm` | `md` | `lg`." },
    variant: { description: "`elevated` | `outlined` | `flat`." },
    header: { description: "Header slot content." },
    footer: { description: "Footer actions." },
    children: { description: "Main body." },
  },
};
export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {};

export const PaddingVariants: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}>
      <Card padding="sm">Small padding</Card>
      <Card padding="md">Medium padding</Card>
      <Card padding="lg">Large padding</Card>
    </div>
  ),
};
