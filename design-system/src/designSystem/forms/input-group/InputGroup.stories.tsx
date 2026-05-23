import type { Meta, StoryObj } from '@storybook/react';

import { TextField } from '../../core/textfield/TextField';
import { Button } from '../../core/button/Button';
import { InputGroup } from './InputGroup';
const meta: Meta<typeof InputGroup> = {
  tags: ['autodocs'],
  title: 'Forms/InputGroup',
  component: InputGroup,
    parameters: {
    docs: {
      description: { component: "**InputGroup** is part of the Forms catalog. It is styled only with semantic `--ds-*` tokens so your product theme can override colors and typography without changing component code." },
      subtitle: "InputGroup component",
      guide: {
  "whenToUse": [
    "Use **InputGroup** in forms flows where this UI pattern is needed.",
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
      "description": "Baseline InputGroup configuration.",
      "story": "Default"
    }
  ]
},
    },
    liveCode: `render(
  <InputGroup>
    <TextField label="Amount" startAdornment="₹" />
    <Button>Apply</Button>
  </InputGroup>
);`,
        usageCode: `import { Button, InputGroup, TextField } from '@/designSystem';

export function Example() {
  return (
    <InputGroup>
        <TextField label="Amount" startAdornment="₹" />
        <Button>Apply</Button>
      </InputGroup>
  );
}`,
  },
  argTypes: {
    className: { description: "Additional CSS classes merged onto the root element." },
  },
};
export default meta;
type Story = StoryObj<typeof InputGroup>;

export const Default: Story = {
  render: () => (
    <InputGroup>
      <TextField placeholder="Search patients…" aria-label="Search patients" />
      <Button variant="primary">Search</Button>
    </InputGroup>
  ),
};

export const ThreeItems: Story = {
  render: () => (
    <InputGroup>
      <TextField placeholder="Country code" aria-label="Country code" style={{ width: 100 }} />
      <TextField placeholder="Phone number" aria-label="Phone number" />
      <Button variant="secondary">Verify</Button>
    </InputGroup>
  ),
};

export const SingleItem: Story = {
  render: () => (
    <InputGroup>
      <TextField placeholder="Standalone grouped input" aria-label="Grouped input" />
    </InputGroup>
  ),
};
