import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '../../core/button/Button';
import { Logo } from '../../icons/Logo';

import { Header } from './Header';
const meta: Meta<typeof Header> = {
  tags: ['autodocs'],
  title: 'Layout/Header',
  component: Header,
    parameters: {
    docs: {
      description: { component: "**Header** is part of the Layout catalog. It is styled only with semantic `--ds-*` tokens so your product theme can override colors and typography without changing component code." },
      subtitle: "Header component",
      guide: {
  "whenToUse": [
    "Use **Header** in layout flows where this UI pattern is needed.",
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
      "description": "Baseline Header configuration.",
      "story": "Default"
    }
  ]
},
    },
    liveCode: `render(<Header logo={<Logo />} actions={<Button size="sm">Sign in</Button>} />);`,
        usageCode: `import { Button, Header, Logo } from '@/designSystem';

export function Example() {
  return (
    <Header logo={<Logo />} actions={<Button size="sm">Sign in</Button>} />
  );
}`,
    layout: 'fullscreen',
  },
  argTypes: {
    className: { description: "Additional CSS classes merged onto the root element." },
  },
};
export default meta;
type Story = StoryObj<typeof Header>;

export const Default: Story = {
  render: (args) => (
    <Header
      {...args}
      logo={<Logo size="md" />}
      nav={<span style={{ color: 'var(--ds-color-muted)' }}>Dashboard / Patients</span>}
      actions={
        <>
          <Button variant="ghost" size="sm">
            Notifications
          </Button>
          <Button variant="primary" size="sm">
            New visit
          </Button>
        </>
      }
    />
  ),
};
