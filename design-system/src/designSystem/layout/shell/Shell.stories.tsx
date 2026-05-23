import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '../../core/button/Button';
import { Title } from '../../core/title/Title';
import { Logo } from '../../icons/Logo';
import { Sidebar } from '../../navigation/Sidebar';

import { Footer } from '../footer/Footer';
import { Header } from '../header/Header';
import { Shell } from './Shell';
const meta: Meta<typeof Shell> = {
  tags: ['autodocs'],
  title: 'Layout/Shell',
  component: Shell,
    parameters: {
    docs: {
      description: { component: "**Shell** is part of the Layout catalog. It is styled only with semantic `--ds-*` tokens so your product theme can override colors and typography without changing component code." },
      subtitle: "Shell component",
      guide: {
  "whenToUse": [
    "Use **Shell** in layout flows where this UI pattern is needed.",
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
      "description": "Baseline Shell configuration.",
      "story": "Default"
    }
  ]
},
    },
    liveCode: `render(
  <Shell header={<Header logo={<Logo />} />} sidebar={<Text>Nav</Text>}>
    <Text>Main content</Text>
  </Shell>
);`,
    usageCode: `import { Header, Logo, Shell, Text } from '@/designSystem';

export function Example() {
  return (
    <Shell header={<Header logo={<Logo />} />} sidebar={<Text>Nav</Text>}>
        <Text>Main content</Text>
      </Shell>
  );
}`,
    layout: 'fullscreen',
  },
  argTypes: {
    className: { description: "Additional CSS classes merged onto the root element." },
  },
};
export default meta;
type Story = StoryObj<typeof Shell>;

const nav = [
  { id: 'dash', label: 'Dashboard', icon: 'layoutDashboard' as const },
  { id: 'patients', label: 'Patients', icon: 'users' as const },
];

export const Default: Story = {
  render: () => (
    <Shell
      header={
        <Header
          logo={<Logo size="md" />}
          nav={<span style={{ color: 'var(--ds-color-muted)' }}>Clinician workspace</span>}
          actions={<Button variant="ghost" size="sm">Help</Button>}
        />
      }
      sidebar={<Sidebar items={nav} activeId="patients" />}
      footer={
        <Footer
          columns={
            <>
              <div>
                <Title level={6} weight="semibold">Product</Title>
                <p style={{ margin: '8px 0 0', color: 'var(--ds-color-muted)', fontSize: 12 }}>Patients</p>
              </div>
              <div>
                <Title level={6} weight="semibold">Support</Title>
                <p style={{ margin: '8px 0 0', color: 'var(--ds-color-muted)', fontSize: 12 }}>Contact</p>
              </div>
            </>
          }
          copyright="© 2026 Bharat Oncology"
        />
      }
    >
      <Title level={2}>Main content</Title>
      <p style={{ color: 'var(--ds-color-muted)' }}>Page body rendered in the shell main slot.</p>
    </Shell>
  ),
};
