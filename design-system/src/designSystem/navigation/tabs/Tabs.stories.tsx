import type { Meta, StoryObj } from '@storybook/react';
import { action } from 'storybook/actions';
import { expect, userEvent, within } from 'storybook/test';

import { Tabs } from './Tabs';
const meta: Meta<typeof Tabs> = {
  tags: ['autodocs'],
  title: 'Navigation/Tabs',
  component: Tabs,
    parameters: {
    docs: {
      description: { component: "**Tabs** is part of the Navigation catalog. It is styled only with semantic `--ds-*` tokens so your product theme can override colors and typography without changing component code." },
      subtitle: "Tabs component",
      guide: {
  "whenToUse": [
    "Use **Tabs** in navigation flows where this UI pattern is needed.",
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
      "description": "Baseline Tabs configuration.",
      "story": "Default"
    }
  ]
},
    },
    liveCode: `render(
  <Tabs defaultValue="1" items={[
    { value: '1', label: 'Tab 1', panel: <Text>Panel 1</Text> },
    { value: '2', label: 'Tab 2', panel: <Text>Panel 2</Text> },
  ]} />
);`,
        usageCode: `import { Tabs, Text } from '@/designSystem';

export function Example() {
  return (
    <Tabs defaultValue="1" items={[
        { value: '1', label: 'Tab 1', panel: <Text>Panel 1</Text> },
        { value: '2', label: 'Tab 2', panel: <Text>Panel 2</Text> },
      ]} />
  );
}`,
  },
  args: { onValueChange: action('onValueChange') },
  argTypes: {
    className: { description: "Additional CSS classes merged onto the root element." },
  },
};
export default meta;
type Story = StoryObj<typeof Tabs>;

export const Default: Story = {
  render: (args) => (
    <Tabs {...args} defaultValue="overview">
      <Tabs.Tab value="overview" label="Overview">Patient overview and history.</Tabs.Tab>
      <Tabs.Tab value="labs" label="Labs">Recent lab results.</Tabs.Tab>
      <Tabs.Tab value="notes" label="Notes">Clinical notes.</Tabs.Tab>
    </Tabs>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const labsTab = canvas.getByRole('tab', { name: /labs/i });
    await userEvent.click(labsTab);
    await expect(labsTab).toHaveFocus();
    await expect(labsTab).toHaveAttribute('aria-selected', 'true');
    await expect(canvas.getByRole('tabpanel')).toHaveTextContent(/lab results/i);
  },
};

export const Pills: Story = {
  render: (args) => (
    <Tabs {...args} variant="pills" defaultValue="overview">
      <Tabs.Tab value="overview" label="Overview">Overview content</Tabs.Tab>
      <Tabs.Tab value="labs" label="Labs">Labs content</Tabs.Tab>
    </Tabs>
  ),
};
