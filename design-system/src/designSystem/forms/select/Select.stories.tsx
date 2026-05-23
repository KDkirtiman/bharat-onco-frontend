import type { Meta, StoryObj } from '@storybook/react';
import { action } from 'storybook/actions';
import { expect, userEvent, within, screen } from 'storybook/test';
import { useState } from 'react';

import { Label } from '../label/Label';
import { Select, SelectItem } from './Select';
type SelectFixtureOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

const patientCaseStatuses: SelectFixtureOption[] = [
  { value: 'active', label: 'Active treatment' },
  { value: 'follow-up', label: 'Surveillance / follow-up' },
  { value: 'awaiting-mdt', label: 'Awaiting MDT review' },
  { value: 'on-hold', label: 'On hold (patient request)' },
  { value: 'discharged', label: 'Discharged from service' },
];

const treatingClinicians: SelectFixtureOption[] = [
  { value: 'dr-sharma', label: 'Dr. Ananya Sharma — Medical oncology' },
  { value: 'dr-patel', label: 'Dr. Rohan Patel — Radiation oncology' },
  { value: 'dr-iyer', label: 'Dr. Meera Iyer — Surgical oncology' },
  { value: 'dr-khan', label: 'Dr. Farah Khan — Palliative care' },
  { value: 'dr-naidu', label: 'Dr. Vikram Naidu — Clinical haematology' },
  { value: 'dr-desai', label: 'Dr. Priya Desai — Nuclear medicine' },
  { value: 'dr-menon', label: 'Dr. Arjun Menon — Medical oncology' },
  { value: 'dr-roy', label: 'Dr. Kavita Roy — Radiation oncology' },
  { value: 'dr-singh', label: 'Dr. Harpreet Singh — Surgical oncology' },
  { value: 'dr-joshi', label: 'Dr. Neha Joshi — Medical oncology (trial lead)' },
];

const trialBiomarkerFilters: SelectFixtureOption[] = [
  { value: 'her2-positive', label: 'HER2 positive' },
  { value: 'egfr-mutant', label: 'EGFR mutation' },
  { value: 'alk-fusion', label: 'ALK fusion' },
  { value: 'pd-l1-high', label: 'PD-L1 ≥ 50%' },
  { value: 'brca1-2', label: 'BRCA1/2 pathogenic' },
  { value: 'msi-high', label: 'MSI-high / dMMR' },
  { value: 'kras-g12c', label: 'KRAS G12C' },
];

function SelectItemsFromOptions(options: SelectFixtureOption[]) {
  return options.map((option) => (
    <SelectItem key={option.value} value={option.value} disabled={option.disabled}>
      {option.label}
    </SelectItem>
  ));
}

const meta: Meta<typeof Select> = {
  tags: ['autodocs'],
  title: 'Forms/Select',
  component: Select,
  parameters: {
    docs: {
      description: {
        component:
          'Keyboard-accessible custom select for clinical workflows: case filters, clinician lookup, and multi-criteria trial matching. Compose options with `SelectItem` children (including fragments). Dropdown renders in a portal and closes on outside click or scroll.',
      },
      subtitle: 'Single and multi-select for filters and form fields',
      guide: {
        whenToUse: [
          'Filtering patient registries, worklists, and lab queues by status, site, or clinician.',
          'Choosing one value in intake forms when a native `<select>` is too limited (search, disabled options, custom styling).',
          'Multi-select biomarker or protocol tags when matching patients to trials or pathways.',
        ],
        capabilities: [
          '`searchable` for long clinician and drug lists',
          '`multiple` for trial / pathway filters',
          '`displaySelectedAs="chips"` with `maxVisibleChips` + `+N more` overflow (keeps trigger one line)',
          'Disabled options (e.g. closed wards or unavailable slots)',
          'Controlled `value` + `onValueChange` for wizard steps and server-backed forms',
          'Portal-positioned menu with outside-click and scroll dismiss',
        ],
        scenarios: [
          {
            title: 'Patient case status filter',
            story: 'Default',
            description:
              'Default pattern on the patient list: narrow to active, follow-up, or MDT-pending cases.',
          },
          {
            title: 'Searchable treating clinician',
            story: 'Searchable',
            description: 'Type to find an oncologist in a long roster before assigning or reassigning care.',
          },
          {
            title: 'Trial biomarker filters',
            story: 'Multiple',
            description: 'Multi-select molecular criteria when screening patients for open trials.',
          },
          {
            title: 'Trial biomarkers as chips',
            story: 'MultipleChips',
            description:
              'Chip display with overflow: first two tags visible, then `+N more`. Open the menu to review or change all selections.',
          },
          {
            title: 'Locked after sign-off',
            story: 'Disabled',
            description: 'Read-only select when the chart is signed and the field must not be edited.',
          },
          {
            title: 'Controlled form field',
            story: 'Controlled',
            description: 'Parent state drives value—use for steppers, autosave, or validation gates.',
          },
        ],
      },
    },
    liveCode: `render(
  <div style={{ maxWidth: 360 }}>
    <Label htmlFor="case-status" id="case-status-label">Case status</Label>
    <Select id="case-status" aria-labelledby="case-status-label" placeholder="All statuses" defaultValue="active">
      <SelectItem value="active">Active treatment</SelectItem>
      <SelectItem value="follow-up">Surveillance / follow-up</SelectItem>
      <SelectItem value="awaiting-mdt">Awaiting MDT review</SelectItem>
    </Select>
  </div>
);`,
    usageCode: `import { Label, Select, SelectItem } from '@/designSystem';

export function PatientListFilters() {
  return (
    <div>
      <Label htmlFor="case-status" id="case-status-label">Case status</Label>
      <Select
        id="case-status"
        aria-labelledby="case-status-label"
        placeholder="All statuses"
        defaultValue="active"
        onValueChange={(value) => console.log('Filter:', value)}
      >
        <SelectItem value="active">Active treatment</SelectItem>
        <SelectItem value="follow-up">Surveillance / follow-up</SelectItem>
        <SelectItem value="awaiting-mdt">Awaiting MDT review</SelectItem>
        <SelectItem value="discharged">Discharged from service</SelectItem>
      </Select>
    </div>
  );
}`,
  },
  args: {
    placeholder: 'Choose…',
    onValueChange: action('onValueChange'),
  },
  argTypes: {
    value: { description: 'Controlled selected value, or array when `multiple`.' },
    defaultValue: { description: 'Initial value for uncontrolled usage.' },
    onValueChange: { description: 'Called with the new value when selection changes.' },
    placeholder: { description: 'Shown when nothing is selected.' },
    searchable: { description: 'Enables in-menu text filter (use for long lists).' },
    multiple: { description: 'Allow selecting more than one option.' },
    displaySelectedAs: {
      description: 'When `multiple`, render selections as chips (`chips`) or comma-separated text (`text`, default).',
      control: 'radio',
      options: ['text', 'chips'],
    },
    maxVisibleChips: {
      description: 'With chip display, how many tags fit in the trigger before showing `+N more` (default 2).',
      control: { type: 'number', min: 0, max: 10 },
    },
    disabled: { description: 'Prevents opening the menu and changing value.' },
    'aria-label': { description: 'Accessible name when no visible label is wired with `aria-labelledby`.' },
  },
};

