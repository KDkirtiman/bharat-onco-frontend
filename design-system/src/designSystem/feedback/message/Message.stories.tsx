import type { Meta, StoryObj } from '@storybook/react';

import { TextField } from '../../core/textfield/TextField';
import { Message } from './Message';
const meta: Meta<typeof Message> = {
  tags: ['autodocs'],
  title: 'Feedback/Message',
  component: Message,
    parameters: {
    docs: {
      description: { component: "**Message** is part of the Feedback catalog. It is styled only with semantic `--ds-*` tokens so your product theme can override colors and typography without changing component code." },
      subtitle: "Message component",
      guide: {
  "whenToUse": [
    "Use **Message** in feedback flows where this UI pattern is needed.",
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
      "description": "Baseline Message configuration.",
      "story": "Default"
    }
  ]
},
    },
    liveCode: `render(<Message tone="success">Saved successfully</Message>);`,
        usageCode: `import { Message } from '@/designSystem';

export function Example() {
  return (
    <Message tone="success">Saved successfully</Message>
  );
}`,
  },
  argTypes: {
    className: { description: "Additional CSS classes merged onto the root element." },
  },
};
export default meta;
type Story = StoryObj<typeof Message>;

export const Tones: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 320 }}>
      <Message tone="neutral">Optional helper text for this field.</Message>
      <Message tone="success">Looks good.</Message>
      <Message tone="warning">Value is outside the recommended range.</Message>
      <Message tone="danger">This field is required.</Message>
      <Message tone="info">Use the format DD/MM/YYYY.</Message>
    </div>
  ),
};

export const WithTextField: Story = {
  render: () => (
    <div style={{ maxWidth: 320 }}>
      <TextField label="Email" placeholder="name@example.com" />
      <Message tone="danger">Enter a valid email address.</Message>
    </div>
  ),
};
