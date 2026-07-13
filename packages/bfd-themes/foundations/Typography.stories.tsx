import type { Meta, StoryObj } from '@storybook/react';
import { TYPOGRAPHY_SCALE, fontWeight } from '../tokens/typography';

const meta: Meta = {
  title: 'Foundations/Typography',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

export const TypeScale: Story = {
  render: () => (
    <div style={{ padding: 16 }}>
      <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Type scale</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>
            <th style={{ padding: '6px 12px' }}>Class</th>
            <th style={{ padding: '6px 12px' }}>Token</th>
            <th style={{ padding: '6px 12px' }}>Size</th>
            <th style={{ padding: '6px 12px' }}>Usage</th>
            <th style={{ padding: '6px 12px' }}>Preview</th>
          </tr>
        </thead>
        <tbody>
          {TYPOGRAPHY_SCALE.map((row) => (
            <tr key={row.class} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '6px 12px', fontFamily: 'monospace' }}>{row.class}</td>
              <td style={{ padding: '6px 12px', fontFamily: 'monospace', color: '#888' }}>{row.token}</td>
              <td style={{ padding: '6px 12px' }}>{row.px}</td>
              <td style={{ padding: '6px 12px' }}>{row.usage}</td>
              <td style={{ padding: '6px 12px' }}>
                <span className={row.class}>The quick brown fox</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ),
};

export const FontWeights: Story = {
  render: () => (
    <div style={{ padding: 16 }}>
      <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Font weights</h2>
      {Object.entries(fontWeight).map(([name, cls]) => (
        <div key={name} style={{ padding: '6px 0', display: 'flex', gap: 12, alignItems: 'baseline' }}>
          <span style={{ fontFamily: 'monospace', color: '#888', width: 100 }}>{cls}</span>
          <span className={cls} style={{ fontSize: 18 }}>
            Bharat Oncology — {name}
          </span>
        </div>
      ))}
    </div>
  ),
};
