import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import { Button } from '../../core/button/Button';
import { SidePanel } from './SidePanel';
const meta: Meta<typeof SidePanel> = {
  tags: ['autodocs'],
  title: 'Navigation/SidePanel',
  component: SidePanel,
    parameters: {
    docs: {
      description: { component: "**SidePanel** is part of the Navigation catalog. It is styled only with semantic `--ds-*` tokens so your product theme can override colors and typography without changing component code." },
      subtitle: "SidePanel component",
      guide: {
  "whenToUse": [
    "Use **SidePanel** in navigation flows where this UI pattern is needed.",
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
      "description": "Baseline SidePanel configuration.",
      "story": "Default"
    }
  ]
},
    },
    liveCode: `render(
  <SidePanel open title="Filters" onClose={() => {}}><Text>Panel body</Text></SidePanel>
);`,
        usageCode: `import { SidePanel, Text } from '@/designSystem';

export function Example() {
  return (
    <SidePanel open title="Filters" onClose={() => {}}><Text>Panel body</Text></SidePanel>
  );
}`,
  },
  argTypes: {
    className: { description: "Additional CSS classes merged onto the root element." },
  },
};
export default meta;
type Story = StoryObj<typeof SidePanel>;

export const Default: Story = {
  render: function SidePanelDemo() {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open panel</Button>
        <SidePanel open={open} onOpenChange={setOpen} title="Patient details">
          Review history, labs, and treatment notes here.
        </SidePanel>
      </>
    );
  },
};
