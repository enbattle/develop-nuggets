/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  base: '/develop-nuggets/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: true,
    // Only our own suite — not test files inside `.claude/worktrees/` copies
    // that background agents create while working on this branch.
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
  },
});
