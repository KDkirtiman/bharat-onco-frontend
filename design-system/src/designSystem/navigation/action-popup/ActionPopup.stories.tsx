import type { Meta, StoryObj } from '@storybook/react';
import { useRef, useState } from 'react';

import { Button } from '../../core/button/Button';

import { ActionPopup } from './ActionPopup';
const meta: Meta<typeof ActionPopup> = {
  tags: ['autodocs'],
  title: 'Navigation/ActionPopup',
  component: ActionPopup,
    parameters: {
    docs: {
      description: { component: "**ActionPopup** is part of the Navigation catalog. It is styled only with semantic `--ds-*` tokens so your product theme can override colors and typography without changing component code." },
      subtitle: "ActionPopup component",
      guide: {
  "whenToUse": [
    "Use **ActionPopup** in navigation flows where this UI pattern is needed.",
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
      "description": "Baseline ActionPopup configuration.",
      "story": "Default"
    }
  ]
},
    },
    liveCode: `render(
  <ActionPopup trigger={<Button variant="secondary">Open</Button>}>
    <Button variant="ghost">Item 1</Button>
  </ActionPopup>
);`,
        usageCode: `import { ActionPopup, Button } from '@/designSystem';

export function Example() {
  return (
    <ActionPopup trigger={<Button variant="secondary">Open</Button>}>
        <Button variant="ghost">Item 1</Button>
      </ActionPopup>
  );
}`,
  },
  argTypes: {
    className: { description: "Additional CSS classes merged onto the root element." },
  },
};
export default meta;
type Story = StoryObj<typeof ActionPopup>;

export const Default: Story = {
  render: function PopupDemo() {
    const anchorRef = useRef<HTMLDivElement>(null);
    const [open, setOpen] = useState(false);

    return (
      <div ref={anchorRef} style={{ display: 'inline-block' }}>
        <Button variant="secondary" onClick={() => setOpen((v) => !v)}>
          Toggle popup
        </Button>
        <ActionPopup anchorRef={anchorRef} open={open} onClose={() => setOpen(false)}>
          <div style={{ padding: 8, fontSize: 14 }}>Popup content anchored to trigger.</div>
        </ActionPopup>
      </div>
    );
  },
};
