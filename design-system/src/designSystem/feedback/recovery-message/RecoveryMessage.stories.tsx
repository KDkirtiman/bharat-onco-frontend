import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '../../core/button/Button';
import { RecoveryMessage } from './RecoveryMessage';
const meta: Meta<typeof RecoveryMessage> = {
  tags: ['autodocs'],
  title: 'Feedback/RecoveryMessage',
  component: RecoveryMessage,
    parameters: {
    docs: {
      description: { component: "**RecoveryMessage** is part of the Feedback catalog. It is styled only with semantic `--ds-*` tokens so your product theme can override colors and typography without changing component code." },
      subtitle: "RecoveryMessage component",
      guide: {
  "whenToUse": [
    "Use **RecoveryMessage** in feedback flows where this UI pattern is needed.",
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
      "description": "Baseline RecoveryMessage configuration.",
      "story": "Default"
    }
  ]
},
    },
    liveCode: `render(<RecoveryMessage title="Something failed" action={<Button>Retry</Button>} />);`,
        usageCode: `import { Button, RecoveryMessage } from '@/designSystem';

export function Example() {
  return (
    <RecoveryMessage title="Something failed" action={<Button>Retry</Button>} />
  );
}`,
  },
  argTypes: {
    className: { description: "Additional CSS classes merged onto the root element." },
  },
};
export default meta;
type Story = StoryObj<typeof RecoveryMessage>;

export const Default: Story = {
  args: {
    illustration: '⚠',
    title: 'Something went wrong',
    message: 'We could not load your treatment plan. Try again or contact support.',
    action: <Button>Retry</Button>,
  },
};
