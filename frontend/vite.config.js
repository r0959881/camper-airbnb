import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'fast-deep-equal': 'fast-deep-equal/es6', // 🔁 Redirect default usage
    },
  },
});
