import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '../../core/button/Button';
import { Banner } from './Banner';
const meta: Meta<typeof Banner> = {
  tags: ['autodocs'],
  title: 'Feedback/Banner',
  component: Banner,
    parameters: {
    docs: {
      description: { component: "**Banner** is part of the Feedback catalog. It is styled only with semantic `--ds-*` tokens so your product theme can override colors and typography without changing component code." },
      subtitle: "Banner component",
      guide: {
  "whenToUse": [
    "Use **Banner** in feedback flows where this UI pattern is needed.",
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
      "description": "Baseline Banner configuration.",
      "story": "Default"
    }
  ]
},
    },
    liveCode: `render(<Banner tone="info" dismissible>Informational message</Banner>);`,
        usageCode: `import { Banner } from '@/designSystem';

export function Example() {
  return (
    <Banner tone="info" dismissible>Informational message</Banner>
  );
}`,
  },
  args: {
    tone: 'info',
    dismissible: true,
    children: 'Your trial ends in 7 days. Upgrade to keep full access.',
  },
  argTypes: {
    className: { description: "Additional CSS classes merged onto the root element." },
  },
};
export default meta;
type Story = StoryObj<typeof Banner>;

export const Info: Story = {};

export const Success: Story = {
  args: {
    tone: 'success',
    children: 'Patient record updated successfully.',
  },
};

export const WithActions: Story = {
  args: {
    tone: 'warning',
    children: 'Scheduled maintenance tonight at 11 PM IST.',
  },
  render: (args) => (
    <Banner
      {...args}
      actions={
        <>
          <Button size="sm" variant="ghost">
            Learn more
          </Button>
          <Button size="sm" variant="secondary">
            Remind me
          </Button>
        </>
      }
    />
  ),
};

export const Tones: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {(['success', 'warning', 'danger', 'info'] as const).map((tone) => (
        <Banner key={tone} tone={tone} dismissible>
          {tone.charAt(0).toUpperCase() + tone.slice(1)} banner message.
        </Banner>
      ))}
    </div>
  ),
};
