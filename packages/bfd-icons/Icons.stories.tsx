import type { Meta, StoryObj } from '@storybook/react';
import * as icons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const meta: Meta = {
  title: 'Foundations/Icons',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

/**
 * Every icon actually referenced in the Bharat Oncology mockup (src/app/**),
 * grouped by usage. All of them ship today via `import { X } from 'bfd-icons'`
 * since bfd-icons re-exports lucide-react in full — this gallery exists so
 * they're discoverable without grepping the mockup source.
 */
const groups: Record<string, string[]> = {
  Actions: ['Plus', 'Minus', 'Check', 'X', 'Pencil', 'Trash2', 'Save', 'Send', 'Search', 'Play'],
  'Files & documents': ['FileText', 'FolderOpen', 'Printer', 'Download', 'Upload', 'ClipboardList', 'ClipboardCheck'],
  'Scheduling & time': ['Calendar', 'CalendarCheck', 'CalendarDays', 'CalendarPlus', 'Clock', 'Hourglass', 'History'],
  'Alerts & status': ['AlertCircle', 'AlertOctagon', 'AlertTriangle', 'CheckCircle2', 'ShieldCheck', 'Loader2'],
  Navigation: ['ChevronDown', 'ChevronUp', 'ChevronLeft', 'ChevronRight'],
  'People & identity': ['User', 'Users', 'UserCheck', 'UserPlus', 'Lock', 'EyeOff', 'Eye'],
  'Billing & commerce': ['CreditCard', 'IndianRupee', 'Receipt', 'Calculator', 'TrendingUp', 'TrendingDown', 'BarChart2'],
  Clinical: ['Stethoscope', 'Syringe', 'FlaskConical', 'Radiation', 'Scissors', 'Heart', 'Activity', 'Layers'],
  Communication: ['Mail', 'Phone', 'MessageSquare', 'Bell'],
  Facilities: ['Hospital', 'Armchair', 'Wrench', 'Settings'],
};

function IconTile({ name }: { name: string }) {
  const Icon = (icons as unknown as Record<string, LucideIcon>)[name];
  if (!Icon) return null;
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
        padding: 12,
        border: '1px solid rgba(0,0,0,0.1)',
        borderRadius: 8,
      }}
    >
      <Icon size={22} />
      <code style={{ fontSize: 11, textAlign: 'center' }}>{name}</code>
    </div>
  );
}

export const Gallery: Story = {
  render: () => (
    <div style={{ padding: 16 }}>
      <p style={{ fontSize: 13, color: '#888', marginBottom: 16 }}>
        Import any icon below with <code>import {'{'} IconName {'}'} from 'bfd-icons'</code>. This
        list mirrors what the Figma mockup actually uses — the full lucide-react set (1000+
        icons) is available too, this is just the curated, in-use subset.
      </p>
      {Object.entries(groups).map(([group, names]) => (
        <div key={group} style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>{group}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))', gap: 8 }}>
            {names.map((name) => (
              <IconTile key={name} name={name} />
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
};
