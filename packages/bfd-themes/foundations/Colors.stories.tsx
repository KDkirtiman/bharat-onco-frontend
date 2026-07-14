import type { Meta, StoryObj } from '@storybook/react';
import { SEMANTIC_HEX } from '../tokens/semantic-colors';

const meta: Meta = {
  title: 'Foundations/Colors',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

const brand = [
  { name: 'background', hex: '#faf8fc' },
  { name: 'foreground', hex: '#2d1b4e' },
  { name: 'primary', hex: '#7c3aed' },
  { name: 'secondary', hex: '#ec4899' },
  { name: 'muted', hex: '#f3e8ff' },
  { name: 'accent', hex: '#fdf2f8' },
  { name: 'destructive', hex: '#ef4444' },
  { name: 'border', hex: '#e9d5ff' },
];

function Swatch({ name, hex }: { name: string; hex: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '6px 0' }}>
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 8,
          background: hex,
          border: '1px solid rgba(0,0,0,0.1)',
          flexShrink: 0,
        }}
      />
      <div style={{ fontFamily: 'monospace', fontSize: 13 }}>
        <div>{name}</div>
        <div style={{ color: '#888' }}>{hex}</div>
      </div>
    </div>
  );
}

function ColorGroup({ title, shades }: { title: string; shades: Record<string, string> }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <h3 style={{ fontSize: 14, fontWeight: 600, textTransform: 'capitalize', marginBottom: 8 }}>
        {title}
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 4 }}>
        {Object.entries(shades).map(([shade, hex]) => (
          <Swatch key={shade} name={shade} hex={hex} />
        ))}
      </div>
    </div>
  );
}

export const BrandColors: Story = {
  render: () => (
    <div style={{ padding: 16 }}>
      <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Brand</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 4 }}>
        {brand.map((c) => (
          <Swatch key={c.name} name={c.name} hex={c.hex} />
        ))}
      </div>
    </div>
  ),
};

export const SemanticColors: Story = {
  render: () => (
    <div style={{ padding: 16 }}>
      <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Semantic status colors</h2>
      {Object.entries(SEMANTIC_HEX).map(([name, shades]) => (
        <ColorGroup key={name} title={name} shades={shades} />
      ))}
    </div>
  ),
};
