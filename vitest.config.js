import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: [],
    include: ['__tests__/smoke/**/*.test.{js,jsx}'],
    testTimeout: 15000,
    hookTimeout: 10000,
    reporters: ['verbose'],
    // Smoke tests must complete in under 2 minutes
    pool: 'forks',
    // Vitest 4: poolOptions moved to top-level
    singleFork: false,
  },
});
