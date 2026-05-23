import type { Meta, StoryObj } from '@storybook/react';
import { action } from 'storybook/actions';
import { useState } from 'react';

import { Button } from '../core/button/Button';
import { Icon } from '../icons/Icon';
import { Logo } from '../icons/Logo';

import { Sidebar } from './Sidebar';
import styles from './sidebar.module.css';
const nav = [
  { id: 'dash', label: 'Dashboard', icon: 'layoutDashboard' as const },
  { id: 'calendar', label: 'Visit Calendar', icon: 'calendar' as const },
  { id: 'patients', label: 'Patients', icon: 'users' as const },
  { id: 'profile', label: 'Profile', icon: 'user' as const },
];

const meta: Meta<typeof Sidebar> = {
  tags: ['autodocs'],
  title: 'Navigation/Sidebar',
  component: Sidebar,
    parameters: {
    docs: {
      description: { component: "**Sidebar** is part of the Navigation catalog. It is styled only with semantic `--ds-*` tokens so your product theme can override colors and typography without changing component code." },
      subtitle: "Sidebar component",
      guide: {
  "whenToUse": [
    "Use **Sidebar** in navigation flows where this UI pattern is needed.",
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
      "description": "Baseline Sidebar configuration.",
      "story": "Default"
    }
  ]
},
    },
    liveCode: `render(<Sidebar items={[{ id: 'home', label: 'Home', icon: 'layoutDashboard' }, { id: 'patients', label: 'Patients', icon: 'users' }]} activeId="home" />);`,
        usageCode: `import { Sidebar } from '@/designSystem';

export function Example() {
  return (
    <Sidebar
      items={[
        { id: 'home', label: 'Home', icon: 'layoutDashboard' },
        { id: 'patients', label: 'Patients', icon: 'users' },
      ]}
      activeId="home"
    />
  );
}`,
  },
  argTypes: {
    className: { description: "Additional CSS classes merged onto the root element." },
  },
};
export default meta;
type Story = StoryObj<typeof Sidebar>;

export const Interactive: Story = {
  render: function InteractiveSidebar() {
    const [activeId, setActiveId] = useState('patients');
    const [collapsed, setCollapsed] = useState(false);

    return (
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <Sidebar
          brandSlot={<Logo size={collapsed ? 'sm' : 'lg'} />}
          items={nav}
          activeId={activeId}
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed((c) => !c)}
          onSelect={(id) => {
            action('navigate')(id);
            setActiveId(id);
          }}
          footer={
            <Button
              variant="ghost"
              size="sm"
              fullWidth
              onClick={() => action('logout')()}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <Icon name="logout" size="sm" />
                <span className={styles.label}>Logout</span>
              </span>
            </Button>
          }
        />
        <main style={{ flex: 1, padding: 24 }}>
          <p style={{ marginTop: 0, fontWeight: 800 }}>Active route: {activeId}</p>
          <p style={{ color: 'var(--ds-color-muted)' }}>
            Click nav items — selection updates here. Toggle collapse — labels hide but icons stay.
          </p>
        </main>
      </div>
    );
  },
};
