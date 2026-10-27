import { defineConfig } from 'vitest/config'

/**
 * Default (hermetic) test suite: unit + integration.
 * Nothing here touches the network or a real database — Stripe, Supabase and
 * Resend are all mocked. Tests that hit the real Stripe sandbox live in
 * `tests/real-api` and run from `vitest.real-api.config.ts` instead.
 */
export default defineConfig({
  // Resolves the "@/*" paths declared in tsconfig.json
  resolve: { tsconfigPaths: true },
  test: {
    environment: 'node',
    include: ['tests/unit/**/*.test.ts', 'tests/integration/**/*.test.ts'],
    setupFiles: ['tests/setup/test-env.ts'],
    restoreMocks: true,
    clearMocks: true,
    unstubEnvs: true,
  },
})
