import { defineConfig } from 'cypress'
import createBundler from '@bahmutov/cypress-esbuild-preprocessor'
import { addCucumberPreprocessorPlugin } from '@badeball/cypress-cucumber-preprocessor'
import { createEsbuildPlugin } from '@badeball/cypress-cucumber-preprocessor/esbuild'
import { config as loadEnv } from 'dotenv'
import {
  completeTestPayment,
  deliverWebhook,
  findOrderByPaymentIntent,
} from './cypress/support/stripe-tasks'

// The e2e tasks need the same credentials the dev server runs with.
loadEnv({ path: '.env.local', quiet: true })

const BASE_URL = process.env.CYPRESS_BASE_URL ?? 'http://localhost:3000'

export default defineConfig({
  e2e: {
    baseUrl: BASE_URL,
    specPattern: 'cypress/e2e/**/*.feature',
    supportFile: 'cypress/support/e2e.ts',
    // Wide enough that the desktop product layout is the visible one.
    viewportWidth: 1440,
    viewportHeight: 900,
    video: false,
    screenshotOnRunFailure: false,
    async setupNodeEvents(on, config) {
      await addCucumberPreprocessorPlugin(on, config)
      on('file:preprocessor', createBundler({ plugins: [createEsbuildPlugin(config)] }))
      on('task', {
        'stripe:completeTestPayment': completeTestPayment,
        'stripe:deliverWebhook': (args: { paymentIntentId: string }) =>
          deliverWebhook({ ...args, baseUrl: BASE_URL }),
        'db:findOrderByPaymentIntent': findOrderByPaymentIntent,
      })
      return config
    },
  },
})
