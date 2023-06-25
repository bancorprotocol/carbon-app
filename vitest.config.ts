import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['@vitest/web-worker'],
  },
  plugins: [tsconfigPaths()],
});