export default meta;
type Story = StoryObj<typeof Select>;

const dropdownCanvas = { maxWidth: 420, minHeight: 280, paddingBottom: 24 } as const;

export const Default: Story = {
  name: 'Patient case status',
  render: (args) => (
    <div style={dropdownCanvas}>
      <Label htmlFor="patient-case-status" id="patient-case-status-label">Case status</Label>
      <Select
        {...args}
        id="patient-case-status"
        aria-labelledby="patient-case-status-label"
        placeholder="All statuses"
        defaultValue="active"
      >
        {SelectItemsFromOptions(patientCaseStatuses)}
      </Select>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('combobox'));
    await userEvent.click(await screen.findByRole('option', { name: /surveillance/i }));
    await expect(canvas.getByRole('combobox')).toHaveTextContent(/surveillance/i);
  },
};

export const Searchable: Story = {
  name: 'Searchable clinician',
  render: (args) => (
    <div style={dropdownCanvas}>
      <Label htmlFor="treating-clinician" id="treating-clinician-label">Treating clinician</Label>
      <Select
        {...args}
        id="treating-clinician"
        aria-labelledby="treating-clinician-label"
        searchable
        placeholder="Search oncologist…"
        defaultValue="dr-sharma"
      >
        {SelectItemsFromOptions(treatingClinicians)}
      </Select>
    </div>
  ),
};

export const Multiple: Story = {
  name: 'Trial biomarker filters',
  render: (args) => (
    <div style={dropdownCanvas}>
      <Label htmlFor="biomarker-filter" id="biomarker-filter-label">Trial eligibility — biomarkers</Label>
      <Select
        {...args}
        id="biomarker-filter"
        aria-labelledby="biomarker-filter-label"
        multiple
        placeholder="Add biomarker criteria…"
        defaultValue={['her2-positive', 'pd-l1-high']}
      >
        {SelectItemsFromOptions(trialBiomarkerFilters)}
      </Select>
    </div>
  ),
};

export const MultipleChips: Story = {
  name: 'Trial biomarkers (chips)',
  render: (args) => (
    <div style={dropdownCanvas}>
      <Label htmlFor="biomarker-filter-chips" id="biomarker-filter-chips-label">Trial eligibility — biomarkers</Label>
      <Select
        {...args}
        id="biomarker-filter-chips"
        aria-labelledby="biomarker-filter-chips-label"
        multiple
        displaySelectedAs="chips"
        placeholder="Add biomarker criteria…"
        defaultValue={['her2-positive', 'pd-l1-high', 'egfr-mutant', 'brca1-2']}
      >
        {SelectItemsFromOptions(trialBiomarkerFilters)}
      </Select>
    </div>
  ),
};

export const Disabled: Story = {
  name: 'Locked after sign-off',
  render: (args) => (
    <div style={dropdownCanvas}>
      <Label htmlFor="signed-ward" id="signed-ward-label">Ward (signed record)</Label>
      <Select
        {...args}
        id="signed-ward"
        aria-labelledby="signed-ward-label"
        disabled
        defaultValue="inpatient-ward"
      >
        <SelectItem value="daycare-chemo">Day-care — Chemotherapy unit</SelectItem>
        <SelectItem value="inpatient-ward">Inpatient oncology ward</SelectItem>
        <SelectItem value="palliative-suite">Palliative care suite</SelectItem>
      </Select>
    </div>
  ),
};

export const Controlled: Story = {
  name: 'Controlled form field',
  render: function ControlledCaseStatus() {
    const [status, setStatus] = useState('awaiting-mdt');
    return (
      <div style={dropdownCanvas}>
        <Label htmlFor="controlled-status" id="controlled-status-label">Update case status</Label>
        <Select
          id="controlled-status"
          aria-labelledby="controlled-status-label"
          placeholder="Select status…"
          value={status}
          onValueChange={(next) => setStatus(String(next))}
        >
          {SelectItemsFromOptions(patientCaseStatuses)}
        </Select>
        <p style={{ marginTop: 8, fontSize: 14, color: 'var(--ds-color-muted)' }}>
          Saving to chart: <strong>{status}</strong>
        </p>
      </div>
    );
  },
};
