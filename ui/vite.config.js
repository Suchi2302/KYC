import { defineConfig } from 'vite';

export default defineConfig({
  root: './',  // Ensure the root is correctly set to 'frontend' folder
  build: {
    outDir: './build',  // Specify the output directory for the build
    rollupOptions: {
      input: './index.html', // Explicitly specify entry HTML file
    },
  },
});
