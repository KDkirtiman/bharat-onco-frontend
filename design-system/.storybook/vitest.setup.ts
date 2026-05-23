import { setProjectAnnotations } from '@storybook/react-vite';

import * as previewAnnotations from './preview';

setProjectAnnotations([
  previewAnnotations,
  {
    parameters: {
      a11y: {
        test: 'error',
      },
    },
  },
]);
