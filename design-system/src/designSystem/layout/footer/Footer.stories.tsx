import type { Meta, StoryObj } from '@storybook/react';

import { Title } from '../../core/title/Title';

import { Footer } from './Footer';
const meta: Meta<typeof Footer> = {
  tags: ['autodocs'],
  title: 'Layout/Footer',
  component: Footer,
    parameters: {
    docs: {
      description: { component: "**Footer** is part of the Layout catalog. It is styled only with semantic `--ds-*` tokens so your product theme can override colors and typography without changing component code." },
      subtitle: "Footer component",
      guide: {
  "whenToUse": [
    "Use **Footer** in layout flows where this UI pattern is needed.",
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
      "description": "Baseline Footer configuration.",
      "story": "Default"
    }
  ]
},
    },
    liveCode: `render(<Footer copyright="© 2026" columns={<Text>Links</Text>} />);`,
    usageCode: `import { Footer, Text } from '@/designSystem';

export function Example() {
  return (
    <Footer copyright="© 2026" columns={<Text>Links</Text>} />
  );
}`,
    layout: 'fullscreen',
  },
  argTypes: {
    className: { description: "Additional CSS classes merged onto the root element." },
  },
};
export default meta;
type Story = StoryObj<typeof Footer>;

export const Default: Story = {
  args: {
    columns: (
      <>
        <div>
          <Title level={6} weight="semibold">Platform</Title>
          <p style={{ margin: '8px 0 0', color: 'var(--ds-color-muted)', fontSize: 12 }}>Patients</p>
          <p style={{ margin: '4px 0 0', color: 'var(--ds-color-muted)', fontSize: 12 }}>Calendar</p>
        </div>
        <div>
          <Title level={6} weight="semibold">Company</Title>
          <p style={{ margin: '8px 0 0', color: 'var(--ds-color-muted)', fontSize: 12 }}>About</p>
          <p style={{ margin: '4px 0 0', color: 'var(--ds-color-muted)', fontSize: 12 }}>Privacy</p>
        </div>
      </>
    ),
    copyright: '© 2026 Bharat Oncology. All rights reserved.',
  },
};
