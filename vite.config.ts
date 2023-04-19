import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import svgrPlugin from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: 'build',
  },
  resolve: {
    alias: {
      process: 'process/browser',
      buffer: 'buffer',
      crypto: 'crypto-browserify',
      stream: 'stream-browserify',
      assert: 'assert',
      http: 'stream-http',
      https: 'https-browserify',
      os: 'os-browserify',
      url: 'url',
      util: 'util',
    },
  },
  server: {
    port: 3000,
  },
  plugins: [react(), viteTsconfigPaths(), svgrPlugin()],
});
