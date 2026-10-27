import { Given, Then, When } from '@badeball/cypress-cucumber-preprocessor'
import type {
  CompleteTestPaymentResult,
  DeliverWebhookResult,
  OrderRow,
} from '../support/stripe-tasks'

const PRODUCT_PATH = '/product/antro-classic-hoodie'
const PRODUCT_PRICE = 120

/** Captured from the intercepted PaymentIntent creation and reused downstream. */
let paymentIntentId: string

Given('I have added the jacket to my cart', () => {
  cy.visit(PRODUCT_PATH)
  cy.contains('button:visible', 'ADD TO CART').click()

  // The product page redirects to the cart after the confirmation animation.
  cy.location('pathname', { timeout: 10_000 }).should('eq', '/cart')
  cy.contains('Shopping Cart').should('be.visible')
})

When('I proceed to checkout', () => {
  cy.intercept('POST', '/api/create-payment-intent').as('createPaymentIntent')
  cy.contains('a', 'PROCEED TO CHECKOUT').click()
  cy.location('pathname').should('eq', '/checkout')
})

Then('a payment intent is created for my cart', () => {
  cy.wait('@createPaymentIntent').then(({ request, response }) => {
    // The browser only ever sends ids and quantities — prices are server-side.
    expect(request.body).to.deep.equal({
      items: [{ id: 'antro-classic-hoodie', quantity: 1 }],
    })

    expect(response?.statusCode).to.equal(200)
    const body = response?.body as { clientSecret: string; paymentIntentId: string }
    expect(body.clientSecret).to.match(/^pi_[^_]+_secret_/)
    expect(body.paymentIntentId).to.match(/^pi_/)

    paymentIntentId = body.paymentIntentId
  })
})

Then('the Stripe payment form is displayed', () => {
  // Cross-origin iframe: assert that it mounted, never try to type into it.
  cy.get('iframe[name^="__privateStripeFrame"]', { timeout: 20_000 }).should('exist')
  cy.contains('button', 'PLACE ORDER').should('be.visible')
})

When('the payment succeeds in Stripe test mode', () => {
  cy.then(() =>
    cy
      .task<CompleteTestPaymentResult>('stripe:completeTestPayment', { paymentIntentId })
      .then((result) => {
        expect(result.status).to.equal('succeeded')
        expect(result.amount).to.equal(PRODUCT_PRICE * 100)
      })
  )
})

When('Stripe delivers the payment_intent.succeeded event', () => {
  cy.then(() =>
    cy.task<DeliverWebhookResult>('stripe:deliverWebhook', { paymentIntentId }).then((result) => {
      expect(result.status).to.equal(200)
      expect(JSON.parse(result.body)).to.have.property('received', true)
    })
  )
})

Then('a paid order is recorded for that payment', () => {
  cy.then(() =>
    cy.task<OrderRow | null>('db:findOrderByPaymentIntent', paymentIntentId).then((order) => {
      expect(order, 'order row').to.not.equal(null)
      expect(order?.status).to.equal('paid')
      expect(order?.order_number).to.match(/^ANTRO-\d{11}$/)
      expect(Number(order?.total)).to.equal(PRODUCT_PRICE)
      expect(order?.customer_email).to.equal('e2e@giorgioantro.test')
    })
  )
})
