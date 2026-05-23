import type { Meta, StoryObj } from '@storybook/react';

import { FormErrors } from './FormErrors';
const meta: Meta<typeof FormErrors> = {
  tags: ['autodocs'],
  title: 'Forms/FormErrors',
  component: FormErrors,
    parameters: {
    docs: {
      description: { component: "**FormErrors** is part of the Forms catalog. It is styled only with semantic `--ds-*` tokens so your product theme can override colors and typography without changing component code." },
      subtitle: "FormErrors component",
      guide: {
  "whenToUse": [
    "Use **FormErrors** in forms flows where this UI pattern is needed.",
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
      "description": "Baseline FormErrors configuration.",
      "story": "Default"
    }
  ]
},
    },
    liveCode: `render(<FormErrors errors={[{ field: 'email', message: 'Invalid email' }]} />);`,
        usageCode: `import { FormErrors } from '@/designSystem';

export function Example() {
  return (
    <FormErrors errors={[{ field: 'email', message: 'Invalid email' }]} />
  );
}`,
  },
  args: {
    errors: [
      { field: 'MRN', message: 'Must be a valid hospital identifier.' },
      { field: 'Date of birth', message: 'Patient must be at least 18 years old.' },
      { field: 'Phone', message: 'Enter a 10-digit mobile number.' },
    ],
  },
  argTypes: {
    className: { description: "Additional CSS classes merged onto the root element." },
  },
};
export default meta;
type Story = StoryObj<typeof FormErrors>;

export const Default: Story = {};

export const SingleError: Story = {
  args: {
    errors: [{ field: 'Email', message: 'This field is required.' }],
  },
};

export const Empty: Story = {
  args: {
    errors: [],
  },
};
