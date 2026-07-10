import type { Metadata } from 'next'
import Link from 'next/link'
import LegalPage, { LegalSection, legalLink } from '@/components/legal/LegalPage'
import { TRADER, POLICY, EU_ODR_PLATFORM_URL } from '@/data/legal'

export const metadata: Metadata = {
  title: 'Terms & Conditions — ANTRO',
  description:
    'The terms of sale that apply when you buy from ANTRO, including contract formation, payment, delivery, and your statutory rights as an EU consumer.',
}

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="LEGAL"
      title="Terms & Conditions"
      summary="These terms govern every purchase you make from ANTRO. They sit alongside — and never replace — the rights EU consumer law gives you. Please read them before you order."
    >
      <LegalSection n="01" id="who-we-are" title="Who you are contracting with">
        <p>
          This store is operated by <strong>{TRADER.legalEntityName}</strong>, trading as{' '}
          {TRADER.brandName}.
        </p>
        <ul>
          <li>
            <strong>Registered office</strong> — {TRADER.streetAddress}, {TRADER.city},{' '}
            {TRADER.country}
          </li>
          <li>
            <strong>Enterprise number (BCE/KBO)</strong> — {TRADER.companyNumber}
          </li>
          <li>
            <strong>VAT number</strong> — {TRADER.vatNumber}
          </li>
          <li>
            <strong>Email</strong> —{' '}
            <a href={`mailto:${TRADER.email}`} className={legalLink}>
              {TRADER.email}
            </a>
          </li>
        </ul>
        <p>
          These terms apply to consumers — natural persons acting for purposes outside their trade,
          business, or profession.
        </p>
      </LegalSection>

      <LegalSection n="02" id="prices" title="Prices">
        <p>
          All prices are shown in euro ({POLICY.currencySymbol}) and{' '}
          <strong>include VAT where applicable</strong>. The price displayed at the moment you place
          your order is the price that applies. Delivery is free — see our{' '}
          <Link href="/shipping" className={legalLink}>
            shipping page
          </Link>{' '}
          — so the total you pay is the total you see.
        </p>
        <p>
          We take care to price accurately, but errors happen. If a product is listed at an
          obviously incorrect price and we have not yet confirmed your payment, we may decline the
          order and will refund you in full. This does not affect an order we have already accepted.
        </p>
      </LegalSection>

      <LegalSection n="03" id="contract" title="How a contract is formed">
        <p>
          Adding an item to your cart does not create a contract, and neither does reaching the
          checkout page. Your order is an offer to buy.
        </p>
        <p>
          <strong>
            The contract of sale comes into existence when your payment is confirmed by our payment
            provider
          </strong>{' '}
          and we send you an order confirmation by email. Until that moment, either of us may walk
          away. If we cannot accept your order — because an item is unavailable, or because we
          suspect fraud — we will tell you and refund any amount taken in full.
        </p>
        <p>
          We conclude contracts in English. We do not file a copy of the contract text separately;
          your order confirmation email is your record of it, so keep it.
        </p>
      </LegalSection>

      <LegalSection n="04" id="payment" title="Payment">
        <p>
          Payments are processed by <strong>Stripe</strong>. Depending on your country, you may pay
          by card, or by a local method Stripe offers at checkout such as Bancontact or iDEAL. All
          charges are in euro.
        </p>
        <p>
          We never receive or store your card number. Card details are captured by Stripe directly.
          The full amount is taken when you confirm payment.
        </p>
      </LegalSection>

      <LegalSection n="05" id="delivery-risk" title="Delivery and passing of risk">
        <p>
          We ship within the {POLICY.shippingRegion} only. Dispatch and delivery times are set out
          on our{' '}
          <Link href="/shipping" className={legalLink}>
            shipping page
          </Link>
          . We will deliver without undue delay and no later than 30 days after the contract is
          concluded, unless we agree otherwise with you.
        </p>
        <p>
          <strong>
            Risk of loss or damage passes to you when you — or a third party you have named, other
            than the carrier — take physical possession of the goods.
          </strong>{' '}
          If a parcel is lost or damaged in transit before then, that is our problem to solve, not
          yours. Tell us and we will replace the item or refund you.
        </p>
      </LegalSection>

      <LegalSection n="06" id="withdrawal" title="Your right to change your mind">
        <p>
          As an EU consumer you have {POLICY.withdrawalDays} days from the day you receive your
          order to withdraw from the contract, without giving any reason. How to do it, who pays
          return postage, and when you get your money back are all set out in full on our{' '}
          <Link href="/returns" className={legalLink}>
            returns &amp; refunds page
          </Link>
          , which forms part of these terms.
        </p>
      </LegalSection>

      <LegalSection n="07" id="conformity" title="Legal guarantee of conformity">
        <p>
          Under EU Directive 2019/771, we are liable for any lack of conformity that exists at the
          time of delivery and becomes apparent within{' '}
          <strong>{POLICY.conformityGuaranteeYears} years</strong> of delivery. Goods conform if
          they match their description, are fit for their usual purpose, and are of the quality you
          can reasonably expect.
        </p>
        <p>
          Where goods do not conform, you are entitled — free of charge — to have them brought into
          conformity by repair or replacement, or to a proportionate price reduction or termination
          of the contract. Any lack of conformity that becomes apparent within one year of delivery
          is presumed to have existed at delivery, unless we prove otherwise.
        </p>
        <p>
          This guarantee is separate from, and additional to, your {POLICY.withdrawalDays}-day right
          of withdrawal. Normal wear and tear, and damage caused by misuse or by failing to follow
          the care instructions, are not a lack of conformity.
        </p>
      </LegalSection>

      <LegalSection n="08" id="liability" title="Our liability">
        <p>
          We are liable for foreseeable loss caused by our breach of these terms or our negligence.
        </p>
        <p>
          <strong>Nothing in these terms limits or excludes our liability</strong> for death or
          personal injury caused by our negligence, for fraud or fraudulent misrepresentation, under
          the product liability rules of Directive 85/374/EEC, or for any other liability that
          cannot lawfully be limited. In particular, nothing here restricts the mandatory statutory
          rights you have as an EU consumer, including your right of withdrawal and your legal
          guarantee of conformity.
        </p>
        <p>
          Subject to the above, we are not liable for loss that was not foreseeable at the time the
          contract was made, or for loss arising from your use of the goods for a commercial
          purpose.
        </p>
      </LegalSection>

      <LegalSection n="09" id="ip" title="Intellectual property and site use">
        <p>
          The {TRADER.brandName} name, logo, garment designs, photography, and the text of this site
          belong to us and are protected by copyright and trade mark law. You may view and print
          pages for your own personal use. You may not reproduce, resell, or use them commercially
          without our written permission.
        </p>
      </LegalSection>

      <LegalSection n="10" id="law-disputes" title="Governing law and disputes">
        <p>
          These terms and any contract formed under them are governed by the law of{' '}
          <strong>{TRADER.country}</strong>. Where you are a consumer habitually resident in another
          EU member state, this choice of law does not deprive you of the protection of the
          mandatory consumer-protection rules of your own country, and you may bring proceedings in
          the courts of your place of residence.
        </p>
        <p>
          If something goes wrong, email us first — most things are settled in a message or two. If
          we cannot resolve it, the European Commission provides an online dispute resolution
          platform for consumers:{' '}
          <a
            href={EU_ODR_PLATFORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={legalLink}
          >
            {EU_ODR_PLATFORM_URL.replace('https://', '')}
          </a>
          . We are not obliged, and do not undertake, to use an alternative dispute resolution body.
        </p>
      </LegalSection>
    </LegalPage>
  )
}
