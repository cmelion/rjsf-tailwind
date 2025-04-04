// .storybook/preview.ts
import type { Preview } from '@storybook/react'
import '../src/index.css';
import { worker } from '../src/mocks/browser';

// Initialize MSW once at the Storybook level
const initMSW = async () => {
  if (typeof window !== 'undefined') {
    return worker.start({
      serviceWorker: {
        url: '/mockServiceWorker.js',
      },
      onUnhandledRequest: 'bypass',
    });
  }
};

// Start MSW before any stories load
initMSW().then(() => console.log('MSW initialized at Storybook level'));

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;