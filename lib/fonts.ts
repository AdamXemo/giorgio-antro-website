/**
 * Font configuration — edit this file to experiment with different typefaces.
 *
 * Two roles:
 *   sans    → body text, UI labels, navigation  (--font-sans    / font-sans)
 *   display → headings, hero titles, logo        (--font-display / font-display)
 *
 * To swap a font:
 *   1. Import the new font from 'next/font/google' (or 'next/font/local')
 *   2. Replace the definition below — keep the same `variable` value
 *   3. Adjust `weight` / `style` as needed for the new typeface
 *
 * Available Google fonts: https://fonts.google.com
 */

import {
  Inter,
  Cormorant_Garamond,
  Sometype_Mono,
  // ── drop-in sans alternatives ──────────────────────────────────────────────
  // DM_Sans, Outfit, Plus_Jakarta_Sans, Syne, Space_Grotesk, Raleway,
  // ── drop-in display alternatives ──────────────────────────────────────────
  Playfair_Display, EB_Garamond, Libre_Baskerville, Bodoni_Moda,
  // Italiana, Didact_Gothic, Cinzel,
  // ── drop-in body alternatives ─────────────────────────────────────────────
  // Roboto, Lato, Source_Sans_3, Nunito, Open_Sans, Work_Sans,
} from 'next/font/google'

// ─── Body / UI font ──────────────────────────────────────────────────────────
export const fontSans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

// ─── Body / editorial copy font ──────────────────────────────────────────────
export const fontBody = Sometype_Mono({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-body',
  display: 'swap',
})

// ─── Display / heading font (menu logo, section headings) ────────────────────
export const fontDisplay = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
})

// ─── Hero title font ──────────────────────────────────────────────────────────
export const fontHero = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  style: ['normal', 'italic'],
  variable: '--font-hero',
  display: 'swap',
})

