import type { Meta, StoryObj } from '@storybook/react';
import { action } from 'storybook/actions';

import type { DateRangePreset } from './HybridDateRangeSelector';
import { HybridDateRangeSelector } from './HybridDateRangeSelector';
function daysAgoIso(days: number) {
  return new Date(Date.now() - days * 86400000).toISOString().slice(0, 10);
}

const today = new Date().toISOString().slice(0, 10);

const labResultsPresets: DateRangePreset[] = [
  {
    id: '7d',
    label: 'Last 7 days',
    start: daysAgoIso(7),
    end: today,
  },
  {
    id: '30d',
    label: 'Last 30 days',
    start: daysAgoIso(30),
    end: today,
  },
  {
    id: 'since-chemo',
    label: 'Since last chemo cycle',
    start: daysAgoIso(21),
    end: today,
  },
];

const chemoCyclePresets: DateRangePreset[] = [
  {
    id: 'cycle-1',
    label: 'Cycle 1 (Apr 2026)',
    start: '2026-04-01',
    end: '2026-04-28',
  },
  {
    id: 'cycle-2',
    label: 'Cycle 2 (May 2026)',
    start: '2026-05-01',
    end: '2026-05-28',
  },
  {
    id: 'cycle-3',
    label: 'Cycle 3 (Jun 2026)',
    start: '2026-06-01',
    end: '2026-06-28',
  },
];

const meta: Meta<typeof HybridDateRangeSelector> = {
  tags: ['autodocs'],
  title: 'Forms/HybridDateRangeSelector',
  component: HybridDateRangeSelector,
  parameters: {
    docs: {
      description: {
        component:
          'Combines quick presets with manual start/end dates—typical for lab trends, toxicity logs, and export windows. Presets map to concrete ISO dates; custom range uses paired date pickers.',
      },
      subtitle: 'Preset + custom range for clinical timelines',
      guide: {
        whenToUse: [
          'Filtering lab or vitals charts (last 7 / 30 days, since last treatment).',
          'Exporting a treatment episode or chemo cycle for MDT packs.',
          'Any report where users pick a shortcut first and refine dates second.',
        ],
        capabilities: [
          'Configurable `presets` with `id`, `label`, `start`, `end`',
          'Controlled `start` / `end` or `onRangeChange` for query sync',
          'Built-in defaults: last 7, 30, and 90 days',
        ],
        scenarios: [
          {
            title: 'Lab results trend',
            story: 'LabResultsTrend',
            description: 'Oncology lab queue: common windows including since last chemo cycle.',
          },
          {
            title: 'Chemo cycle export',
            story: 'ChemoCycleExport',
            description: 'Preset per cycle when downloading nursing and pharmacy summaries.',
          },
          {
            title: 'Custom surveillance window',
            story: 'CustomSurveillanceWindow',
            description: 'Manual range for follow-up imaging or tumour marker review.',
          },
        ],
      },
    },
    liveCode: `render(
  <HybridDateRangeSelector
    label="Lab results"
    presets={[
      { id: '7d', label: 'Last 7 days', start: '${daysAgoIso(7)}', end: '${today}' },
      { id: '30d', label: 'Last 30 days', start: '${daysAgoIso(30)}', end: '${today}' },
    ]}
    defaultStart="${daysAgoIso(30)}"
    defaultEnd="${today}"
  />
);`,
    usageCode: `import { HybridDateRangeSelector, type DateRangePreset } from '@/designSystem';

const labPresets: DateRangePreset[] = [
  { id: '7d', label: 'Last 7 days', start: '2026-04-16', end: '2026-05-23' },
  { id: '30d', label: 'Last 30 days', start: '2026-03-24', end: '2026-05-23' },
];

export function LabTrendFilter() {
  return (
    <HybridDateRangeSelector
      label="Lab results"
      presets={labPresets}
      defaultStart="2026-03-24"
      defaultEnd="2026-05-23"
      onRangeChange={({ start, end }) => console.log(start, end)}
    />
  );
}`,
  },
  args: {
    onRangeChange: action('onRangeChange'),
  },
  argTypes: {
    label: { description: 'Group label shown above presets and date fields.' },
    presets: { description: 'Quick-range buttons.', control: false },
    disabled: { description: 'Disables presets and date pickers.' },
  },
};

export default meta;
type Story = StoryObj<typeof HybridDateRangeSelector>;

export const LabResultsTrend: Story = {
  name: 'Lab results trend',
  args: {
    label: 'Lab results',
    presets: labResultsPresets,
    defaultStart: daysAgoIso(30),
    defaultEnd: today,
  },
};

export const ChemoCycleExport: Story = {
  name: 'Chemo cycle export',
  args: {
    label: 'Treatment cycle',
    presets: chemoCyclePresets,
    defaultStart: '2026-05-01',
    defaultEnd: '2026-05-28',
  },
};

export const CustomSurveillanceWindow: Story = {
  name: 'Custom surveillance window',
  args: {
    label: 'Surveillance imaging',
    presets: [
      {
        id: '6mo',
        label: 'Last 6 months',
        start: daysAgoIso(180),
        end: today,
      },
      {
        id: '12mo',
        label: 'Last 12 months',
        start: daysAgoIso(365),
        end: today,
      },
    ],
    defaultStart: daysAgoIso(90),
    defaultEnd: today,
  },
};
