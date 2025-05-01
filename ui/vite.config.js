import { defineConfig } from 'vite';

export default defineConfig({
  root: './frontend',  // Ensure the root is correctly set to 'frontend' folder
  build: {
    outDir: './frontend/build',  // Specify the output directory for the build
    rollupOptions: {
      input: './frontend/index.html', // Explicitly specify entry HTML file
    },
  },
});
