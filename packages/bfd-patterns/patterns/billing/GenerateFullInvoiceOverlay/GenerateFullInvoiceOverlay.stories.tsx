import type { Meta, StoryObj } from '@storybook/react';
import { GenerateFullInvoiceOverlay } from './GenerateFullInvoiceOverlay';
import {
  fixtureCostEstimates,
  fixturePatient,
  fixturePatients,
} from '@storybook/fixtures';
import { hideArgs, overlayStoryParameters } from '@storybook/overlay-params';

const meta: Meta<typeof GenerateFullInvoiceOverlay> = {
  title: 'Patterns/Billing/GenerateFullInvoiceOverlay',
  component: GenerateFullInvoiceOverlay,
  tags: ['autodocs'],
  parameters: overlayStoryParameters,
  argTypes: {
    ...hideArgs(['patients', 'costEstimates'], 'Data'),
    ...hideArgs(['onSave', 'onClose'], 'Events'),
  },
};

export default meta;
type Story = StoryObj<typeof GenerateFullInvoiceOverlay>;

export const Default: Story = {
  args: {
    selectedCenter: 'Kurukshetra',
    patients: fixturePatients,
    userRole: 'staff',
    centerInvoiceCount: 42,
    costEstimates: fixtureCostEstimates,
    onSave: () => {},
    onClose: () => {},
  },
};

export const WithPatientPrefill: Story = {
  args: {
    ...Default.args,
    prefill: {
      patientId: fixturePatient.id,
      patientName: fixturePatient.name,
      payorType: 'insurance',
      insuranceTpaName: fixturePatient.payor.insurance?.name ?? 'Star Health',
    },
  },
};
