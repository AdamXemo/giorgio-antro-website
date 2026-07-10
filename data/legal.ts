/**
 * Single source of truth for the legal pages (/privacy, /terms, /returns, /shipping).
 *
 * Values prefixed with TODO_ are placeholders the store owner must supply before
 * the store accepts real payments. They are declared here — never inline in copy —
 * so `grep -r TODO_ data/legal.ts` returns the complete outstanding list.
 */

/** Registered company name as filed with the Belgian Crossroads Bank for Enterprises. */
export const TODO_LEGAL_ENTITY_NAME = 'TODO_LEGAL_ENTITY_NAME'

/** Belgian enterprise number (BCE/KBO), format 0XXX.XXX.XXX */
export const TODO_COMPANY_NUMBER = 'TODO_COMPANY_NUMBER'

/** Belgian VAT number, format BE 0XXX.XXX.XXX */
export const TODO_VAT_NUMBER = 'TODO_VAT_NUMBER'

/** Registered street address, excluding city and country. */
export const TODO_REGISTERED_STREET_ADDRESS = 'TODO_REGISTERED_STREET_ADDRESS'

export interface TraderIdentity {
  brandName: string
  legalEntityName: string
  companyNumber: string
  vatNumber: string
  streetAddress: string
  city: string
  country: string
  email: string
}

export const TRADER: TraderIdentity = {
  brandName: 'ANTRO',
  legalEntityName: TODO_LEGAL_ENTITY_NAME,
  companyNumber: TODO_COMPANY_NUMBER,
  vatNumber: TODO_VAT_NUMBER,
  streetAddress: TODO_REGISTERED_STREET_ADDRESS,
  city: 'Brussels',
  country: 'Belgium',
  email: 'info@giorgioantro.com',
}

/** Date the current revision of the legal pages took effect (ISO 8601). */
export const POLICY_LAST_UPDATED = '2026-07-09'

export interface PolicyTerms {
  /** Days the consumer has to withdraw, from taking physical possession. */
  withdrawalDays: number
  /** Days the trader has to refund, counted from notification of withdrawal. */
  refundDays: number
  /** Years of legal conformity guarantee under EU Directive 2019/771. */
  conformityGuaranteeYears: number
  /** Years accounting records are retained under Belgian law. */
  accountingRetentionYears: number
  /** Who pays to send goods back. Must be disclosed pre-purchase, or the trader bears it. */
  returnShippingBorneBy: 'consumer' | 'trader'
  currency: string
  currencySymbol: string
  shippingRegion: string
  dispatchTime: string
  deliveryEstimate: string
  carrier: string
}

export const POLICY: PolicyTerms = {
  withdrawalDays: 14,
  refundDays: 14,
  conformityGuaranteeYears: 2,
  accountingRetentionYears: 7,
  returnShippingBorneBy: 'consumer',
  currency: 'EUR',
  currencySymbol: '€',
  shippingRegion: 'European Union',
  dispatchTime: '1–3 business days',
  deliveryEstimate: '2–7 business days after dispatch',
  carrier: 'bpost',
}

export interface SubProcessor {
  name: string
  purpose: string
  dataHandled: string
  transfers: string
}

/** Third parties that process customer personal data on our behalf. */
export const SUB_PROCESSORS: SubProcessor[] = [
  {
    name: 'Stripe',
    purpose: 'Payment processing and fraud prevention',
    dataHandled: 'Name, email, billing address, payment card details',
    transfers:
      'Stripe may process data outside the EEA under the EU Standard Contractual Clauses.',
  },
  {
    name: 'Supabase',
    purpose: 'Order database',
    dataHandled: 'Name, email, shipping address, order contents and status',
    transfers: 'Order data is stored in an EU-hosted database region.',
  },
  {
    name: 'Resend',
    purpose: 'Transactional email (order confirmations, replies to enquiries)',
    dataHandled: 'Name, email, order summary',
    transfers:
      'Resend may process data outside the EEA under the EU Standard Contractual Clauses.',
  },
  {
    name: 'Vercel',
    purpose: 'Website hosting and delivery',
    dataHandled: 'IP address and request metadata in transient server logs',
    transfers:
      'Vercel may process data outside the EEA under the EU Standard Contractual Clauses.',
  },
]

export interface DataSubjectRight {
  name: string
  description: string
}

/** GDPR Articles 15–21. */
export const DATA_SUBJECT_RIGHTS: DataSubjectRight[] = [
  {
    name: 'Access',
    description:
      'Obtain confirmation of whether we process your personal data, and receive a copy of it.',
  },
  {
    name: 'Rectification',
    description: 'Have inaccurate personal data corrected and incomplete data completed.',
  },
  {
    name: 'Erasure',
    description:
      'Have your personal data deleted, except where we are legally required to retain it.',
  },
  {
    name: 'Restriction of processing',
    description:
      'Require us to limit how we use your data while a dispute about its accuracy or lawfulness is resolved.',
  },
  {
    name: 'Data portability',
    description:
      'Receive the data you provided to us in a structured, commonly used, machine-readable format, and have it transmitted to another controller.',
  },
  {
    name: 'Objection',
    description:
      'Object at any time to processing based on our legitimate interests, and to any processing for direct marketing.',
  },
]

export interface ProcessingPurpose {
  purpose: string
  data: string
  legalBasis: string
}

export const PROCESSING_PURPOSES: ProcessingPurpose[] = [
  {
    purpose: 'Fulfilling your order and delivering your goods',
    data: 'Name, email, shipping address, order history',
    legalBasis: 'Performance of a contract (GDPR Art. 6(1)(b))',
  },
  {
    purpose: 'Preventing fraudulent and abusive transactions',
    data: 'Payment metadata, IP address',
    legalBasis: 'Legitimate interests (GDPR Art. 6(1)(f))',
  },
  {
    purpose: 'Keeping accounting and tax records',
    data: 'Invoice and transaction records',
    legalBasis: 'Legal obligation (GDPR Art. 6(1)(c))',
  },
  {
    purpose: 'Responding to enquiries sent through our contact form',
    data: 'Name, email, message content',
    legalBasis: 'Legitimate interests (GDPR Art. 6(1)(f))',
  },
  {
    purpose: 'Sending marketing emails about new releases',
    data: 'Name, email',
    legalBasis: 'Consent (GDPR Art. 6(1)(a)), withdrawable at any time',
  },
]

/** Belgian Data Protection Authority — the lead supervisory authority for this store. */
export const SUPERVISORY_AUTHORITY = {
  nameNl: 'Gegevensbeschermingsautoriteit',
  nameFr: 'Autorité de protection des données',
  address: 'Drukpersstraat 35, 1000 Brussels, Belgium',
  website: 'https://www.gegevensbeschermingsautoriteit.be',
} as const

/** European Commission Online Dispute Resolution platform (Regulation (EU) 524/2013). */
export const EU_ODR_PLATFORM_URL = 'https://ec.europa.eu/consumers/odr'
