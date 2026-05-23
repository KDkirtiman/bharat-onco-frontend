import type { Meta, StoryObj } from '@storybook/react';
import { action } from 'storybook/actions';
import { useState } from 'react';

import { Radio, RadioGroup } from './Radio';
const meta: Meta<typeof RadioGroup> = {
  tags: ['autodocs'],
  title: 'Forms/Radio',
  component: RadioGroup,
    parameters: {
    docs: {
      description: { component: "**RadioGroup** is part of the Forms catalog. It is styled only with semantic `--ds-*` tokens so your product theme can override colors and typography without changing component code." },
      subtitle: "RadioGroup component",
      guide: {
  "whenToUse": [
    "Use **RadioGroup** in forms flows where this UI pattern is needed.",
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
      "description": "Baseline RadioGroup configuration.",
      "story": "Default"
    }
  ]
},
    },
    liveCode: `render(
  <RadioGroup aria-label="Consultation type" defaultValue="in-person">
    <Radio value="in-person" label="In-person visit" />
    <Radio value="telehealth" label="Telehealth" />
    <Radio value="follow-up" label="Follow-up review" />
  </RadioGroup>
);`,
        usageCode: `import { Radio, RadioGroup } from '@/designSystem';

export function Example() {
  return (
    <RadioGroup aria-label="Consultation type" defaultValue="in-person">
      <Radio value="in-person" label="In-person visit" />
      <Radio value="telehealth" label="Telehealth" />
      <Radio value="follow-up" label="Follow-up review" />
    </RadioGroup>
  );
}`,
  },
  args: {
    'aria-label': 'Consultation type',
    onValueChange: action('onValueChange'),
  },
  argTypes: {
    className: { description: "Additional CSS classes merged onto the root element." },
  },
};
export default meta;
type Story = StoryObj<typeof RadioGroup>;

export const Default: Story = {
  render: (args) => (
    <RadioGroup {...args} defaultValue="in-person">
      <Radio value="in-person" label="In-person visit" />
      <Radio value="telehealth" label="Telehealth" />
      <Radio value="follow-up" label="Follow-up review" />
    </RadioGroup>
  ),
};

export const CardLayout: Story = {
  render: (args) => (
    <RadioGroup {...args} layout="card" defaultValue="standard">
      <Radio
        value="standard"
        label="Standard care"
        description="Routine oncology consultation and monitoring."
      />
      <Radio
        value="urgent"
        label="Urgent review"
        description="Priority scheduling within 24 hours."
      />
      <Radio
        value="second-opinion"
        label="Second opinion"
        description="Independent review of diagnosis and treatment plan."
      />
    </RadioGroup>
  ),
};

export const Disabled: Story = {
  render: (args) => (
    <RadioGroup {...args} disabled defaultValue="in-person">
      <Radio value="in-person" label="In-person visit" />
      <Radio value="telehealth" label="Telehealth" />
    </RadioGroup>
  ),
};

export const Controlled: Story = {
  render: function ControlledRadio() {
    const [value, setValue] = useState('telehealth');
    return (
      <RadioGroup
        aria-label="Consultation type"
        value={value}
        onValueChange={setValue}
      >
        <Radio value="in-person" label="In-person visit" />
        <Radio value="telehealth" label="Telehealth" />
        <Radio value="follow-up" label="Follow-up review" />
      </RadioGroup>
    );
  },
};
