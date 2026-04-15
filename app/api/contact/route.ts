import { NextRequest, NextResponse } from 'next/server'
import { sendContactEmail } from '@/lib/email'

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = await req.json()

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    const safeName    = escapeHtml(String(name))
    const safeSubject = escapeHtml(String(subject))
    const safeMessage = escapeHtml(String(message)).replace(/\n/g, '<br>')

    if (!process.env.RESEND_API_KEY) {
      // Development fallback: log only non-PII
      console.log('[contact] RESEND_API_KEY not set — skipping email. Subject:', safeSubject)
      return NextResponse.json({ success: true })
    }

    const sent = await sendContactEmail({
      name:        safeName,
      email:       String(email), // raw value as replyTo header — not embedded in HTML
      subject:     safeSubject,
      safeMessage,
    })

    if (!sent) {
      return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[contact] Error:', error)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}
