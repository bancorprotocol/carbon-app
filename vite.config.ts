import { defineConfig, loadEnv, PluginOption } from 'vite';
import react from '@vitejs/plugin-react';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import svgrPlugin from 'vite-plugin-svgr';
import { sentryVitePlugin } from '@sentry/vite-plugin';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');

  const plugins: PluginOption[] = [react(), viteTsconfigPaths(), svgrPlugin()];

  // Put the Sentry vite plugin after all other plugins
  if (env.SENTRY_ORG && env.SENTRY_PROJECT && env.SENTRY_AUTH_TOKEN) {
    plugins.push(
      sentryVitePlugin({
        org: env.SENTRY_ORG,
        project: env.SENTRY_PROJECT,

        // Auth tokens can be obtained from https://sentry.io/settings/account/api/auth-tokens/
        // and need `project:releases` and `org:read` scopes
        authToken: env.SENTRY_AUTH_TOKEN,

        sourcemaps: {
          // Specify the directory containing build artifacts
          assets: './build/**',
        },

        // Use the following option if you're on an SDK version lower than 7.47.0:
        // include: "./dist",

        // Optionally uncomment the line below to override automatic release name detection
        // release: env.RELEASE,
      })
    );
  }

  return {
    build: {
      outDir: 'build',
      sourcemap: !!(
        env.SENTRY_ORG &&
        env.SENTRY_PROJECT &&
        env.SENTRY_AUTH_TOKEN
      ),
    },
    resolve: {
      alias: {
        process: 'process/browser',
        buffer: 'buffer',
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
    plugins,
  };
});
