import type { Meta, StoryObj } from '@storybook/react';
import { action } from 'storybook/actions';

import { DualSelect } from './DualSelect';
const careSites = [
  { value: 'opd-oncology', label: 'OPD — Oncology clinic' },
  { value: 'daycare-chemo', label: 'Day-care — Chemotherapy unit' },
  { value: 'radiation-bunker', label: 'Radiation therapy bunker' },
  { value: 'inpatient-ward', label: 'Inpatient oncology ward' },
  { value: 'palliative-suite', label: 'Palliative care suite' },
];

const appointmentSlots = [
  { value: 'today-am', label: 'Today — morning (8:00–12:00)' },
  { value: 'today-pm', label: 'Today — afternoon (14:00–18:00)' },
  { value: 'tomorrow-am', label: 'Tomorrow — morning' },
  { value: 'tomorrow-pm', label: 'Tomorrow — afternoon' },
];

const visitTypes = [
  { value: 'new-consult', label: 'New consultation' },
  { value: 'follow-up', label: 'Follow-up review' },
  { value: 'chemo-day', label: 'Chemotherapy administration' },
  { value: 'radiation-plan', label: 'Radiation planning session' },
  { value: 'mdt', label: 'MDT presentation' },
];

const treatmentPhases = [
  { value: 'neoadjuvant', label: 'Neoadjuvant' },
  { value: 'adjuvant', label: 'Adjuvant' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'palliative', label: 'Palliative intent' },
];

const meta: Meta<typeof DualSelect> = {
  tags: ['autodocs'],
  title: 'Forms/DualSelect',
  component: DualSelect,
  parameters: {
    docs: {
      description: {
        component:
          'Pairs two `Select` fields for dependent clinical choices—e.g. appointment window plus visit type, or treatment phase plus care site. Built on the same select behaviour (portal menu, keyboard, searchable lists).',
      },
      subtitle: 'Two linked selects for scheduling and routing',
      guide: {
        whenToUse: [
          'Booking flows where slot and visit type are chosen together.',
          'Routing treatment to the correct site after phase selection.',
          'Any “from → to” or “when → what” pattern in oncology operations.',
        ],
        capabilities: [
          'Independent left/right values with `onLeftChange` / `onRightChange`',
          'Passes through `Select` features (searchable lists via options length)',
          'Shared disabled state for read-only review screens',
        ],
        scenarios: [
          {
            title: 'Schedule appointment',
            story: 'ScheduleAppointment',
            description: 'Pick a day part, then the visit type (consult, chemo day, MDT, etc.).',
          },
          {
            title: 'Treatment phase and site',
            story: 'TreatmentPhaseAndSite',
            description: 'Choose intent of therapy and where it will be delivered.',
          },
        ],
      },
    },
    liveCode: `render(
  <DualSelect
    leftLabel="Appointment window"
    rightLabel="Visit type"
    leftOptions={[
      { value: 'today-am', label: 'Today — morning (8:00–12:00)' },
      { value: 'today-pm', label: 'Today — afternoon (14:00–18:00)' },
    ]}
    rightOptions={[
      { value: 'follow-up', label: 'Follow-up review' },
      { value: 'chemo-day', label: 'Chemotherapy administration' },
    ]}
    defaultLeftValue="today-am"
    defaultRightValue="follow-up"
  />
);`,
    usageCode: `import { DualSelect } from '@/designSystem';

const slots = [
  { value: 'today-am', label: 'Today — morning (8:00–12:00)' },
  { value: 'today-pm', label: 'Today — afternoon (14:00–18:00)' },
];

const visits = [
  { value: 'follow-up', label: 'Follow-up review' },
  { value: 'chemo-day', label: 'Chemotherapy administration' },
];

export function BookAppointmentSelects() {
  return (
    <DualSelect
      leftLabel="Appointment window"
      rightLabel="Visit type"
      leftOptions={slots}
      rightOptions={visits}
      defaultLeftValue="today-am"
      defaultRightValue="follow-up"
      onLeftChange={(slot) => console.log('Slot', slot)}
      onRightChange={(type) => console.log('Visit', type)}
    />
  );
}`,
  },
  args: {
    onLeftChange: action('onLeftChange'),
    onRightChange: action('onRightChange'),
  },
  argTypes: {
    leftLabel: { description: 'Visible label for the first select.' },
    rightLabel: { description: 'Visible label for the second select.' },
    leftOptions: { description: 'Options for the first select.', control: false },
    rightOptions: { description: 'Options for the second select.', control: false },
    disabled: { description: 'Disables both selects.' },
  },
};

export default meta;
type Story = StoryObj<typeof DualSelect>;

export const ScheduleAppointment: Story = {
  name: 'Schedule appointment',
  args: {
    leftLabel: 'Appointment window',
    rightLabel: 'Visit type',
    leftOptions: appointmentSlots,
    rightOptions: visitTypes,
    defaultLeftValue: 'today-am',
    defaultRightValue: 'chemo-day',
  },
};

export const TreatmentPhaseAndSite: Story = {
  name: 'Treatment phase and site',
  args: {
    leftLabel: 'Treatment phase',
    rightLabel: 'Care site',
    leftOptions: treatmentPhases,
    rightOptions: careSites,
    defaultLeftValue: 'adjuvant',
    defaultRightValue: 'daycare-chemo',
  },
};
