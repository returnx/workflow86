import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config({path: './default.env'});

export default defineConfig({

  testDir: './tests',
  timeout: 2 * 60 * 1000,
  expect: {
    timeout: 10000
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    headless: false,
    baseURL: process.env.BASE_URL,
    actionTimeout: 0,
    trace: 'on-first-retry',
    storageState: 'storageState.json',
    viewport:{width: 1920, height:1080}
  },
  
  globalSetup: require.resolve('./global-setup'),

  /* Configure projects for major browsers */
  projects: [

    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: {width: 1920, height:1080}
      },
      
    },

  ],

});
