import type { Meta, StoryObj } from '@storybook/react';
import { Header } from './Header';
import { fixtureUser, fixturePatient } from '../../stories/fixtures';

const meta: Meta<typeof Header> = {
  title: 'Layout/Header',
  component: Header,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<typeof Header>;

export const Staff: Story = {
  args: {
    user: fixtureUser,
    patients: [fixturePatient],
    onMenuToggle: () => {},
    onLogout: () => {},
    onRegisterPatient: () => {},
    onBookAppointment: () => {},
    onGenerateInvoice: () => {},
    onPatientSelect: () => {},
  },
};
