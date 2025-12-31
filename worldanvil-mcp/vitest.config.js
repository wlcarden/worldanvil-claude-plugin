import { defineConfig } from 'vitest/config';
import { config } from 'dotenv';

// Load .env file for API credentials
config();

export default defineConfig({
  test: {
    // Test environment
    environment: 'node',

    // Global test timeout (10 seconds)
    testTimeout: 10000,

    // Include test files
    include: ['test/**/*.test.js'],

    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/**/*.js'],
      exclude: ['src/**/*.test.js'],
    },

    // Reporter options
    reporters: ['verbose'],
  },
});
