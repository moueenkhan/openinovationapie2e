import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // Implement Node event listeners here if needed
    },
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}', // Adjusted for TypeScript support
    video: false,
    retries: 0,
    defaultCommandTimeout: 10000,
    viewportWidth: 1920,
    viewportHeight: 1080,
    numTestsKeptInMemory: 0,
    baseUrl: process.env.BASE_URL || 'http://127.0.0.1:8000', //
    reporter: 'mochawesome',
    reporterOptions: {
      reportDir: 'cypress/reports',
      reportFilename: 'report',
      quiet: true,
      overwrite: false,
      html: true,
      json: true,
    },
  },
});
