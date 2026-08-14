import { defineConfig } from 'vitest/config'

/**
 * Sandbox suite — these tests DO hit the network.
 *
 * They talk to the real Stripe API using the `sk_test_…` key from `.env.local`
 * (test mode only; the setup file refuses to run against a live key). Kept in
 * their own config so `npm test` stays hermetic and offline-safe.
 *
 *   npm run test:real-api
 */
export default defineConfig({
  resolve: { tsconfigPaths: true },
  test: {
    environment: 'node',
    include: ['tests/real-api/**/*.test.ts'],
    setupFiles: ['tests/setup/real-api-env.ts'],
    // Network round-trips to Stripe are slower than the default 5s allowance.
    testTimeout: 30_000,
    hookTimeout: 30_000,
    fileParallelism: false,
  },
})
