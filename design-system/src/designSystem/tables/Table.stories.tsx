import type { Meta, StoryObj } from '@storybook/react';

import { PatientListDemo } from '../pages/PatientListDemo';

const meta: Meta = {
  title: 'Tables/Data table',
  parameters: {
    docs: {
      description: {
        component:
          'Interactive example: search filters rows, pagination slices results, actions log to the **Actions** panel. Full-page shell: **Pages / Patients — full app shell**.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

/** Same interactive demo as the composition page; kept here for the Tables sidebar. */
export const PatientListInteractive: Story = {
  render: () => <PatientListDemo />,
};
