import type { Meta, StoryObj } from '@storybook/react';
import { action } from 'storybook/actions';
import { useState } from 'react';

import { Button } from '../core/button/Button';
import { Icon } from '../icons/Icon';

import { Sidebar } from './Sidebar';

const nav = [
  { id: 'dash', label: 'Dashboard', icon: 'layoutDashboard' as const },
  { id: 'calendar', label: 'Visit Calendar', icon: 'calendar' as const },
  { id: 'patients', label: 'Patients', icon: 'users' as const },
  { id: 'profile', label: 'Profile', icon: 'user' as const },
];

const meta: Meta<typeof Sidebar> = {
  title: 'Navigation/Sidebar',
  component: Sidebar,
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
          brandSlot={
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <Icon name="heart" size="md" /> Bharat Oncology
            </span>
          }
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
                <Icon name="logout" size="sm" /> Logout
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
