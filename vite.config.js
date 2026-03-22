import { defineConfig } from 'vite';

export default defineConfig({
  // Set the base to '/' for custom domains, 
  // or '/repo-name/' for github.io domains.
  // Use relative base for asset paths to support subpaths
  base: './',
  build: {
    outDir: 'dist',
  },
});
