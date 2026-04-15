import { Resend } from 'resend'
import type { Order } from './orders'

function getResend(): Resend {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('[lib/email.ts] RESEND_API_KEY must be set.')
  }
  return new Resend(process.env.RESEND_API_KEY)
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IE', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount)
}

// TODO (human): Replace the Resend onboarding sender with a verified ANTRO domain
// before enabling production order emails.
const FROM_ADDRESS = 'ANTRO <onboarding@resend.dev>'
// Inbox that receives contact form submissions
const CONTACT_TO = process.env.CONTACT_EMAIL ?? 'info@giorgioantro.com'

// ── Order confirmation ────────────────────────────────────────────────────────

export async function sendOrderConfirmation(order: Order): Promise<boolean> {
  const itemRows = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding:8px 0;border-bottom:1px solid #f0f0f0">${escapeHtml(item.productName)}</td>
        <td style="padding:8px 0;border-bottom:1px solid #f0f0f0;text-align:center">${escapeHtml(item.size)}</td>
        <td style="padding:8px 0;border-bottom:1px solid #f0f0f0;text-align:center">${item.quantity}</td>
        <td style="padding:8px 0;border-bottom:1px solid #f0f0f0;text-align:right">${formatCurrency(item.price * item.quantity)}</td>
      </tr>`
    )
    .join('')

  const line2Row = order.customerInfo.address.line2
    ? `<p style="margin:0">${escapeHtml(order.customerInfo.address.line2)}</p>`
    : ''

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;font-family:Arial,sans-serif;color:#333;background:#fff">
  <div style="max-width:600px;margin:0 auto">
    <div style="background:#000;color:#fff;padding:32px;text-align:center">
      <h1 style="margin:0;font-weight:300;letter-spacing:0.3em;font-size:28px">ANTRO</h1>
    </div>
    <div style="padding:32px">
      <h2 style="font-weight:400;margin-top:0">Thank you for your order.</h2>
      <p>Hi ${escapeHtml(order.customerInfo.name)},</p>
      <p>We have received your order and will begin preparing it shortly.</p>

      <div style="background:#f9f9f9;padding:20px;margin:24px 0">
        <p style="margin:0 0 16px"><strong>Order ${order.orderNumber}</strong></p>
        <table style="width:100%;border-collapse:collapse;font-size:14px">
          <thead>
            <tr style="border-bottom:2px solid #eee">
              <th style="text-align:left;padding-bottom:8px">Item</th>
              <th style="text-align:center;padding-bottom:8px">Size</th>
              <th style="text-align:center;padding-bottom:8px">Qty</th>
              <th style="text-align:right;padding-bottom:8px">Price</th>
            </tr>
          </thead>
          <tbody>${itemRows}</tbody>
        </table>
        <div style="margin-top:16px;text-align:right;font-size:14px">
          <p style="margin:4px 0">Subtotal: ${formatCurrency(order.subtotal)}</p>
          <p style="margin:4px 0">Shipping: ${order.shipping === 0 ? 'FREE' : formatCurrency(order.shipping)}</p>
          <p style="margin:8px 0;font-weight:bold;font-size:16px">Total: ${formatCurrency(order.total)}</p>
        </div>
      </div>

      <div style="background:#f9f9f9;padding:20px;margin:24px 0;font-size:14px">
        <p style="margin:0 0 8px"><strong>Shipping to:</strong></p>
        <p style="margin:0">${escapeHtml(order.customerInfo.address.line1)}</p>
        ${line2Row}
        <p style="margin:0">${escapeHtml(order.customerInfo.address.city)}, ${escapeHtml(order.customerInfo.address.state)} ${escapeHtml(order.customerInfo.address.postalCode)}</p>
        <p style="margin:0">${escapeHtml(order.customerInfo.address.country)}</p>
      </div>

      <p>Questions? Visit <a href="${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://giorgioantro.com'}/contact">our contact page</a>.</p>
    </div>
    <div style="text-align:center;padding:20px;color:#999;font-size:12px">
      &copy; ${new Date().getFullYear()} ANTRO. All rights reserved.
    </div>
  </div>
</body>
</html>`

  try {
    const { error } = await getResend().emails.send({
      from:    FROM_ADDRESS,
      to:      order.customerInfo.email,
      subject: `Order Confirmation — ${order.orderNumber}`,
      html,
    })
    if (error) {
      console.error('[sendOrderConfirmation] Resend error:', error)
      return false
    }
    console.log(`[sendOrderConfirmation] Sent for order ${order.orderNumber}`)
    return true
  } catch (err) {
    console.error('[sendOrderConfirmation] Unexpected error:', err)
    return false
  }
}

// ── Contact form forwarding ───────────────────────────────────────────────────

export interface ContactPayload {
  name: string
  email: string
  subject: string
  /** Already HTML-escaped by the caller */
  safeMessage: string
}

export async function sendContactEmail(payload: ContactPayload): Promise<boolean> {
  const { name, email, subject, safeMessage } = payload
  try {
    const { error } = await getResend().emails.send({
      from:    FROM_ADDRESS,
      to:      CONTACT_TO,
      replyTo: email,
      subject: `[ANTRO Contact] ${subject}`,
      html: `
        <p><strong>From:</strong> ${name} &lt;${email}&gt;</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <hr />
        <p>${safeMessage}</p>
      `,
    })
    if (error) {
      console.error('[sendContactEmail] Resend error:', error)
      return false
    }
    return true
  } catch (err) {
    console.error('[sendContactEmail] Unexpected error:', err)
    return false
  }
}
