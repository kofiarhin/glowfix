import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 4000,
    host: true
  },
  preview: {
    port: 4000,
    host: true
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.js'],
    coverage: {
      reporter: ['text', 'lcov'],
      statements: 100,
      branches: 100,
      functions: 100,
      lines: 100
    }
  }
});
