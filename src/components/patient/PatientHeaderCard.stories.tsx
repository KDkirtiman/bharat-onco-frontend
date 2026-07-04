import type { Meta, StoryObj } from '@storybook/react';
import { PatientHeaderCard } from './PatientHeaderCard';
import { fixturePatient, fixtureVitals } from '../../stories/fixtures';
import { mockStagingRecords } from '../../datapoints/staging';

const meta: Meta<typeof PatientHeaderCard> = {
  title: 'Patient/PatientHeaderCard',
  component: PatientHeaderCard,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof PatientHeaderCard>;

export const Default: Story = {
  args: {
    patient: fixturePatient,
    latestVitals: fixtureVitals,
    latestStaging: mockStagingRecords.find(s => s.patientId === fixturePatient.id),
  },
};
