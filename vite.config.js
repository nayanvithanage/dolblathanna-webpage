import { defineConfig } from 'vite';
import { resolve } from 'path';
import { readdirSync } from 'fs';

// Every page in these folders is a build entry automatically, so a new guide or product page can
// never be left out of the production build by forgetting to register it here.
const PAGE_DIRS = ['guides', 'products', 'stay'];

const pageInputs = {};
for (const dir of PAGE_DIRS) {
  for (const file of readdirSync(resolve(__dirname, dir))) {
    if (file.endsWith('.html')) {
      pageInputs[`${dir}/${file.replace(/\.html$/, '')}`] = resolve(__dirname, dir, file);
    }
  }
}

export default defineConfig({
  // Set the base to '/' for custom domains,
  // or '/repo-name/' for github.io domains.
  // Use relative base for asset paths to support subpaths
  base: './',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        ...pageInputs,
      },
    },
  },
});
