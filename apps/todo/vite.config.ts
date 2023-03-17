/// <reference types="vitest" />

import { defineConfig } from 'vite';
import analog from '@analogjs/platform';
import { offsetFromRoot } from '@nrwl/devkit';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    publicDir: 'src/assets',
    server: {
      port: 3000,
    },
    build: {
      outDir: `${offsetFromRoot('apps/todo')}/dist/apps/todo`,
      emptyOutDir: true,
      target: ['es2020'],
    },
    resolve: {
      mainFields: ['module'],
    },
    plugins: [
      analog({
        vite: {
          tsconfig: 'apps/todo/tsconfig.app.json',
          inlineStylesExtension: 'css',
        },
        nitro: {
          rootDir: 'apps/todo',
        },
      }),
      tsconfigPaths(),
    ],
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['test-setup.ts'],
      include: ['**/*.spec.ts'],
      cache: {
        dir: `${offsetFromRoot('apps/todo')}/node_modules/.vitest`,
      },
    },
    define: {
      'import.meta.vitest': mode !== 'production',
    },
  };
});
