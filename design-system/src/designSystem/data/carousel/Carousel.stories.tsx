import type { Meta, StoryObj } from '@storybook/react';
import { action } from 'storybook/actions';

import { Carousel } from './Carousel';
const slides = [
  { id: '1', content: 'Schedule your consultation with our oncology team.', label: 'Consultation' },
  { id: '2', content: 'Review personalized treatment options.', label: 'Treatment' },
  { id: '3', content: 'Track progress and follow-up appointments.', label: 'Follow-up' },
];

const meta: Meta<typeof Carousel> = {
  tags: ['autodocs'],
  title: 'Data/Carousel',
  component: Carousel,
    parameters: {
    docs: {
      description: { component: "**Carousel** is part of the Data catalog. It is styled only with semantic `--ds-*` tokens so your product theme can override colors and typography without changing component code." },
      subtitle: "Carousel component",
      guide: {
  "whenToUse": [
    "Use **Carousel** in data flows where this UI pattern is needed.",
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
      "description": "Baseline Carousel configuration.",
      "story": "Default"
    }
  ]
},
    },
    liveCode: `render(
  <Carousel items={[<Card key="1">Slide 1</Card>, <Card key="2">Slide 2</Card>]} />
);`,
        usageCode: `import { Card, Carousel } from '@/designSystem';

export function Example() {
  return (
    <Carousel items={[<Card key="1">Slide 1</Card>, <Card key="2">Slide 2</Card>]} />
  );
}`,
  },
  args: { slides, onValueChange: action('onValueChange') },
  argTypes: {
    className: { description: "Additional CSS classes merged onto the root element." },
  },
};
export default meta;
type Story = StoryObj<typeof Carousel>;

export const Default: Story = {};

export const AutoPlay: Story = {
  args: { autoPlay: true, autoPlayInterval: 3000 },
};
