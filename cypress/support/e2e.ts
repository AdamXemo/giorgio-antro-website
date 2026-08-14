/**
 * Loaded before every spec.
 *
 * Next's dev overlay and Stripe's iframes both emit noisy cross-origin errors
 * that have nothing to do with the assertions; without this, an unrelated
 * ResizeObserver warning can fail an otherwise good run.
 */
Cypress.on('uncaught:exception', (err) => {
  if (/ResizeObserver loop/.test(err.message)) return false
  return undefined
})
