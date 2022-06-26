import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import {
  generateRoutesDefinition,
  initWatcher,
} from './src/lib/routing/script/generate-routes.js';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svelte(),
    {
      name: 'routes-generator',
      configureServer(vite) {
        initWatcher(vite.watcher);
      },
      buildStart() {
        generateRoutesDefinition();
      },
    },
  ],
});
