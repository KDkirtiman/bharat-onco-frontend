import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '../../core/button/Button';
import { ServiceAlert } from './ServiceAlert';
const meta: Meta<typeof ServiceAlert> = {
  tags: ['autodocs'],
  title: 'Feedback/ServiceAlert',
  component: ServiceAlert,
    parameters: {
    docs: {
      description: { component: "**ServiceAlert** is part of the Feedback catalog. It is styled only with semantic `--ds-*` tokens so your product theme can override colors and typography without changing component code." },
      subtitle: "ServiceAlert component",
      guide: {
  "whenToUse": [
    "Use **ServiceAlert** in feedback flows where this UI pattern is needed.",
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
      "description": "Baseline ServiceAlert configuration.",
      "story": "Default"
    }
  ]
},
    },
    liveCode: `render(<ServiceAlert title="Maintenance" message="Systems down 2–4 AM" />);`,
        usageCode: `import { ServiceAlert } from '@/designSystem';

export function Example() {
  return (
    <ServiceAlert title="Maintenance" message="Systems down 2–4 AM" />
  );
}`,
  },
  argTypes: {
    className: { description: "Additional CSS classes merged onto the root element." },
  },
};
export default meta;
type Story = StoryObj<typeof ServiceAlert>;

export const Default: Story = {
  args: {
    tone: 'warning',
    severity: 'high',
    title: 'Scheduled maintenance',
    message: 'Lab results may be delayed until 6 PM IST.',
  },
  render: (args) => (
    <ServiceAlert
      {...args}
      actions={
        <Button size="sm" variant="secondary">
          View status
        </Button>
      }
    />
  ),
};
