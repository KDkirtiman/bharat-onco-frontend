import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '../button/Button';
import { PageHeader } from './PageHeader';
import { SectionHeader } from './SectionHeader';
const meta: Meta<typeof PageHeader> = {
  tags: ['autodocs'],
  title: 'Core/PageHeader',
  component: PageHeader,
    parameters: {
    docs: {
      description: { component: "**PageHeader** is part of the Core catalog. It is styled only with semantic `--ds-*` tokens so your product theme can override colors and typography without changing component code." },
      subtitle: "PageHeader component",
      guide: {
  "whenToUse": [
    "Use **PageHeader** in core flows where this UI pattern is needed.",
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
      "description": "Baseline PageHeader configuration.",
      "story": "Default"
    }
  ]
},
    },
    liveCode: `render(<PageHeader title="Patients" subtitle="Manage records" actions={<Button>Add</Button>} />);`,
        usageCode: `import { Button, PageHeader } from '@/designSystem';

export function Example() {
  return (
    <PageHeader title="Patients" subtitle="Manage records" actions={<Button>Add</Button>} />
  );
}`,
  },
  args: {
    title: 'Patients',
    subtitle: 'Manage and view patient records',
  },
  argTypes: {
    className: { description: "Additional CSS classes merged onto the root element." },
  },
};
export default meta;
type Story = StoryObj<typeof PageHeader>;

export const Default: Story = {};

export const WithActions: Story = {
  render: (args) => (
    <PageHeader
      {...args}
      actions={
        <Button variant="secondary" size="sm">
          Export
        </Button>
      }
    />
  ),
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
