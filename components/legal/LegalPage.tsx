import { ReactNode } from 'react'
import ScrollReveal from '@/components/ui/ScrollReveal'
import Eyebrow from '@/components/ui/Eyebrow'
import { POLICY_LAST_UPDATED } from '@/data/legal'

/**
 * Shared shell for the four legal routes. Server component — no interactivity
 * beyond ScrollReveal, which is a client component of its own.
 */

/** Link styling used inside legal body copy. Underlined for contrast independence. */
export const legalLink =
  'underline underline-offset-4 decoration-black/25 ' +
  'hover:decoration-black transition-colors ' +
  'rounded-sm focus-visible:outline-none focus-visible:ring-2 ' +
  'focus-visible:ring-black focus-visible:ring-offset-2 ' +
  'focus-visible:ring-offset-white'

/**
 * Body-copy typography. Applied once on the article wrapper via child selectors so
 * each page writes plain semantic HTML instead of repeating utility strings.
 */
const prose = [
  '[&_p]:text-sm [&_p]:leading-loose [&_p]:text-black/60 [&_p]:mb-5',
  '[&_li]:text-sm [&_li]:leading-loose [&_li]:text-black/60',
  '[&_ul]:mb-5 [&_ul]:space-y-2.5 [&_ol]:mb-5 [&_ol]:space-y-2.5',
  '[&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-5 [&_ol]:pl-5',
  '[&_li]:pl-1.5 [&_li]:marker:text-black/30',
  '[&_strong]:font-normal [&_strong]:text-black/85',
  '[&_a]:text-black/85',
].join(' ')

interface LegalPageProps {
  eyebrow: string
  title: string
  /** One-sentence framing shown under the title. */
  summary: string
  children: ReactNode
}

export default function LegalPage({ eyebrow, title, summary, children }: LegalPageProps) {
  return (
    <div className="pt-[73px]">
      <div className="px-6 md:px-12 pt-16 pb-24 md:pb-36">
        {/* The measure itself is the container, so the column centres in the viewport */}
        <div className="max-w-3xl mx-auto">

          <ScrollReveal>
            <header className="mb-16 md:mb-20">
              <Eyebrow label={eyebrow} className="mb-5" />

              <h1 className="font-display font-light text-4xl md:text-5xl leading-[1.1]">
                {title}
              </h1>

              <div className="mt-8 h-px w-16 bg-black/15" />

              <p className="mt-8 text-sm leading-loose text-black/55">
                {summary}
              </p>

              <p className="mt-6 text-[10px] tracking-[0.3em] text-black/30">
                LAST UPDATED{' '}
                <time dateTime={POLICY_LAST_UPDATED}>
                  {formatPolicyDate(POLICY_LAST_UPDATED)}
                </time>
              </p>
            </header>
          </ScrollReveal>

          <article className={prose}>{children}</article>

        </div>
      </div>
    </div>
  )
}

interface LegalSectionProps {
  /** Two-digit index rendered in the margin, e.g. "01". */
  n: string
  id: string
  title: string
  children: ReactNode
}

/** A top-level <h2> section. Number sits in the margin on md+, above the rule on mobile. */
export function LegalSection({ n, id, title, children }: LegalSectionProps) {
  return (
    <ScrollReveal>
      <section
        id={id}
        className="scroll-mt-28 py-10 md:py-12 border-t border-black/8"
      >
        <div className="grid grid-cols-1 md:grid-cols-[4rem_1fr] gap-4 md:gap-10">
          <span
            aria-hidden
            className="text-[10px] tracking-[0.25em] text-black/25 md:pt-2"
          >
            {n}
          </span>

          <div>
            <h2 className="font-display font-light text-2xl md:text-3xl leading-tight mb-7">
              {title}
            </h2>
            {children}
          </div>
        </div>
      </section>
    </ScrollReveal>
  )
}

/** A nested <h3> inside a LegalSection. */
export function LegalSubsection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mt-9 first:mt-0">
      <h3 className="text-[10px] tracking-[0.3em] text-black/45 mb-4">
        {title.toUpperCase()}
      </h3>
      {children}
    </div>
  )
}

/** Boxed, copyable block — used for the statutory model withdrawal form. */
export function LegalCallout({ children }: { children: ReactNode }) {
  return (
    <div className="my-7 border border-black/10 bg-black/[0.02] p-6 md:p-8">
      {children}
    </div>
  )
}

/**
 * Definition-style rows for tabular facts (processing purposes, sub-processors).
 * A <dl> rather than a <table>: these are key–value pairs, not a data grid, and
 * a stacked <dl> stays readable at 375px without horizontal scroll.
 */
export function LegalDefinitionList({ children }: { children: ReactNode }) {
  return <dl className="mb-5 divide-y divide-black/8">{children}</dl>
}

export function LegalDefinition({ term, children }: { term: string; children: ReactNode }) {
  return (
    <div className="py-5 first:pt-0 last:pb-0">
      <dt className="text-sm text-black/85 mb-2">{term}</dt>
      <dd className="text-sm leading-loose text-black/60">{children}</dd>
    </div>
  )
}

function formatPolicyDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`)
    .toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC',
    })
    .toUpperCase()
}
