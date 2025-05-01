import { defineConfig } from 'vite';

export default defineConfig({
  root: './ui',  // Ensure the root is correctly set to 'frontend' folder
  build: {
    outDir: './ui/build',  // Specify the output directory for the build
    rollupOptions: {
      input: './ui/index.html', // Explicitly specify entry HTML file
    },
  },
});
