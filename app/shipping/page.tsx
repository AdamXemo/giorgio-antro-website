import type { Metadata } from 'next'
import Link from 'next/link'
import LegalPage, {
  LegalSection,
  LegalDefinitionList,
  LegalDefinition,
  legalLink,
} from '@/components/legal/LegalPage'
import { TRADER, POLICY } from '@/data/legal'

export const metadata: Metadata = {
  title: 'Shipping — ANTRO',
  description: `Free shipping on every ANTRO order. We deliver within the ${POLICY.shippingRegion}, dispatched in ${POLICY.dispatchTime}.`,
}

export default function ShippingPage() {
  return (
    <LegalPage
      eyebrow="LEGAL"
      title="Shipping"
      summary={`Shipping is free on every order, with no minimum and no thresholds. We currently deliver within the ${POLICY.shippingRegion} only.`}
    >
      <LegalSection n="01" id="cost" title="Shipping is free">
        <p>
          <strong>We ship every order free of charge.</strong> There is no minimum order value, no
          weight surcharge, and no delivery fee added at checkout. The price on the product page is
          the price you pay.
        </p>
      </LegalSection>

      <LegalSection n="02" id="where-we-ship" title="Where we ship">
        <p>
          <strong>We deliver to addresses within the {POLICY.shippingRegion} only.</strong> We
          cannot currently ship to destinations outside the EU, including the United Kingdom,
          Switzerland, Norway, and the United States.
        </p>
        <p>
          If your delivery address is outside the EU, please do not place an order — we will have to
          cancel it and refund you. We are working on expanding where we ship; if you would like to
          be told when we reach your country, email us at{' '}
          <a href={`mailto:${TRADER.email}`} className={legalLink}>
            {TRADER.email}
          </a>
          .
        </p>
        <p>
          Because every delivery is internal to the EU single market, there are no customs duties,
          import charges, or handling fees on your order.
        </p>
      </LegalSection>

      <LegalSection n="03" id="timings" title="Dispatch and delivery times">
        <LegalDefinitionList>
          <LegalDefinition term="Dispatch time">
            {POLICY.dispatchTime} from the moment your payment is confirmed. Orders placed at the
            weekend or on a Belgian public holiday are dispatched on the next working day.
          </LegalDefinition>
          <LegalDefinition term="Carrier">
            {POLICY.carrier}, which hands your parcel to the national postal operator in your
            country for the final leg.
          </LegalDefinition>
          <LegalDefinition term="Estimated delivery">
            {POLICY.deliveryEstimate}. Neighbouring countries are typically at the fast end of that
            range; the periphery of the EU at the slow end.
          </LegalDefinition>
          <LegalDefinition term="Ships from">
            {TRADER.city}, {TRADER.country}.
          </LegalDefinition>
        </LegalDefinitionList>
        <p>
          These estimates are not guarantees — carriers have busy periods and bad weather. What is
          guaranteed is that we will deliver no later than 30 days after your contract is concluded,
          as our{' '}
          <Link href="/terms" className={legalLink}>
            terms
          </Link>{' '}
          set out.
        </p>
      </LegalSection>

      <LegalSection n="04" id="tracking" title="Tracking your order">
        <p>
          You will receive an order confirmation by email as soon as your payment is confirmed, and
          a second email with a tracking number when your parcel leaves us. Tracking can take up to
          24 hours to start showing movement — that is normal and does not mean anything is wrong.
        </p>
        <p>
          Check your spam folder before contacting us. If neither email has arrived within{' '}
          {POLICY.dispatchTime} of ordering, email{' '}
          <a href={`mailto:${TRADER.email}`} className={legalLink}>
            {TRADER.email}
          </a>{' '}
          with your order number.
        </p>
      </LegalSection>

      <LegalSection n="05" id="problems" title="Lost, delayed, and damaged parcels">
        <p>
          Risk passes to you when you take physical possession of the goods. Until then, a parcel
          lost or damaged in transit is our responsibility: tell us and we will replace the item or
          refund you in full.
        </p>
        <p>
          Please give us the correct delivery address. We are not able to redirect a parcel once it
          has been dispatched, and we cannot refund an order delivered to an address you entered
          incorrectly.
        </p>
        <p>
          Changed your mind after it arrives? You have {POLICY.withdrawalDays} days to withdraw —
          see{' '}
          <Link href="/returns" className={legalLink}>
            returns &amp; refunds
          </Link>
          .
        </p>
      </LegalSection>
    </LegalPage>
  )
}
