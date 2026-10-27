import type { Metadata } from 'next'
import LegalPage, {
  LegalSection,
  LegalSubsection,
  LegalCallout,
  legalLink,
} from '@/components/legal/LegalPage'
import { TRADER, POLICY } from '@/data/legal'

export const metadata: Metadata = {
  title: 'Returns & Refunds — ANTRO',
  description: `Your ${POLICY.withdrawalDays}-day right of withdrawal, how to return an ANTRO order, when you are refunded, and the model withdrawal form.`,
}

export default function ReturnsPage() {
  return (
    <LegalPage
      eyebrow="LEGAL"
      title="Returns & Refunds"
      summary={`You have ${POLICY.withdrawalDays} days to change your mind, for any reason or none. This page explains exactly how that works — what to do, who pays for what, and when your money comes back.`}
    >
      <LegalSection n="01" id="right-of-withdrawal" title="Your 14-day right of withdrawal">
        <p>
          Under the EU Consumer Rights Directive (2011/83/EU) you have the right to withdraw from
          your purchase within <strong>{POLICY.withdrawalDays} days</strong>, without giving any
          reason and without penalty.
        </p>
        <p>
          The {POLICY.withdrawalDays} days run{' '}
          <strong>
            from the day on which you, or a third party you have named other than the carrier, take
            physical possession of the goods
          </strong>{' '}
          — not from the day you ordered. If your order arrives in several parcels, the period runs
          from the day you receive the last item.
        </p>
        <p>
          If the {POLICY.withdrawalDays}th day falls on a weekend or public holiday, the deadline
          moves to the next working day. You do not have to explain yourself, and we will not ask
          you to.
        </p>
      </LegalSection>

      <LegalSection n="02" id="how-to-withdraw" title="How to tell us">
        <p>
          Before the {POLICY.withdrawalDays} days are up, make a clear statement that you are
          withdrawing from the contract. Any unambiguous statement is valid. You can:
        </p>
        <ol>
          <li>
            Email{' '}
            <a href={`mailto:${TRADER.email}`} className={legalLink}>
              {TRADER.email}
            </a>{' '}
            with your order number, saying that you are withdrawing from the contract; or
          </li>
          <li>
            Fill in the model withdrawal form at the bottom of this page and email it to us — using
            it is optional, not required.
          </li>
        </ol>
        <p>
          It is enough that you <strong>send</strong> your notice before the deadline expires. We
          will acknowledge your notice by email without delay.
        </p>
        <p>
          Then send the goods back to us without undue delay, and in any event within{' '}
          {POLICY.withdrawalDays} days of telling us. We will give you the return address when we
          acknowledge your notice.
        </p>
      </LegalSection>

      <LegalSection n="03" id="return-shipping" title="Who pays for the return">
        <p>
          <strong>
            You bear the direct cost of returning the goods to us. We do not provide a prepaid
            return label.
          </strong>
        </p>
        <p>
          We are telling you this before you buy, as the law requires: if a trader fails to disclose
          it in advance, the trader must bear the cost. We recommend a tracked service, because you
          are responsible for the parcel until it reaches us and you will need proof of postage if
          it goes astray.
        </p>
        <p>
          This does not apply if the item is faulty, damaged in transit, or not what you ordered. In
          that case we pay the return postage and you are not out of pocket — see the legal
          guarantee of conformity in our terms.
        </p>
      </LegalSection>

      <LegalSection n="04" id="condition" title="Condition of returned goods">
        <p>
          You may handle and inspect the goods as you would in a shop — try the garment on, check
          the fit, look at the fabric. That is your right and it costs you nothing.
        </p>
        <p>
          You are only liable for any diminished value of the goods resulting from handling that
          goes <strong>beyond what is necessary to establish their nature, characteristics, and
          functioning</strong>. In practice that means we may reduce your refund if a garment comes
          back worn outside, washed, altered, scented, stained, or with its tags removed. We will
          explain any reduction and how we calculated it.
        </p>
        <p>Please return the item with its original tags attached and in its original packaging where you still have it.</p>
      </LegalSection>

      <LegalSection n="05" id="refunds" title="Your refund">
        <p>
          We will refund you <strong>within {POLICY.refundDays} days</strong> of the day we are
          informed of your decision to withdraw.
        </p>
        <p>
          We may withhold the refund until we have received the goods back, or until you supply
          evidence that you have sent them — whichever happens first. Send us the tracking number
          and you will not be kept waiting.
        </p>
        <p>
          Your refund covers everything you paid us, including the original delivery charge —
          delivery is free, so in practice this is the full purchase price. We refund{' '}
          <strong>using the same payment method you used for the original transaction</strong>, via
          Stripe, and you will not incur any fee as a result. Depending on your bank, the money can
          take a few additional working days to appear on your statement.
        </p>
        <p>
          The one deduction we may make is for diminished value, as described above. The cost of
          returning the item to us is separate and is not refunded.
        </p>
      </LegalSection>

      <LegalSection n="06" id="exchanges-faults" title="Faulty items and exchanges">
        <p>
          If your item arrives damaged, faulty, or is not what you ordered, email us with a photo
          and your order number. You are covered by the{' '}
          {POLICY.conformityGuaranteeYears}-year legal guarantee of conformity, which is separate
          from and additional to the {POLICY.withdrawalDays}-day withdrawal right, and we will
          repair, replace, or refund at no cost to you.
        </p>
        <p>
          We do not operate a formal exchange process. If you want a different size, withdraw from
          the contract and place a new order.
        </p>
      </LegalSection>

      <LegalSection n="07" id="model-form" title="Model withdrawal form">
        <p>
          Reproduced from Annex I(B) of Directive 2011/83/EU. Completing this form is{' '}
          <strong>optional</strong> — any clear statement of withdrawal will do. Copy the text
          below, fill in the bracketed fields, and email it to{' '}
          <a href={`mailto:${TRADER.email}`} className={legalLink}>
            {TRADER.email}
          </a>
          .
        </p>

        <LegalCallout>
          <LegalSubsection title="Model withdrawal form">
            <p className="text-black/45 italic">
              (Complete and return this form only if you wish to withdraw from the contract.)
            </p>

            <p>
              To {TRADER.legalEntityName}, {TRADER.streetAddress}, {TRADER.city}, {TRADER.country} —{' '}
              {TRADER.email}:
            </p>

            <p>
              I/We (*) hereby give notice that I/We (*) withdraw from my/our (*) contract of sale of
              the following goods (*)/for the provision of the following service (*),
            </p>

            <ul className="!list-none !pl-0">
              <li>Ordered on (*)/received on (*): ______________________</li>
              <li>Name of consumer(s): ______________________</li>
              <li>Address of consumer(s): ______________________</li>
              <li>
                Signature of consumer(s) (only if this form is notified on paper):
                ______________________
              </li>
              <li>Date: ______________________</li>
            </ul>

            <p className="!mb-0 text-black/45">(*) Delete as appropriate.</p>
          </LegalSubsection>
        </LegalCallout>
      </LegalSection>
    </LegalPage>
  )
}
