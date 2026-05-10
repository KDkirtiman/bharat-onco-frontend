import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '../button/Button';
import { PageHeader } from './PageHeader';
import { SectionHeader } from './SectionHeader';

const meta: Meta<typeof PageHeader> = {
  title: 'Core/PageHeader',
  component: PageHeader,
  args: {
    title: 'Patients',
    subtitle: 'Manage and view patient records',
  },
};

export default meta;
type Story = StoryObj<typeof PageHeader>;

export const Default: Story = {};

export const WithActions: Story = {
  args: {
    actions: (
      <Button variant="secondary" size="sm">
        Export
      </Button>
    ),
  },
};

export const SectionWithEdit: Story = {
  render: () => (
    <div>
      <SectionHeader
        title="Personal Information"
        actions={
          <Button variant="ghost" size="sm">
            Edit
          </Button>
        }
      />
      <div style={{ color: 'var(--ds-color-muted)', fontSize: 14 }}>Form fields would go here.</div>
    </div>
  ),
};
