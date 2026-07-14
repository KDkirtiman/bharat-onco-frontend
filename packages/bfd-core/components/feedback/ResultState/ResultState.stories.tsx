import type { Meta, StoryObj } from '@storybook/react';
import { CheckCircle2 } from 'bfd-icons';
import { ResultState } from './ResultState';

const meta: Meta<typeof ResultState> = {
  title: 'Feedback/ResultState',
  component: ResultState,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ResultState>;

export const Success: Story = {
  render: () => (
    <ResultState
      icon={<CheckCircle2 size={32} className="text-success-emphasis-mid" />}
      title="Appointment Confirmed"
      onAction={() => {}}
      summary={
        <>
          <p className="text-sm font-semibold text-foreground">Jane Doe <span className="font-normal text-muted-foreground">· MRN-001</span></p>
          <p className="text-sm text-foreground">Follow-up · Dr. Sharma</p>
          <p className="text-sm text-foreground">04 July 2026 · 10:30 AM</p>
        </>
      }
    />
  ),
};
