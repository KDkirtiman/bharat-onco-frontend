import type { Meta, StoryObj } from '@storybook/react';
import { GenerateInvoiceOverlay } from './GenerateInvoiceOverlay';
import { fixtureAppointment, fixtureDoctor, fixturePatient } from '@storybook/fixtures';
import { hideArgs, overlayStoryParameters } from '@storybook/overlay-params';

const meta: Meta<typeof GenerateInvoiceOverlay> = {
  title: 'Patterns/Billing/GenerateInvoiceOverlay',
  component: GenerateInvoiceOverlay,
  tags: ['autodocs'],
  parameters: overlayStoryParameters,
  argTypes: {
    ...hideArgs(['appointment', 'patient', 'doctor'], 'Data'),
    ...hideArgs(['onConfirm', 'onClose'], 'Events'),
  },
};

export default meta;
type Story = StoryObj<typeof GenerateInvoiceOverlay>;

export const Default: Story = {
  args: {
    appointment: fixtureAppointment,
    patient: fixturePatient,
    doctor: fixtureDoctor,
    onConfirm: () => {},
    onClose: () => {},
  },
};
