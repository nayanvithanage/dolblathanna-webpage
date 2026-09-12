import { defineConfig } from 'vite';
import { resolve } from 'path';

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
        guidesIndex: resolve(__dirname, 'guides/index.html'),
        guideSurf: resolve(__dirname, 'guides/best-time-to-surf-ahangama.html'),
        guideGettingAround: resolve(__dirname, 'guides/getting-around-ahangama.html'),
        guideBeaches: resolve(__dirname, 'guides/top-beaches-near-ahangama.html'),
        guideDayTrips: resolve(__dirname, 'guides/ahangama-day-trip-guide.html'),
        guidePacking: resolve(__dirname, 'guides/sri-lanka-beach-packing-guide.html'),
        guideVsWeligama: resolve(__dirname, 'guides/ahangama-vs-weligama.html'),
        guideCafes: resolve(__dirname, 'guides/best-cafes-restaurants-ahangama.html'),
        guideInsurance: resolve(__dirname, 'guides/sri-lanka-travel-insurance-guide.html'),
        guideGalleFort: resolve(__dirname, 'guides/galle-fort-travel-guide.html'),
        guideMirissaWhales: resolve(__dirname, 'guides/mirissa-whale-watching-guide.html'),
        guideWeligamaNomad: resolve(__dirname, 'guides/weligama-surf-digital-nomad-guide.html'),
        guideCoastalTrain: resolve(__dirname, 'guides/coastal-train-galle-matara.html'),
      },
    },
  },
});
