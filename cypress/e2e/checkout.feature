Feature: Checkout

  The one path that has to work: a shopper puts the jacket in the bag, reaches
  Stripe's payment form, pays, and the resulting webhook records a paid order.

  The card form itself is a cross-origin Stripe iframe and cannot be automated,
  so the payment is completed through the Stripe API instead and only the
  observable outcomes are asserted.

  Requires: `npm run dev` on http://localhost:3000, and Stripe/Supabase
  credentials in .env.local. Writes a real test-mode charge and order row.

  Scenario: A shopper pays for the jacket and the order is recorded
    Given I have added the jacket to my cart
    When I proceed to checkout
    Then a payment intent is created for my cart
    And the Stripe payment form is displayed
    When the payment succeeds in Stripe test mode
    And Stripe delivers the payment_intent.succeeded event
    Then a paid order is recorded for that payment
