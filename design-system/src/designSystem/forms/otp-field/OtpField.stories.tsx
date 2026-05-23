import type { Meta, StoryObj } from '@storybook/react';
import { action } from 'storybook/actions';
import { useState } from 'react';

import { OtpField } from './OtpField';
const meta: Meta<typeof OtpField> = {
  tags: ['autodocs'],
  title: 'Forms/OtpField',
  component: OtpField,
    parameters: {
    docs: {
      description: { component: "**OtpField** is part of the Forms catalog. It is styled only with semantic `--ds-*` tokens so your product theme can override colors and typography without changing component code." },
      subtitle: "OtpField component",
      guide: {
  "whenToUse": [
    "Use **OtpField** in forms flows where this UI pattern is needed.",
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
      "description": "Baseline OtpField configuration.",
      "story": "Default"
    }
  ]
},
    },
    liveCode: `render(<OtpField length={6} onComplete={(v) => console.log(v)} />);`,
        usageCode: `import { OtpField } from '@/designSystem';

export function Example() {
  return (
    <OtpField length={6} onComplete={(v) => console.log(v)} />
  );
}`,
  },
  args: {
    length: 6,
    onValueChange: action('onValueChange'),
    onComplete: action('onComplete'),
  },
  argTypes: {
    className: { description: "Additional CSS classes merged onto the root element." },
  },
};
export default meta;
type Story = StoryObj<typeof OtpField>;

export const Default: Story = {};

export const FourDigits: Story = {
  args: {
    length: 4,
  },
};

export const EightDigits: Story = {
  args: {
    length: 8,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: '123456',
  },
};

export const Controlled: Story = {
  render: function ControlledOtpField() {
    const [value, setValue] = useState('');
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <OtpField value={value} onValueChange={setValue} onComplete={action('onComplete')} />
        <span style={{ fontSize: 12, color: 'var(--ds-color-muted)' }}>
          Current value: {value || '—'}
        </span>
      </div>
    );
  },
};
