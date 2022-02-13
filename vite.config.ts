import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path';

// Get the node.js current corking directory.  This should be the top of the project
const cwd = process.cwd();

export default defineConfig({
  // Vite needs to know that the root project was moved to "src/renderer"
  root: path.join(cwd, 'src', 'renderer'),

  // Support having fixed assets in "src/render/public"
  publicDir: 'public',

  // Prevent launch of a browser when the Vite server starts
  server: {
    open: false,
  },

  // Specify the output directory as "build/renderer"
  // Also, empty the build directory before running a build.
  build: {
    outDir: path.join(cwd, 'build', 'renderer'),
    emptyOutDir: true,
  },

  // Inform Vite about the plugins available during a build.
  plugins: [vue()],

  // Ensure that @ works as expected in imports
  resolve: {
    alias: {
      '@': path.join(cwd, 'src', 'renderer')

    }
  }
});