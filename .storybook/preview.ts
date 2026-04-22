import type { Preview } from '@storybook/react';
import '../src/styles/aios-theme.css';

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#0f0f13' },
        { name: 'light', value: '#ffffff' },
      ],
    },
    layout: 'centered',
  },
};

export default preview;
