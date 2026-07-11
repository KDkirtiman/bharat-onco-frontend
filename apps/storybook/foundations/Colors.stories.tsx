import type { Meta, StoryObj } from '@storybook/react';
import { SEMANTIC_HEX, badge, callout } from 'bfd-themes';

const meta: Meta = {
  title: 'Foundations/Colors',
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj;

const BRAND_SWATCHES = [
  { name: 'Primary', token: '--primary', class: 'bg-primary' },
  { name: 'Secondary', token: '--secondary', class: 'bg-secondary' },
  { name: 'Background', token: '--background', class: 'bg-background border border-border' },
  { name: 'Foreground', token: '--foreground', class: 'bg-foreground' },
  { name: 'Muted', token: '--muted', class: 'bg-muted' },
  { name: 'Accent', token: '--accent', class: 'bg-accent border border-border' },
  { name: 'Destructive', token: '--destructive', class: 'bg-destructive' },
  { name: 'Border', token: '--border', class: 'bg-border' },
  { name: 'Input BG', token: '--input-background', class: 'bg-input-background border border-border' },
  { name: 'Ring', token: '--ring', class: 'bg-ring' },
] as const;

const SEMANTIC_GROUPS = Object.entries(SEMANTIC_HEX).map(([name, shades]) => ({
  name,
  shades: Object.entries(shades).map(([shade, hex]) => ({ shade, hex })),
}));

function Swatch({ label, className, hex, token }: { label: string; className: string; hex?: string; token?: string }) {
  return (
    <div className="flex flex-col gap-1.5 min-w-[140px]">
      <div className={`h-14 rounded-lg border border-border ${className}`} />
      <p className="text-sm font-semibold text-foreground">{label}</p>
      {token && <p className="text-caption font-mono text-muted-foreground">{token}</p>}
      {hex && <p className="text-caption font-mono text-muted-foreground">{hex}</p>}
      <p className="text-caption font-mono text-muted-foreground/70">{className}</p>
    </div>
  );
}

export const Brand: Story = {
  render: () => (
    <div>
      <h2 className="text-section-title mb-4">Brand tokens</h2>
      <div className="flex flex-wrap gap-4">
        {BRAND_SWATCHES.map((s) => (
          <Swatch key={s.name} label={s.name} className={s.class} token={s.token} />
        ))}
      </div>
    </div>
  ),
};

export const SemanticStatus: Story = {
  render: () => (
    <div className="space-y-8">
      <h2 className="text-section-title">Semantic status palette</h2>
      {SEMANTIC_GROUPS.map((group) => (
        <div key={group.name}>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">{group.name}</h3>
          <div className="flex flex-wrap gap-4">
            {group.shades.map(({ shade, hex }) => (
              <div key={`${group.name}-${shade}`} className="flex flex-col gap-1.5 min-w-[140px]">
                <div className="h-14 rounded-lg border border-border" style={{ backgroundColor: hex }} />
                <p className="text-sm font-semibold text-foreground">{group.name} / {shade}</p>
                <p className="text-caption font-mono text-muted-foreground">--{group.name}-{shade}</p>
                <p className="text-caption font-mono text-muted-foreground">{hex}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
};

export const BadgeVariants: Story = {
  render: () => (
    <div>
      <h2 className="text-section-title mb-4">Badge class strings</h2>
      <div className="flex flex-wrap gap-2">
        {Object.entries(badge).map(([name, className]) => (
          <span key={name} className={`text-xs font-semibold px-2.5 py-1 rounded-full ${className}`}>
            {name}
          </span>
        ))}
      </div>
    </div>
  ),
};

export const CalloutVariants: Story = {
  render: () => (
    <div className="space-y-3 max-w-lg">
      <h2 className="text-section-title mb-4">Callout variants</h2>
      {Object.entries(callout).map(([name, styles]) => (
        <div key={name} className={`border rounded-lg px-4 py-3 ${styles.container}`}>
          <p className={`text-sm font-semibold ${styles.title}`}>{name} title</p>
          <p className={`text-sm ${styles.body}`}>Body text using semantic callout tokens.</p>
        </div>
      ))}
    </div>
  ),
};

export const SidebarAndCharts: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Swatch label="Sidebar" className="bg-sidebar border border-sidebar-border" token="--sidebar" />
      <Swatch label="Sidebar accent" className="bg-sidebar-accent" token="--sidebar-accent" />
      <Swatch label="Chart 1" className="bg-chart-1" token="--chart-1" />
      <Swatch label="Chart 2" className="bg-chart-2" token="--chart-2" />
      <Swatch label="Chart 3" className="bg-chart-3" token="--chart-3" />
      <Swatch label="Chart 4" className="bg-chart-4" token="--chart-4" />
      <Swatch label="Chart 5" className="bg-chart-5" token="--chart-5" />
    </div>
  ),
};

export const PrintPalette: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Swatch label="Print BG" className="bg-print-bg border border-print-border" token="--print-bg" />
      <Swatch label="Print text" className="bg-print-text" token="--print-text" />
      <Swatch label="Print muted" className="bg-print-muted" token="--print-muted" />
      <Swatch label="Print border" className="bg-print-border" token="--print-border" />
    </div>
  ),
};
