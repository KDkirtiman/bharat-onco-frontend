import type { Meta, StoryObj } from '@storybook/react';
import { PatientHeaderCard } from '../PatientHeaderCard';
import { fixturePatient, fixtureVitals } from '@storybook/fixtures';
import { mockStagingRecords } from 'bfd-core';

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
