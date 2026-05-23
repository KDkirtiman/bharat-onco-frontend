import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '../../core/button/Button';
import { Snackbar, SnackbarProvider, useSnackbar } from './Snackbar';
const meta: Meta<typeof Snackbar> = {
  tags: ['autodocs'],
  title: 'Feedback/Snackbar',
  component: Snackbar,
    parameters: {
    docs: {
      description: { component: "**Snackbar** is part of the Feedback catalog. It is styled only with semantic `--ds-*` tokens so your product theme can override colors and typography without changing component code." },
      subtitle: "Snackbar component",
      guide: {
  "whenToUse": [
    "Use **Snackbar** in feedback flows where this UI pattern is needed.",
    "Prefer composing with other design-system primitives rather than custom markup."
  ],
  "capabilities": [
    "Themeable via CSS variables (`ThemeProvider` or token overrides)",
    "`className` and standard HTML/React props passthrough where applicable",
    "Multiple stories demonstrating states and variants"
  ],
  "scenarios": [
    {
      "title": "Default",
      "description": "Baseline Snackbar configuration.",
      "story": "Default"
    }
  ]
},
    },
    liveCode: `function Demo() {
  const { show } = useSnackbar();
  return <Button onClick={() => show({ message: 'Saved!', tone: 'success' })}>Toast</Button>;
}
render(<SnackbarProvider><Demo /></SnackbarProvider>);`,
        usageCode: `import { Button, Demo, Snackbar, SnackbarProvider, useSnackbar } from '@/designSystem';

function Demo() {
  const { show } = useSnackbar(
  return <Button onClick={() => show({ message: 'Saved!', tone: 'success' })}>Toast</Button>;
}
<SnackbarProvider><Demo /></SnackbarProvider>);`,
  },
  argTypes: {
    className: { description: "Additional CSS classes merged onto the root element." },
  },
};
export default meta;
type Story = StoryObj<typeof Snackbar>;

function SnackbarDemo() {
  const { show } = useSnackbar();
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      <Button
        onClick={() =>
          show({ message: 'Changes saved successfully.', tone: 'success' })
        }
      >
        Success
      </Button>
      <Button
        variant="secondary"
        onClick={() =>
          show({
            message: 'Connection lost. Retrying…',
            tone: 'warning',
            autoHideDuration: 8000,
          })
        }
      >
        Warning
      </Button>
      <Button
        variant="ghost"
        onClick={() =>
          show({
            message: 'Unable to delete record.',
            tone: 'danger',
            action: <Button size="sm" variant="ghost">Retry</Button>,
          })
        }
      >
        With action
      </Button>
    </div>
  );
}

export const Queue: Story = {
  render: () => (
    <SnackbarProvider>
      <SnackbarDemo />
    </SnackbarProvider>
  ),
};

export const Positions: Story = {
  render: function SnackbarPositions() {
    const { show } = useSnackbar();
    return (
      <Button onClick={() => show({ message: 'Top-right snackbar', tone: 'info' })}>
        Show top-right
      </Button>
    );
  },
  decorators: [
    (Story) => (
      <SnackbarProvider position="top-right">
        <Story />
      </SnackbarProvider>
    ),
  ],
};
