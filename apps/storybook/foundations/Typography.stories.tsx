import type { Meta, StoryObj } from '@storybook/react';
import { TYPOGRAPHY_SCALE, preset, fontFamily, fontWeight } from 'bfd-themes';

const meta: Meta = {
  title: 'Foundations/Typography',
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj;

export const FontFamilies: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <p className="text-section-label mb-1">Sans (UI default)</p>
        <p className={`text-2xl ${fontFamily.sans}`}>Bharat Oncology — system UI stack</p>
        <p className="text-caption font-mono text-muted-foreground mt-1">--font-sans · font-sans</p>
      </div>
      <div>
        <p className="text-section-label mb-1">Mono (MRN, invoice IDs)</p>
        <p className={`text-lg ${fontFamily.mono}`}>BO-KRK-2024-00482</p>
        <p className="text-caption font-mono text-muted-foreground mt-1">--font-mono · font-mono</p>
      </div>
    </div>
  ),
};

export const SizeScale: Story = {
  render: () => (
    <div className="space-y-3">
      <h2 className="text-section-title mb-2">Type scale</h2>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-table-header border-b border-border">
            <th className="text-left py-2 pr-4">Class</th>
            <th className="text-left py-2 pr-4">Token</th>
            <th className="text-left py-2 pr-4">Size</th>
            <th className="text-left py-2">Usage</th>
          </tr>
        </thead>
        <tbody>
          {TYPOGRAPHY_SCALE.map((row) => (
            <tr key={row.class} className="border-b border-border/50">
              <td className={`py-2 pr-4 font-mono text-caption ${row.class}`}>The quick brown fox</td>
              <td className="py-2 pr-4 font-mono text-caption text-muted-foreground">{row.token}</td>
              <td className="py-2 pr-4 text-muted-foreground">{row.px}</td>
              <td className="py-2 text-muted-foreground">{row.usage}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ),
};

export const Weights: Story = {
  render: () => (
    <div className="space-y-2">
      {Object.entries(fontWeight).map(([name, className]) => (
        <p key={name} className={`text-lg ${className}`}>
          {name} ({className}) — Bharat Oncology
        </p>
      ))}
    </div>
  ),
};

export const Presets: Story = {
  render: () => (
    <div className="space-y-6 max-w-xl">
      <div>
        <p className="text-section-label mb-1">text-page-title</p>
        <h1 className={preset.pageTitle}>Admin Dashboard</h1>
      </div>
      <div>
        <p className="text-section-label mb-1">text-section-title</p>
        <h2 className={preset.sectionTitle}>Treatment Plan</h2>
      </div>
      <div>
        <p className="text-section-label mb-1">text-section-label / text-table-header</p>
        <p className={preset.sectionLabel}>Personal Information</p>
      </div>
      <div>
        <p className={preset.body}>Body text at 14px — used across forms, nav, and tables.</p>
        <p className={preset.bodyMuted}>Muted body for secondary descriptions.</p>
      </div>
    </div>
  ),
};

export const MockupPatterns: Story = {
  render: () => (
    <div className="bg-card border border-border rounded-xl p-5 max-w-md space-y-3">
      <h2 className={preset.pageTitle}>Staff Dashboard</h2>
      <p className={preset.bodyMuted}>Kurukshetra · Tuesday, 7 Jul 2026</p>
      <div className="border-t border-border pt-3">
        <p className={preset.sectionLabel}>Today&apos;s Appointments</p>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-sm font-bold text-primary">09:30</span>
          <span className="text-sm font-semibold">Rajesh Kumar</span>
          <span className={`${preset.captionBadge} px-2 py-0.5 rounded-full bg-success-soft text-success-emphasis`}>
            Completed
          </span>
        </div>
      </div>
    </div>
  ),
};
