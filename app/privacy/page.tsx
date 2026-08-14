import type { Metadata } from 'next'
import LegalPage, {
  LegalSection,
  LegalSubsection,
  LegalDefinitionList,
  LegalDefinition,
  legalLink,
} from '@/components/legal/LegalPage'
import {
  TRADER,
  POLICY,
  PROCESSING_PURPOSES,
  SUB_PROCESSORS,
  DATA_SUBJECT_RIGHTS,
  SUPERVISORY_AUTHORITY,
} from '@/data/legal'

export const metadata: Metadata = {
  title: 'Privacy Policy — ANTRO',
  description:
    'How ANTRO collects, uses, and protects your personal data under the EU General Data Protection Regulation.',
}

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="LEGAL"
      title="Privacy Policy"
      summary="This policy explains what personal data we collect when you shop with us, why we collect it, who we share it with, and the rights you have over it under the EU General Data Protection Regulation (GDPR)."
    >
      <LegalSection n="01" id="controller" title="Who is responsible for your data">
        <p>
          The data controller for the personal data described in this policy is{' '}
          <strong>{TRADER.legalEntityName}</strong>, trading as {TRADER.brandName}, a company
          registered in {TRADER.country} under enterprise number {TRADER.companyNumber}, with its
          registered office at {TRADER.streetAddress}, {TRADER.city}, {TRADER.country}.
        </p>
        <p>
          For any question about this policy or about how we handle your data, write to us at{' '}
          <a href={`mailto:${TRADER.email}`} className={legalLink}>
            {TRADER.email}
          </a>
          . We are not required to appoint a Data Protection Officer and have not done so.
        </p>
      </LegalSection>

      <LegalSection n="02" id="data-we-collect" title="What data we collect">
        <p>We collect only what we need to sell you a garment and get it to you:</p>
        <ul>
          <li>
            <strong>Identity and contact data</strong> — your name and email address.
          </li>
          <li>
            <strong>Delivery data</strong> — the shipping address you give us at checkout.
          </li>
          <li>
            <strong>Order data</strong> — the items you bought, the amount paid, and the status of
            your order.
          </li>
          <li>
            <strong>Technical data</strong> — your IP address and basic request metadata, recorded
            transiently in our host&rsquo;s server logs.
          </li>
        </ul>
        <p>
          <strong>We never see or store your card details.</strong> Payment card data is captured
          directly by Stripe in a payment form hosted by Stripe and transmitted to Stripe&rsquo;s
          systems. It does not pass through, and is never stored on, our servers or our database.
        </p>
      </LegalSection>

      <LegalSection n="03" id="why-we-process" title="Why we process it, and on what legal basis">
        <p>
          The GDPR requires us to have a lawful basis for every purpose for which we use your data.
          Ours are:
        </p>
        <LegalDefinitionList>
          {PROCESSING_PURPOSES.map(({ purpose, data, legalBasis }) => (
            <LegalDefinition key={purpose} term={purpose}>
              {data}
              <span className="block mt-1 text-black/40">{legalBasis}</span>
            </LegalDefinition>
          ))}
        </LegalDefinitionList>
        <p>
          We do not send marketing email unless you have asked us to. Where we rely on your consent,
          you may withdraw it at any time — by using the unsubscribe link in any marketing email, or
          by emailing us — without affecting the lawfulness of processing carried out before you
          withdrew it.
        </p>
      </LegalSection>

      <LegalSection n="04" id="sub-processors" title="Who we share it with">
        <p>
          We do not sell your personal data, and we do not share it for anyone else&rsquo;s
          marketing. We rely on the following service providers, who process data on our
          instructions under a data processing agreement:
        </p>
        <LegalDefinitionList>
          {SUB_PROCESSORS.map(({ name, purpose, dataHandled, transfers }) => (
            <LegalDefinition key={name} term={name}>
              {purpose}.
              <span className="block mt-1 text-black/40">
                Data handled: {dataHandled}. {transfers}
              </span>
            </LegalDefinition>
          ))}
        </LegalDefinitionList>
        <LegalSubsection title="International transfers">
          <p>
            Some of these providers are established outside the European Economic Area, or use
            infrastructure outside it. Where personal data is transferred out of the EEA, that
            transfer is covered by the European Commission&rsquo;s Standard Contractual Clauses, or
            by an adequacy decision, together with supplementary technical measures such as
            encryption in transit and at rest. You may request a copy of the safeguards that apply
            by writing to us.
          </p>
        </LegalSubsection>
        <p>
          We may also disclose data where we are legally obliged to — for example to tax
          authorities, or in response to a valid order from a court or public authority.
        </p>
      </LegalSection>

      <LegalSection n="05" id="retention" title="How long we keep it">
        <ul>
          <li>
            <strong>Order and invoice records</strong> — retained for{' '}
            {POLICY.accountingRetentionYears} years from the end of the financial year in which the
            order was placed, because Belgian accounting and tax law requires it.
          </li>
          <li>
            <strong>Contact form correspondence</strong> — retained for as long as needed to resolve
            your enquiry, and then for up to 12 months in case you follow up.
          </li>
          <li>
            <strong>Marketing contact details</strong> — retained until you withdraw consent or
            unsubscribe.
          </li>
          <li>
            <strong>Server logs</strong> — retained transiently by our host and rotated out
            automatically.
          </li>
        </ul>
        <p>
          When a retention period ends, we delete the data or irreversibly anonymise it so that it
          can no longer be linked to you.
        </p>
      </LegalSection>

      <LegalSection n="06" id="your-rights" title="Your rights">
        <p>
          Under the GDPR (Articles 15 to 21) you have the following rights in relation to your
          personal data:
        </p>
        <ol>
          {DATA_SUBJECT_RIGHTS.map(({ name, description }) => (
            <li key={name}>
              <strong>{name}</strong> — {description}
            </li>
          ))}
        </ol>
        <LegalSubsection title="How to exercise them">
          <p>
            Email{' '}
            <a href={`mailto:${TRADER.email}`} className={legalLink}>
              {TRADER.email}
            </a>{' '}
            stating which right you wish to exercise. We will respond within one month of receiving
            your request. That period may be extended by a further two months where a request is
            complex, in which case we will tell you within the first month and explain why.
            Exercising your rights is free of charge; we may charge a reasonable fee only if a
            request is manifestly unfounded or excessive. We may ask you for information to confirm
            your identity before we act.
          </p>
        </LegalSubsection>
        <LegalSubsection title="Right to lodge a complaint">
          <p>
            If you believe we have handled your data unlawfully, you may lodge a complaint with the
            Belgian Data Protection Authority ({SUPERVISORY_AUTHORITY.nameNl} /{' '}
            {SUPERVISORY_AUTHORITY.nameFr}), {SUPERVISORY_AUTHORITY.address} —{' '}
            <a
              href={SUPERVISORY_AUTHORITY.website}
              target="_blank"
              rel="noopener noreferrer"
              className={legalLink}
            >
              {SUPERVISORY_AUTHORITY.website.replace('https://', '')}
            </a>
            . You may also complain to the supervisory authority of the EU member state where you
            live or work. We would appreciate the chance to address your concern first.
          </p>
        </LegalSubsection>
      </LegalSection>

      <LegalSection n="07" id="cookies" title="Cookies and local storage">
        <p>
          <strong>We do not set advertising or analytics cookies, and we do not track you.</strong>{' '}
          There is no third-party tracking pixel on this site and nothing to consent to, which is
          why you have not been shown a cookie banner.
        </p>
        <p>What we do use is limited to what is strictly necessary to run the shop:</p>
        <ul>
          <li>
            <strong>Your cart</strong> is saved in your browser&rsquo;s{' '}
            <code className="text-black/75">localStorage</code> so that its
            contents survive a page reload. It stays on your device, is never transmitted to us as a
            standalone record, and you can clear it at any time by emptying your cart or clearing
            your browser&rsquo;s site data.
          </li>
          <li>
            <strong>Stripe</strong> sets its own cookies on the checkout page for fraud prevention
            and to make the payment form work. These are strictly necessary to complete a payment.
          </li>
        </ul>
        <p>
          If we ever introduce analytics or marketing cookies, we will ask for your consent before
          setting them, and update this policy first.
        </p>
      </LegalSection>

      <LegalSection n="08" id="security-changes" title="Security and changes to this policy">
        <p>
          All traffic to this site is encrypted with TLS. Access to the order database is restricted
          to server-side credentials that are never exposed to your browser, and row-level security
          is enabled on it.
        </p>
        <p>
          We may update this policy as the business changes. When we do, we will revise the
          &ldquo;last updated&rdquo; date above; if a change materially affects your rights, we will
          take reasonable steps to notify you directly.
        </p>
      </LegalSection>
    </LegalPage>
  )
}
