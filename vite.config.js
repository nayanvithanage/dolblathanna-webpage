import { defineConfig } from 'vite';

export default defineConfig({
  // Set the base to '/' for custom domains, 
  // or '/repo-name/' for github.io domains.
  base: '/',
  build: {
    outDir: 'dist',
  },
});
