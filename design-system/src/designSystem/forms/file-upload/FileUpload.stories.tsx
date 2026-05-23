import type { Meta, StoryObj } from '@storybook/react';
import { action } from 'storybook/actions';

import { FileUpload } from './FileUpload';
const meta: Meta<typeof FileUpload> = {
  tags: ['autodocs'],
  title: 'Forms/FileUpload',
  component: FileUpload,
    parameters: {
    docs: {
      description: { component: "**FileUpload** is part of the Forms catalog. It is styled only with semantic `--ds-*` tokens so your product theme can override colors and typography without changing component code." },
      subtitle: "FileUpload component",
      guide: {
  "whenToUse": [
    "Use **FileUpload** in forms flows where this UI pattern is needed.",
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
      "description": "Baseline FileUpload configuration.",
      "story": "Default"
    }
  ]
},
    },
    liveCode: `render(<FileUpload label="Upload report" accept=".pdf" />);`,
        usageCode: `import { FileUpload } from '@/designSystem';

export function Example() {
  return (
    <FileUpload label="Upload report" accept=".pdf" />
  );
}`,
  },
  args: { onValueChange: action('onValueChange'), helperText: 'PDF, JPG up to 10MB' },
  argTypes: {
    className: { description: "Additional CSS classes merged onto the root element." },
  },
};
export default meta;
type Story = StoryObj<typeof FileUpload>;

export const Default: Story = {
  args: { accept: '.pdf,.jpg,.png' },
};
